import React, { useRef, useEffect } from 'react';
import type { Message } from '../types';
import { MicIcon, SendIcon, VolumeUpIcon, VolumeOffIcon, PaperclipIcon, XMarkIcon, TrashIcon, SearchIcon } from './Icons';
import Avatar from './Avatar';

interface ChatWindowProps {
  messages: Message[];
  input: string;
  setInput: (value: string) => void;
  handleSubmit: (e: React.FormEvent) => void;
  isLoading: boolean;
  isListening: boolean;
  toggleListening: () => void;
  isTtsEnabled: boolean;
  toggleTts: () => void;
  stagedFiles: File[];
  onRemoveStagedFile: (index: number) => void;
  onFileButtonClick: () => void;
  onClearChat: () => void;
  interimTranscript: string;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  isStandbyModeEnabled: boolean;
}

const ChatWindow: React.FC<ChatWindowProps> = ({
  messages,
  input,
  setInput,
  handleSubmit,
  isLoading,
  isListening,
  toggleListening,
  isTtsEnabled,
  toggleTts,
  stagedFiles,
  onRemoveStagedFile,
  onFileButtonClick,
  onClearChat,
  interimTranscript,
  searchQuery,
  setSearchQuery,
  isStandbyModeEnabled,
}) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div className="flex flex-col h-full bg-black/30 backdrop-blur-sm border border-cyan-500/30 rounded-lg shadow-[0_0_15px_rgba(0,255,255,0.1)]">
      <div className="p-3 border-b border-cyan-500/30 flex justify-between items-center gap-4">
        <h2 className="text-cyan-300 font-mono text-lg tracking-wider whitespace-nowrap">COMMUNICATION LOG</h2>
        <div className="relative w-full max-w-xs">
            <input 
                type="text"
                placeholder="Search history..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-gray-900/70 border border-cyan-700/50 rounded-lg py-1.5 pl-3 pr-8 text-cyan-200 placeholder-cyan-600/70 focus:ring-2 focus:ring-cyan-500 focus:outline-none font-mono text-sm"
            />
            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                <SearchIcon className="h-4 w-4 text-cyan-400" />
            </div>
        </div>
        <div className="flex items-center space-x-2">
            <button onClick={onClearChat} className="text-cyan-400 hover:text-cyan-200 transition-colors" aria-label="Clear chat history">
              <TrashIcon className="h-6 w-6" />
            </button>
            <button onClick={toggleTts} className="text-cyan-400 hover:text-cyan-200 transition-colors" aria-label={isTtsEnabled ? 'Disable text-to-speech' : 'Enable text-to-speech'}>
              {isTtsEnabled ? <VolumeUpIcon className="h-6 w-6" /> : <VolumeOffIcon className="h-6 w-6" />}
            </button>
        </div>
      </div>
      <div className="flex-grow p-4 overflow-y-auto space-y-6">
        {messages.map((msg) => (
          <div key={msg.id} className={`flex items-end gap-3 ${msg.sender === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
            <Avatar sender={msg.sender} />
            <div className={`w-full flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}>
                <div
                  className={`max-w-xl p-3 rounded-lg font-mono text-base ${
                    msg.sender === 'user'
                      ? 'bg-cyan-900/50 text-cyan-200'
                      : 'bg-gray-800/50 text-gray-200'
                  }`}
                >
                  {msg.imageUrl && (
                      <img src={msg.imageUrl} alt="User upload" className="rounded-md mb-2 max-w-xs max-h-64" />
                  )}
                  <div className="prose prose-invert prose-p:text-gray-200 prose-headings:text-cyan-300" dangerouslySetInnerHTML={{ __html: msg.html }}></div>
                </div>
                 <p className="text-xs text-cyan-600/80 mt-1.5 px-1">
                    {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                 </p>
                {msg.groundingChunks && msg.groundingChunks.length > 0 && (
                    <div className="max-w-xl mt-2 w-full border-t border-cyan-800/50 pt-2">
                        <h4 className="text-xs text-cyan-500 font-mono tracking-wider">SOURCES:</h4>
                        <ul className="text-xs list-none space-y-1 mt-1">
                            {msg.groundingChunks.map((chunk, index) => (
                                <li key={index} className="truncate">
                                    <a 
                                        href={chunk.web.uri} 
                                        target="_blank" 
                                        rel="noopener noreferrer"
                                        className="text-cyan-400 hover:text-cyan-200 hover:underline transition-colors"
                                        title={chunk.web.title}
                                    >
                                        {`[${index + 1}] ${chunk.web.title || chunk.web.uri}`}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
            </div>
          </div>
        ))}
        {isLoading && messages[messages.length - 1]?.sender === 'user' && (
           <div className="flex items-end gap-3 flex-row">
            <Avatar sender="ai" />
             <div className="max-w-xl p-3 rounded-lg bg-gray-800/50 text-gray-200">
                <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse [animation-delay:-0.3s]"></div>
                    <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse [animation-delay:-0.15s]"></div>
                    <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse"></div>
                </div>
             </div>
           </div>
        )}
        <div ref={messagesEndRef} />
      </div>
       {isListening && interimTranscript && (
          <div className="px-4 pb-2 text-cyan-300 font-mono italic animate-pulse">
             {interimTranscript}
          </div>
       )}
      <div className="p-4 border-t border-cyan-500/30">
        {stagedFiles.length > 0 && (
            <div className="mb-3 flex flex-wrap gap-2">
                {stagedFiles.map((file, index) => (
                    <div key={index} className="bg-cyan-900/70 text-cyan-200 text-sm rounded-full pl-3 pr-2 py-1 flex items-center gap-2 animate-fade-in font-mono">
                        <span className="truncate max-w-[150px]">{file.name}</span>
                        <button onClick={() => onRemoveStagedFile(index)} className="text-cyan-400 hover:text-white rounded-full hover:bg-cyan-700/50 transition-colors">
                            <XMarkIcon className="h-4 w-4" />
                        </button>
                    </div>
                ))}
            </div>
        )}
        <form onSubmit={handleSubmit} className="flex items-center space-x-2">
          <button
            type="button"
            onClick={toggleListening}
            className={`p-2 rounded-full transition-colors ${
              isListening ? 'bg-red-500/50 text-red-200 animate-pulse' : 'bg-cyan-700/50 text-cyan-300 hover:bg-cyan-600/50'
            } ${isStandbyModeEnabled && 'opacity-50 cursor-not-allowed'}`}
             aria-label={isListening ? 'Stop listening' : 'Start listening'}
             disabled={isStandbyModeEnabled}
          >
            <MicIcon className="h-6 w-6" />
          </button>
          <button
            type="button"
            onClick={onFileButtonClick}
            className="p-2 rounded-full bg-cyan-700/50 text-cyan-300 hover:bg-cyan-600/50 transition-colors"
            aria-label="Attach file"
          >
            <PaperclipIcon className="h-6 w-6" />
          </button>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={isStandbyModeEnabled ? 'Awaiting hotword "J.A.R.V.I.S."...' : 'Sir, how may I be of assistance?'}
            className="w-full bg-gray-900/70 border border-cyan-700/50 rounded-lg p-3 text-cyan-200 placeholder-cyan-600/70 focus:ring-2 focus:ring-cyan-500 focus:outline-none font-mono"
            disabled={isLoading || isStandbyModeEnabled}
          />
          <button
            type="submit"
            disabled={isLoading || (!input && stagedFiles.length === 0)}
            className="p-3 bg-cyan-700/50 text-cyan-300 rounded-lg hover:bg-cyan-600/50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
             aria-label="Send message"
          >
            <SendIcon className="h-6 w-6" />
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChatWindow;
