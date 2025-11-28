import React, { useState, useRef, useEffect } from 'react';
import { ChatMessage } from '../types';

interface ChatPanelProps {
  onSendMessage: (message: string) => void;
  isLoading: boolean;
  history: ChatMessage[];
}

const ChatPanel: React.FC<ChatPanelProps> = ({ onSendMessage, isLoading, history }) => {
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim() && !isLoading) {
      onSendMessage(input.trim());
      setInput('');
    }
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [history]);

  return (
    <div className="flex flex-col h-full bg-[#1e1e1e]">
      {/* Header */}
      <div className="px-4 py-2 bg-[#252526] text-xs font-bold text-gray-400 border-b border-gray-700 uppercase tracking-wider flex justify-between items-center">
        <span>AI Command Log</span>
        {isLoading && <span className="text-blue-400 text-[10px] animate-pulse">Processing...</span>}
      </div>

      {/* History Area - Log Style */}
      <div className="flex-1 overflow-y-auto p-4 space-y-2 font-mono text-sm">
        {history.length === 0 && (
            <div className="text-gray-600 text-xs italic text-center mt-4">
                Enter instructions to generate diagrams...
            </div>
        )}
        {history.filter(msg => msg.role === 'user').map((msg) => (
          <div
            key={msg.id}
            className="flex flex-col animate-fadeIn"
          >
             <div className="flex items-baseline gap-2">
                <span className="text-green-500 font-bold text-xs">{'>'}</span>
                <span className="text-gray-300 break-words">{msg.content}</span>
             </div>
             <div className="text-[10px] text-gray-600 ml-4">
                {new Date(msg.timestamp).toLocaleTimeString()}
             </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-3 bg-[#252526] border-t border-gray-700">
        <form onSubmit={handleSubmit} className="relative">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={isLoading}
            placeholder={isLoading ? "AI is working..." : "Type a command (e.g., 'Add User class')"}
            className="w-full bg-[#1e1e1e] text-white text-sm rounded border border-gray-600 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 px-4 py-2 pr-10 outline-none placeholder-gray-500 transition-all font-mono"
            autoFocus
          />
          <button
            type="submit"
            disabled={!input.trim() || isLoading}
            className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-blue-400 disabled:text-gray-600 transition-colors"
          >
            {isLoading ? (
                <span className="block w-4 h-4 border-2 border-gray-500 border-t-blue-500 rounded-full animate-spin"></span>
            ) : (
                <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-5 h-5"
                >
                <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5"
                />
                </svg>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChatPanel;