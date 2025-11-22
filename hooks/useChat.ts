import React, { useState, useEffect, useCallback } from 'react';
import { ChatMessage } from '../types';
import { getChatStream } from '../services/geminiService';

export const useChat = (initialMessageContext: string) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const resetChat = useCallback(() => {
     setMessages([
      {
        role: 'model',
        text: 'سلام! من دستیار خرید هوشمند شما در qbazz هستم. چطور میتونم کمکتون کنم؟',
      },
    ]);
  }, []);
  
  // Reset the chat when the context changes (e.g., new product page)
  useEffect(() => {
    resetChat();
  }, [initialMessageContext, resetChat]);

  // FIX: The type `React.FormEvent` requires the `React` namespace, which was not imported.
  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage: ChatMessage = { role: 'user', text: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      // History is now managed by the chat service, so we don't pass it here.
      const stream = getChatStream(initialMessageContext, input);
      
      let firstChunk = true;
      for await (const chunk of stream) {
        if (firstChunk) {
            setMessages((prev) => [...prev, { role: 'model', text: chunk }]);
            firstChunk = false;
        } else {
            setMessages((prev) => {
                const newMessages = [...prev];
                newMessages[newMessages.length - 1].text += chunk;
                return newMessages;
            });
        }
      }
    } catch (error) {
      console.error('Error fetching chat response:', error);
      const errorMessage: ChatMessage = { role: 'model', text: 'متاسفانه مشکلی پیش آمده. لطفا دوباره تلاش کنید.' };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  }, [input, isLoading, initialMessageContext]);

  return {
    messages,
    input,
    setInput,
    handleSubmit,
    isLoading,
  };
};
