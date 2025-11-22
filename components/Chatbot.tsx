import React, { useState, useRef, useEffect } from 'react';
import { Icon } from './Icon';
import { useChat } from '../hooks/useChat';

interface ChatbotProps {
  initialMessageContext: string;
}

const Chatbot: React.FC<ChatbotProps> = ({ initialMessageContext }) => {
  const [isOpen, setIsOpen] = useState(false);
  const { messages, input, setInput, handleSubmit, isLoading } = useChat(initialMessageContext);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const toggleOpen = () => setIsOpen(!isOpen);

  return (
    <>
      <button
        onClick={toggleOpen}
        className="fixed bottom-8 right-8 bg-gradient-to-br from-blue-500 to-indigo-600 text-white w-16 h-16 rounded-full shadow-2xl flex items-center justify-center transform transition-transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 z-50"
        aria-label="Open Chatbot"
      >
        <Icon name="chat" className="w-8 h-8" />
      </button>

      {isOpen && (
        <div className="fixed bottom-28 right-8 w-[380px] h-[550px] bg-white rounded-2xl shadow-2xl flex flex-col z-50 border border-gray-200 overflow-hidden animate-fade-in-up">
          <header className="bg-gray-50 p-4 border-b border-gray-200 flex justify-between items-center">
            <div>
              <h3 className="font-bold text-gray-800">دستیار خرید Qbazz</h3>
              <p className="text-sm text-green-500 flex items-center gap-1">
                <span className="w-2 h-2 bg-green-500 rounded-full inline-block"></span>
                آنلاین
              </p>
            </div>
            <button onClick={toggleOpen} className="text-gray-400 hover:text-gray-600">
              <Icon name="close" className="w-6 h-6" />
            </button>
          </header>

          <div className="flex-1 p-4 overflow-y-auto bg-gray-100/50">
            <div className="flex flex-col gap-4">
              {messages.map((msg, index) => (
                <div key={index} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div
                    className={`max-w-xs lg:max-w-md p-3 rounded-2xl ${
                      msg.role === 'user'
                        ? 'bg-indigo-500 text-white rounded-br-lg'
                        : 'bg-white text-gray-800 rounded-bl-lg border border-gray-200'
                    }`}
                  >
                    <p className="text-sm whitespace-pre-wrap">{msg.text}</p>
                  </div>
                </div>
              ))}
               {isLoading && (
                 <div className="flex justify-start">
                    <div className="max-w-xs lg:max-w-md p-3 rounded-2xl bg-white text-gray-800 rounded-bl-lg border border-gray-200">
                       <div className="flex items-center gap-2">
                           <span className="h-2 w-2 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                           <span className="h-2 w-2 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                           <span className="h-2 w-2 bg-gray-400 rounded-full animate-bounce"></span>
                       </div>
                    </div>
                  </div>
                )}
              <div ref={messagesEndRef} />
            </div>
          </div>

          <form onSubmit={handleSubmit} className="p-4 border-t border-gray-200 bg-white">
            <div className="relative">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="چیزی بپرسید..."
                className="w-full pr-12 pl-4 py-3 bg-gray-100 rounded-full border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-400 placeholder:text-gray-500"
                disabled={isLoading}
              />
              <button
                type="submit"
                className="absolute right-2 top-1/2 -translate-y-1/2 bg-indigo-500 text-white rounded-full w-9 h-9 flex items-center justify-center hover:bg-indigo-600 transition-colors disabled:bg-gray-300"
                disabled={isLoading || !input}
              >
                <Icon name="send" className="w-5 h-5" />
              </button>
            </div>
          </form>
        </div>
      )}
      <style>{`
        @keyframes fade-in-up {
          0% { opacity: 0; transform: translateY(20px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in-up { animation: fade-in-up 0.3s ease-out forwards; }
      `}</style>
    </>
  );
};

export default Chatbot;