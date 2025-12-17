import React, { useState, useRef, useEffect } from 'react';
import { X, Send, Cpu } from 'lucide-react';
import { sendMessageToGemini } from '../services/geminiService';
import { ChatMessage } from '../types';

const GeminiChat: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isOpen]);

  useEffect(() => {
    if (typeof document === 'undefined') return;
    document.body.style.overflow = isOpen ? 'hidden' : 'unset';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMsg: ChatMessage = { role: 'user', text: input, timestamp: new Date() };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    const responseText = await sendMessageToGemini(input);
    const aiMsg: ChatMessage = { role: 'model', text: responseText, timestamp: new Date() };
    setMessages(prev => {
      const lastModel = [...prev].reverse().find(m => m.role === 'model');
      if (lastModel && lastModel.text === aiMsg.text) {
        return prev;
      }
      return [...prev, aiMsg];
    });
    setIsLoading(false);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleSend();
  };

  return (
    <>
      {/* Trigger Button */}
      <div className="fixed bottom-6 right-6 z-40">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className={`
            w-12 h-12 flex items-center justify-center border transition-all duration-300
            ${isOpen 
              ? 'bg-zeith-black border-zeith-metal text-zeith-metal' 
              : 'bg-black border-white/20 text-white hover:border-zeith-metal hover:text-zeith-metalHover'}
          `}
          type="button"
        >
          {isOpen ? <X size={20} /> : <Cpu size={20} />}
        </button>
      </div>

      {/* Chat Window & Backdrop */}
      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-40 bg-black/70 backdrop-blur-sm md:hidden"
            onClick={() => setIsOpen(false)}
          />
          <div className="fixed inset-0 md:inset-auto md:bottom-24 md:right-6 w-full h-[100dvh] md:w-96 md:h-[520px] z-50 bg-black border border-white/10 md:rounded-lg flex flex-col shadow-2xl overflow-hidden">
            {/* Header */}
            <div className="p-4 border-b border-white/10 bg-zeith-gray flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-zeith-metal animate-pulse"></div>
                <span className="text-xs uppercase tracking-wider text-gray-300">Otto · ZEITH Intelligence</span>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="text-gray-400 hover:text-white transition-colors"
                type="button"
              >
                <X size={16} />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto px-4 py-3 space-y-4 text-base md:text-sm">
              {messages.map((msg, idx) => (
                <div 
                  key={idx} 
                  className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div 
                    className={`
                      max-w-[90%] p-3 border rounded
                      ${msg.role === 'user' 
                        ? 'border-white/30 text-white' 
                        : 'border-zeith-metal/30 text-gray-200 bg-zeith-gray/30'}
                    `}
                  >
                    {msg.text}
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="text-zeith-metal text-xs animate-pulse">Processando...</div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div
              className="p-3 border-t border-white/10 bg-black flex gap-2"
              style={{ paddingBottom: 'calc(12px + env(safe-area-inset-bottom, 0px))' }}
            >
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyPress}
                placeholder="Pergunte sobre estratégia, IA ou agenda."
                className="flex-1 bg-transparent border-none outline-none text-white text-base md:text-sm placeholder-gray-600 focus:ring-0"
              />
              <button 
                onClick={handleSend}
                disabled={isLoading}
                className="text-gray-400 hover:text-zeith-metal disabled:opacity-50"
                type="button"
              >
                <Send size={16} />
              </button>
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default GeminiChat;
