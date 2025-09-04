import React, { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import type { Message, GroundingChunk, Task } from './types';
import { Part } from '@google/genai';
import { generateResponseStream } from './services/geminiService';
import { useSpeechSynthesis } from './hooks/useSpeechSynthesis';
import ChatWindow from './components/ChatWindow';
import Module from './components/Module';
import Clock from './components/Clock';
import FacialRecognition from './components/FacialRecognition';
import TaskMatrix from './components/TaskMatrix';
import CoreConfig from './components/CoreConfig';
import Modal from './components/Modal';
import SystemStatus from './components/SystemStatus';
import DOMPurify from 'dompurify';
import { marked } from 'marked';

// Utility to convert a File object to a GoogleGenerativeAI.Part object
const fileToGenerativePart = async (file: File): Promise<Part> => {
  const base64EncodedData = await new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve((reader.result as string).split(',')[1]);
      reader.onerror = error => reject(error);
      reader.readAsDataURL(file);
  });
  return {
      inlineData: {
          mimeType: file.type,
          data: base64EncodedData
      }
  };
};

const CHAT_HISTORY_KEY = 'jarvis-chat-history';
const TASK_LIST_KEY = 'jarvis-task-list';

const App: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>(() => {
    try {
        const savedMessages = localStorage.getItem(CHAT_HISTORY_KEY);
        return savedMessages ? JSON.parse(savedMessages) : [];
    } catch (error) {
        console.error("Failed to parse messages from localStorage", error);
        return [];
    }
  });

  const [tasks, setTasks] = useState<Task[]>(() => {
    try {
        const savedTasks = localStorage.getItem(TASK_LIST_KEY);
        return savedTasks ? JSON.parse(savedTasks) : [];
    } catch (error) {
        console.error("Failed to parse tasks from localStorage", error);
        return [];
    }
  });

  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isTtsEnabled, setIsTtsEnabled] = useState(true);
  const [useWebSearch, setUseWebSearch] = useState(false);
  const [stagedFiles, setStagedFiles] = useState<File[]>([]);
  
  const [isListening, setIsListening] = useState(false);
  const [isStandbyModeEnabled, setIsStandbyModeEnabled] = useState(false);
  const [interimTranscript, setInterimTranscript] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [isClearConfirmVisible, setIsClearConfirmVisible] = useState(false);

  const speechRecognitionRef = useRef<SpeechRecognition | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { speak } = useSpeechSynthesis();

  const resetChat = useCallback(() => {
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
    if (messages.length === 0) {
      resetChat();
    }
     // Clean up object URLs on unmount
    return () => {
      messages.forEach(message => {
        if (message.imageUrl) {
          URL.revokeObjectURL(message.imageUrl);
        }
      });
    };
  }, []);

  useEffect(() => {
     if (messages.length > 0) {
        localStorage.setItem(CHAT_HISTORY_KEY, JSON.stringify(messages.map(({imageUrl, ...rest}) => rest)));
     }
  }, [messages]);

  useEffect(() => {
    localStorage.setItem(TASK_LIST_KEY, JSON.stringify(tasks));
  }, [tasks]);

  const addTask = useCallback((text: string) => {
    if (!text.trim()) return;
    const newTask: Task = {
        id: Date.now().toString(),
        text: text.trim(),
        completed: false,
    };
    setTasks(prev => [...prev, newTask]);
  }, []);

  const handleSendMessage = useCallback(async (messageText: string) => {
    if (!messageText.trim() && stagedFiles.length === 0) return;

    let imageUrl: string | undefined = undefined;
    if (stagedFiles.length > 0 && stagedFiles[0].type.startsWith('image/')) {
        imageUrl = URL.createObjectURL(stagedFiles[0]);
    }

    const userMessage: Message = {
      id: Date.now().toString(),
      sender: 'user',
      text: messageText,
      html: messageText.replace(/\n/g, '<br />'),
      imageUrl: imageUrl,
    };
    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);

    const aiMessageId = (Date.now() + 1).toString();
    const newAiMessage: Message = { id: aiMessageId, sender: 'ai', text: '', html: '' };
    setMessages(prev => [...prev, newAiMessage]);

    try {
      const fileParts = await Promise.all(stagedFiles.map(fileToGenerativePart));
      
      const currentHistory = [...messages, userMessage];
      const stream = await generateResponseStream(currentHistory, useWebSearch, fileParts);
      
      let fullResponse = '';
      let allChunks: GroundingChunk[] = [];

      for await (const chunk of stream) {
        fullResponse += chunk.text;
        
        const groundingChunks = chunk.candidates?.[0]?.groundingMetadata?.groundingChunks;
        if (groundingChunks) {
            allChunks.push(...groundingChunks);
        }

        const uniqueChunks = [...new Map(allChunks.filter(item => item.web?.uri).map(item => [item.web!.uri!, item])).values()];
        
        const streamingHtml = DOMPurify.sanitize(marked.parse(fullResponse.split('TASK_ACTION::')[0] + '█') as string);

        setMessages(prev =>
          prev.map(msg =>
            msg.id === aiMessageId ? { ...msg, text: fullResponse, html: streamingHtml, groundingChunks: uniqueChunks } : msg
          )
        );
      }
      
      let finalResponseText = fullResponse;
      const taskActionRegex = /TASK_ACTION::({.*})/;
      const match = finalResponseText.match(taskActionRegex);

      if (match && match[1]) {
        try {
          const actionData = JSON.parse(match[1]);
          if (actionData.action === 'add' && typeof actionData.task === 'string') {
            addTask(actionData.task);
          } else if (actionData.action === 'complete' && typeof actionData.task === 'string') {
             const taskToComplete = tasks.find(t => !t.completed && t.text.toLowerCase().includes(actionData.task.toLowerCase()));
             if (taskToComplete) {
                toggleTask(taskToComplete.id);
             }
          }
        } catch (e) {
          console.error("Failed to parse task action JSON:", e);
        }
        finalResponseText = finalResponseText.replace(taskActionRegex, '').trim();
      }

      const finalSanitizedHtml = DOMPurify.sanitize(marked.parse(finalResponseText) as string);
      setMessages(prev => prev.map(msg => msg.id === aiMessageId ? {...msg, text: finalResponseText, html: finalSanitizedHtml} : msg));

      if (isTtsEnabled) {
        speak(finalResponseText);
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
      setStagedFiles([]);
    }
  }, [isTtsEnabled, speak, messages, useWebSearch, stagedFiles, addTask, tasks]);
  
  useEffect(() => {
    if (!('webkitSpeechRecognition' in window)) {
        console.warn("Speech recognition is not supported in this browser.");
        return;
    }

    const recognition = new webkitSpeechRecognition();
    recognition.lang = 'en-US';
    recognition.interimResults = true;

    recognition.onresult = (event) => {
        let interim = '';
        let final = '';
        for (let i = event.resultIndex; i < event.results.length; ++i) {
            if (event.results[i].isFinal) {
                final += event.results[i][0].transcript;
            } else {
                interim += event.results[i][0].transcript;
            }
        }

        const finalTrimmed = final.trim().toLowerCase();

        if (speechRecognitionRef.current?.continuous) { // Standby mode
            setInterimTranscript(interim + final); 
            if (finalTrimmed.includes('jarvis')) {
                const command = finalTrimmed.split('jarvis')[1]?.trim();
                if (command) {
                    handleSendMessage(command);
                    setInterimTranscript('');
                }
            }
        } else { // Push-to-talk mode
            setInterimTranscript(interim);
            if (finalTrimmed === 'clear chat' || finalTrimmed === 'reset chat') {
                handleClearChatRequest();
                return;
            }
            if (final) {
                setInput(prev => (prev ? prev + ' ' : '') + final.trim());
            }
        }
    };

    recognition.onerror = (event) => {
        console.error("Speech recognition error:", event.error);
        setIsListening(false);
    };
    
    recognition.onend = () => {
        if (speechRecognitionRef.current?.continuous) {
            speechRecognitionRef.current.start();
        } else {
            setIsListening(false);
        }
    };
    
    speechRecognitionRef.current = recognition;

    return () => {
        recognition.stop();
    };
  }, [handleSendMessage]);

  const toggleStandbyMode = () => {
    const recognition = speechRecognitionRef.current;
    if (!recognition) return;

    setIsStandbyModeEnabled(prev => {
        const nextState = !prev;
        if (nextState) {
            recognition.continuous = true;
            recognition.start();
            setIsListening(true);
        } else {
            recognition.continuous = false;
            recognition.stop();
            setIsListening(false);
        }
        return nextState;
    });
  };

  const toggleListening = () => { // Push-to-talk
    const recognition = speechRecognitionRef.current;
    if (!recognition || isStandbyModeEnabled) return;

    if (isListening) {
        recognition.stop();
    } else {
        setInput('');
        setInterimTranscript('');
        recognition.start();
        setIsListening(true);
    }
  };

  const toggleTask = useCallback((id: string) => {
    setTasks(prev => prev.map(task => task.id === id ? { ...task, completed: !task.completed } : task));
  }, []);

  const clearCompletedTasks = useCallback(() => {
    setTasks(prev => prev.filter(task => !task.completed));
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if(input.trim() || stagedFiles.length > 0) {
      handleSendMessage(input);
      setInput('');
    }
  };

  const handleClearChatRequest = () => {
    setIsClearConfirmVisible(true);
  };

  const handleConfirmClearChat = () => {
    setIsLoading(false);
    setStagedFiles([]);
    setInput('');
    localStorage.removeItem(CHAT_HISTORY_KEY);
    resetChat();
    setIsClearConfirmVisible(false);
  };

  const handleCancelClearChat = () => {
    setIsClearConfirmVisible(false);
  };

  const handleFileButtonClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      setStagedFiles(prev => [...prev, ...Array.from(event.target.files!)]);
    }
    event.target.value = '';
  };

  const removeStagedFile = (index: number) => {
    setStagedFiles(prev => prev.filter((_, i) => i !== index));
  };
  
  const filteredMessages = useMemo(() => {
    if (!searchQuery.trim()) {
      return messages;
    }
    const lowerCaseQuery = searchQuery.toLowerCase().trim();
    return messages.filter(msg =>
      msg.id === 'init-message' ? false : msg.text.toLowerCase().includes(lowerCaseQuery)
    );
  }, [messages, searchQuery]);

  return (
    <div 
      className="min-h-screen text-white p-4"
    >
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm"></div>
      <main className="relative z-10 grid grid-cols-1 md:grid-cols-4 md:grid-rows-3 gap-4 h-[calc(100vh-2rem)]">
        <div className="md:col-span-2 md:row-span-3 h-full min-h-0">
            <ChatWindow 
              messages={filteredMessages}
              input={input}
              setInput={setInput}
              handleSubmit={handleSubmit}
              isLoading={isLoading}
              isListening={isListening}
              toggleListening={toggleListening}
              isTtsEnabled={isTtsEnabled}
              toggleTts={() => setIsTtsEnabled(!isTtsEnabled)}
              stagedFiles={stagedFiles}
              onRemoveStagedFile={removeStagedFile}
              onFileButtonClick={handleFileButtonClick}
              onClearChat={handleClearChatRequest}
              interimTranscript={interimTranscript}
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              isStandbyModeEnabled={isStandbyModeEnabled}
            />
        </div>
        <div className="md:col-start-3">
          <Module title="SYSTEM CLOCK">
            <Clock />
          </Module>
        </div>
        <div className="md:col-start-4">
          <Module title="BIOMETRIC SCAN">
            <FacialRecognition />
          </Module>
        </div>
        <div className="md:col-start-3 md:row-start-2">
            <Module title="SYSTEM STATUS">
                <SystemStatus />
            </Module>
        </div>
        <div className="md:col-start-4 md:row-start-2">
             <CoreConfig 
                isWebSearchEnabled={useWebSearch}
                onWebSearchToggle={() => setUseWebSearch(!useWebSearch)}
                isStandbyModeEnabled={isStandbyModeEnabled}
                onStandbyModeToggle={toggleStandbyMode}
            />
        </div>
        <div className="md:col-span-2 md:col-start-3 md:row-start-3 h-full min-h-0">
           <Module title="TASK MATRIX" className="h-full">
            <TaskMatrix tasks={tasks} onToggleTask={toggleTask} onClearCompletedTasks={clearCompletedTasks} />
          </Module>
        </div>
      </main>
      <Modal
        isOpen={isClearConfirmVisible}
        onClose={handleCancelClearChat}
        onConfirm={handleConfirmClearChat}
        title="Confirm Log Purge"
        confirmText="Purge"
      >
        <p>Are you certain you wish to purge the entire communication log, Sir? This action is irreversible.</p>
      </Modal>
       <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        className="hidden"
        multiple
        accept="image/*,application/pdf,text/plain,text/markdown,text/csv"
      />
    </div>
  );
};

export default App;
