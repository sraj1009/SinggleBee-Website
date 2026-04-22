
import React, { useState, useRef, useEffect } from 'react';
import { Product } from '../types';
import { getShoppingAssistantResponse, getShoppingAssistantStream } from '../services/singglebeeService';
import BeeCharacter from './BeeCharacter.tsx';

interface AssistantProps {
  products: Product[];
}

const Assistant: React.FC<AssistantProps> = ({ products }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [messages, setMessages] = useState<{ role: 'user' | 'assistant'; text: string }[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen, isLoading]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim() || isLoading) return;

    const userMessage = query.trim();
    setQuery('');
    setMessages(prev => [...prev, { role: 'user', text: userMessage }]);
    setIsLoading(true);

    // Add an empty assistant message that we will fill
    setMessages(prev => [...prev, { role: 'assistant', text: '' }]);

    try {
      let fullResponse = '';
      await getShoppingAssistantStream(
        userMessage, 
        products, 
        (chunk) => {
          fullResponse = chunk;
          setMessages(prev => {
            const newMessages = [...prev];
            const lastMessage = newMessages[newMessages.length - 1];
            if (lastMessage && lastMessage.role === 'assistant') {
              lastMessage.text = fullResponse;
            }
            return newMessages;
          });
          setIsLoading(false); // Stop loading animation once we start getting chunks
        }
      );
    } catch (error) {
      setMessages(prev => [...prev, { role: 'assistant', text: "Sorry, the hive is a bit busy. Please try again later!" }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed bottom-4 right-3 sm:bottom-6 sm:right-6 md:bottom-8 md:right-8 z-[100] flex flex-col items-end font-sans">
      {isOpen && (
        <div className="w-[calc(100vw-24px)] sm:w-80 md:w-96 h-[min(500px,70vh)] bg-white rounded-2xl sm:rounded-[2rem] md:rounded-[2.5rem] shadow-premium-hover border-2 sm:border-4 border-brand-primary/20 mb-3 sm:mb-4 flex flex-col overflow-hidden animate-slide-up">
          <div className="bg-brand-black p-4 sm:p-5 md:p-6 flex justify-between items-center shrink-0">
            <div className="flex items-center gap-2 sm:gap-3">
              <span className="text-2xl sm:text-3xl animate-buzz flex items-center justify-center">
                <BeeCharacter size="2rem" />
              </span>
              <div>
                <span className="text-brand-primary font-black uppercase tracking-widest text-[9px] sm:text-[10px] block">Hive Assistant</span>
                <span className="text-white/50 text-[7px] sm:text-[8px] font-bold uppercase tracking-widest">Powered by SINGGLEBEE</span>
              </div>
            </div>
            <button onClick={() => setIsOpen(false)} className="text-white hover:text-brand-rose transition-colors font-black text-sm p-1">✕</button>
          </div>

          <div className="flex-grow overflow-y-auto p-3 sm:p-4 md:p-6 space-y-3 sm:space-y-4 custom-scrollbar bg-brand-light/10">
            {messages.length === 0 && (
              <div className="text-center py-8 sm:py-12 flex flex-col items-center gap-3 sm:gap-4">
                <div className="w-12 h-12 sm:w-16 sm:h-16 bg-brand-primary/10 rounded-full flex items-center justify-center text-2xl sm:text-3xl">🍯</div>
                <p className="text-gray-400 font-bold text-xs sm:text-sm italic max-w-[200px]">
                  "Buzzing with excitement to help! Ask me anything about our books or treats."
                </p>
              </div>
            )}
            {messages.map((msg, i) => (
              <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-fade-in`}>
                <div className={`max-w-[85%] px-3.5 sm:px-5 py-2.5 sm:py-3 rounded-xl sm:rounded-[1.5rem] text-xs sm:text-sm font-semibold leading-relaxed ${msg.role === 'user'
                  ? 'bg-brand-black text-brand-primary shadow-sm rounded-tr-none'
                  : 'bg-white text-gray-700 shadow-sm border border-brand-primary/10 rounded-tl-none'
                  }`}>
                  {msg.text}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start animate-fade-in">
                <div className="bg-white border border-brand-primary/10 px-4 sm:px-5 py-2.5 sm:py-3 rounded-xl sm:rounded-[1.5rem] rounded-tl-none shadow-sm">
                  <div className="flex gap-1.5 py-1">
                    <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-brand-primary rounded-full animate-bounce"></div>
                    <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-brand-primary rounded-full animate-bounce delay-75"></div>
                    <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-brand-primary rounded-full animate-bounce delay-150"></div>
                  </div>
                </div>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>

          <form onSubmit={handleSend} className="p-3 sm:p-4 md:p-5 border-t border-brand-light bg-white shrink-0 safe-bottom">
            <div className="relative flex gap-1.5 sm:gap-2">
              <input
                type="text"
                value={query}
                onChange={e => setQuery(e.target.value)}
                placeholder="Message the hive..."
                className="flex-grow pl-3 sm:pl-5 pr-3 sm:pr-4 py-2.5 sm:py-3.5 rounded-xl sm:rounded-2xl bg-brand-light/50 border-2 border-transparent focus:border-brand-primary outline-none text-xs sm:text-sm font-bold shadow-inner transition-all"
              />
              <button
                type="submit"
                disabled={!query.trim() || isLoading}
                className="w-10 h-10 sm:w-12 sm:h-12 bg-brand-black text-brand-primary rounded-xl sm:rounded-2xl flex items-center justify-center hover:bg-brand-dark transition-all shadow-premium active:scale-95 disabled:opacity-50 disabled:grayscale flex-shrink-0"
              >
                <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </form>
        </div>
      )}

      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 rounded-xl sm:rounded-[1.25rem] md:rounded-[1.5rem] shadow-premium-hover flex items-center justify-center text-2xl sm:text-3xl transition-all duration-300 hover:scale-105 active:scale-95 border-2 sm:border-4 border-white ${isOpen ? 'bg-brand-rose text-white rotate-90' : 'bg-brand-primary text-brand-black'
          }`}
      >
        {isOpen ? '✕' : <BeeCharacter size="2rem" />}
      </button>
    </div>
  );
};

export default Assistant;
