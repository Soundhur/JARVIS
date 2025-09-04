import React, { useState, useEffect, useCallback, useRef } from 'react';
import type { Message, GroundingChunk } from './types';
import { generateResponseStream } from './services/geminiService';
import { useSpeechSynthesis } from './hooks/useSpeechSynthesis';
import ChatWindow from './components/ChatWindow';
import Module from './components/Module';
import Clock from './components/Clock';
import SystemStatus from './components/SystemStatus';
import CoreConfig from './components/CoreConfig'; // Import new component
import DOMPurify from 'dompurify';
import { marked } from 'marked';

const App: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isTtsEnabled, setIsTtsEnabled] = useState(true);
  const [useWebSearch, setUseWebSearch] = useState(false); // State for the toggle
  
  const [isListening, setIsListening] = useState(false);
  const speechRecognitionRef = useRef<SpeechRecognition | null>(null);

  const { speak } = useSpeechSynthesis();

  const initialMessage = useCallback(() => {
    const introText = 'Good day, Sir. J.A.R.V.I.S. online and ready. All systems are nominal. How may I be of assistance?';
    const introMessage: Message = {
      id: 'init-message',
      sender: 'ai',
      text: introText,
      html: introText,
    };
    setMessages([introMessage]);
    if (isTtsEnabled) {
      speak(introMessage.text);
    }
  }, [isTtsEnabled, speak]);


  useEffect(() => {
    // startChat is no longer needed
    initialMessage();
     // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if ('webkitSpeechRecognition' in window) {
      const recognition = new webkitSpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = true;
      recognition.lang = 'en-US';

      recognition.onresult = (event) => {
        let finalTranscript = '';
        for (let i = event.resultIndex; i < event.results.length; ++i) {
          if (event.results[i].isFinal) {
            finalTranscript += event.results[i][0].transcript;
          }
        }
        if (finalTranscript) {
          setInput(finalTranscript);
        }
      };
      
      recognition.onend = () => {
        setIsListening(false);
      };

      recognition.onerror = (event) => {
        console.error("Speech recognition error", event.error);
        setIsListening(false);
      };
      
      speechRecognitionRef.current = recognition;
    }
  }, []);

  const toggleListening = () => {
    if (!speechRecognitionRef.current) return;
    if (isListening) {
      speechRecognitionRef.current.stop();
      setIsListening(false);
    } else {
      setInput('');
      speechRecognitionRef.current.start();
      setIsListening(true);
    }
  };

  const handleSendMessage = useCallback(async (messageText: string) => {
    if (!messageText.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      sender: 'user',
      text: messageText,
      html: messageText.replace(/\n/g, '<br />'),
    };
    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);

    const aiMessageId = (Date.now() + 1).toString();
    const newAiMessage: Message = { id: aiMessageId, sender: 'ai', text: '', html: '' };
    setMessages(prev => [...prev, newAiMessage]);

    try {
      const currentHistory = [...messages, userMessage];
      const stream = await generateResponseStream(currentHistory, useWebSearch);
      
      let fullResponse = '';
      let allChunks: GroundingChunk[] = [];

      for await (const chunk of stream) {
        fullResponse += chunk.text;
        
        const groundingChunks = chunk.candidates?.[0]?.groundingMetadata?.groundingChunks;
        if (groundingChunks) {
            allChunks.push(...groundingChunks);
        }

        const uniqueChunks = [...new Map(allChunks.map(item => [item.web.uri, item])).values()];
        
        // Render markdown as it comes in for a live effect with a cursor
        const streamingHtml = DOMPurify.sanitize(marked.parse(fullResponse + '█') as string);

        setMessages(prev =>
          prev.map(msg =>
            msg.id === aiMessageId ? { ...msg, text: fullResponse, html: streamingHtml, groundingChunks: uniqueChunks } : msg
          )
        );
      }
      
      // Final update without cursor
      const finalSanitizedHtml = DOMPurify.sanitize(marked.parse(fullResponse) as string);
      setMessages(prev => prev.map(msg => msg.id === aiMessageId ? {...msg, text: fullResponse, html: finalSanitizedHtml} : msg));

      if (isTtsEnabled) {
        speak(fullResponse);
      }
    } catch (error) {
      console.error("Error sending message:", error);
      const errorText = 'Apologies, Sir. I seem to be experiencing a communication issue with my core servers.';
      const errorMessage : Message = {
        id: aiMessageId,
        sender: 'ai',
        text: errorText,
        html: errorText,
      };
      setMessages(prev => prev.map(msg => msg.id === aiMessageId ? errorMessage : msg));
      if (isTtsEnabled) speak(errorMessage.text);
    } finally {
      setIsLoading(false);
    }
  }, [isTtsEnabled, speak, messages, useWebSearch]);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if(input.trim()) {
      handleSendMessage(input);
      setInput('');
    }
  };
  
  return (
    <div 
      className="min-h-screen bg-cover bg-center bg-no-repeat text-white p-4"
      style={{ backgroundImage: "url('https://i.imgur.com/gAY807N.jpg')" }}
    >
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm"></div>
      <main className="relative z-10 grid grid-cols-1 md:grid-cols-3 gap-4 h-[calc(100vh-2rem)]">
        <div className="md:col-span-2 h-full">
            <ChatWindow 
              messages={messages}
              input={input}
              setInput={setInput}
              handleSubmit={handleSubmit}
              isLoading={isLoading}
              isListening={isListening}
              toggleListening={toggleListening}
              isTtsEnabled={isTtsEnabled}
              toggleTts={() => setIsTtsEnabled(!isTtsEnabled)}
            />
        </div>
        <div className="flex flex-col gap-4 h-full">
          <Module title="SYSTEM CLOCK">
            <Clock />
          </Module>
          <Module title="CORE STATUS" className="flex-grow">
            <SystemStatus />
          </Module>
          <CoreConfig 
            isWebSearchEnabled={useWebSearch}
            onWebSearchToggle={() => setUseWebSearch(!useWebSearch)}
          />
        </div>
      </main>
    </div>
  );
};

export default App;
