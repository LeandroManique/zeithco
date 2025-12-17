import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, X, Send, Cpu } from 'lucide-react';
import { sendMessageToGemini } from '../services/geminiService';
import { ChatMessage } from '../types';

const GeminiChat: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: 'model', text: 'Olá. Sou o Otto, o assistente IA da ZEITH.', timestamp: new Date() }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isOpen]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMsg: ChatMessage = { role: 'user', text: input, timestamp: new Date() };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    const responseText = await sendMessageToGemini(input);
    
    const aiMsg: ChatMessage = { role: 'model', text: responseText, timestamp: new Date() };
    setMessages(prev => [...prev, aiMsg]);
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
        >
          {isOpen ? <X size={20} /> : <Cpu size={20} />}
        </button>
      </div>

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 w-80 md:w-96 h-[400px] z-40 bg-black border border-white/10 flex flex-col shadow-2xl">
          {/* Header */}
          <div className="p-3 border-b border-white/10 bg-zeith-gray flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-zeith-metal animate-pulse"></div>
            <span className="text-xs uppercase tracking-wider text-gray-300">Zeith Intelligence</span>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 font-mono text-xs">
            {messages.map((msg, idx) => (
              <div 
                key={idx} 
                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div 
                  className={`
                    max-w-[85%] p-3 border
                    ${msg.role === 'user' 
                      ? 'border-white/30 text-white' 
                      : 'border-zeith-metal/30 text-gray-300 bg-zeith-gray/30'}
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
          <div className="p-3 border-t border-white/10 bg-black flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyPress}
              placeholder="Pergunte sobre estratégia, IA ou agenda."
              className="flex-1 bg-transparent border-none outline-none text-white text-xs placeholder-gray-600 focus:ring-0"
              autoFocus
            />
            <button 
              onClick={handleSend}
              disabled={isLoading}
              className="text-gray-400 hover:text-zeith-metal disabled:opacity-50"
            >
              <Send size={16} />
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default GeminiChat;


