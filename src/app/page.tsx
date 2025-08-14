'use client';

import { useState, useRef, useEffect } from 'react';
import LanguageSwitcher from '@/components/ui/LanguageSwitcher';
import Sidebar from '@/components/ui/Sidebar';
import { useLanguage } from '@/contexts/LanguageContext';
import { useChat } from '@/contexts/ChatContext';

interface Message {
  id: string;
  content: string;
  role: 'user' | 'assistant';
  timestamp: Date;
}

export default function Home() {
  const { t, currentLanguage } = useLanguage();
  const { currentChat, addChatSession, setCurrentChat } = useChat();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Load messages from current chat when it changes
  useEffect(() => {
    if (currentChat && currentChat.messages) {
      const formattedMessages = currentChat.messages.map(msg => ({
        id: msg.id,
        content: msg.content,
        role: msg.role as 'user' | 'assistant',
        timestamp: new Date(msg.timestamp)
      }));
      setMessages(formattedMessages);
    } else {
      setMessages([]);
    }
  }, [currentChat]);

  const sendMessage = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    const currentInput = input;
    setInput('');
    setIsLoading(true);

    // If this is the first message, create a new chat session
    if (messages.length === 0) {
      const newChat = {
        id: Date.now().toString(),
        title: currentInput.slice(0, 30) + (currentInput.length > 30 ? '...' : ''),
        timestamp: new Date().toLocaleString(),
        preview: currentInput,
        messages: [{
          id: userMessage.id,
          content: currentInput,
          role: 'user' as const, 
          timestamp: userMessage.timestamp.toISOString()
        }]
      };
      addChatSession(newChat);
      setCurrentChat(newChat);
    }

    try {
      const response = await fetch('/api/chat/message', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: currentInput,
          preferredLanguage: currentLanguage.code,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to get response');
      }

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: data.response,
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (error: any) {
      console.error('Error sending message:', error);
      
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: error.message || 'Sorry, I encountered an error. Please try again.',
        timestamp: new Date(),
      };
      
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 flex relative">
      {/* Sidebar - Always visible */}
      <Sidebar isOpen={isSidebarOpen} onToggle={() => setIsSidebarOpen(!isSidebarOpen)} />
      
      {/* Main Content */}
      <div className={`flex-1 flex flex-col transition-all duration-300 ease-out ${
        isSidebarOpen ? 'ml-64' : 'ml-16'
      }`}>
        {/* Header - Fixed at top */}
        <div className="absolute top-0 right-0 z-20 px-6 py-4">
          <div className="flex items-center gap-2">
            {messages.length > 0 && (
              <button
                onClick={() => {
                  setMessages([]);
                  setCurrentChat(null);
                }}
                className="p-2.5 rounded-lg hover:bg-gray-100 transition-all"
                aria-label="New chat"
              >
                <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
              </button>
            )}
            <LanguageSwitcher />
          </div>
        </div>

        {/* Dynamic Content Area */}
        <div className={`flex-1 flex flex-col transition-all duration-700 ease-out ${
          messages.length === 0 ? 'justify-center' : 'justify-start pt-16'
        }`}>
          {/* Logo and Welcome Message - Centered initially */}
          {messages.length === 0 && (
            <div className="flex flex-col items-center justify-center px-6 transition-all duration-700 ease-out transform">
              <div className="text-center mb-12 max-w-2xl mx-auto">
                <h1 className="text-5xl font-bold text-gray-900 mb-3">
                  {t('title')}
                </h1>
                <p className="text-xl text-gray-600">
                  {t('subtitle')}
                </p>
              </div>

              {/* Centered Input Box for initial state */}
              <div className="w-full max-w-2xl mx-auto px-6">
                <div className="relative">
                  <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-1">
                    <div className="flex items-center">
                      <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyPress={handleKeyPress}
                        placeholder={t('inputPlaceholder')}
                        className="flex-1 px-5 py-4 text-base placeholder-gray-400 border-none outline-none bg-transparent"
                        disabled={isLoading}
                        autoFocus
                      />
                      <button 
                        onClick={sendMessage}
                        disabled={!input.trim() || isLoading}
                        className="mr-1 bg-gray-900 text-white rounded-xl p-3 hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <svg 
                          width="20" 
                          height="20" 
                          viewBox="0 0 24 24" 
                          fill="none" 
                          stroke="currentColor" 
                          strokeWidth="2" 
                          strokeLinecap="round" 
                          strokeLinejoin="round"
                        >
                          <line x1="22" y1="2" x2="11" y2="13"></line>
                          <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>

                {/* Example prompts */}
                <div className="flex flex-wrap gap-2 justify-center mt-6">
                  <button 
                    onClick={() => {
                      const message = currentLanguage.code === 'zh' ? '帮我练习加法' : 'Help me practice addition';
                      setInput(message);
                      setTimeout(() => sendMessage(), 0);
                    }}
                    className="bg-white/80 backdrop-blur-sm border border-gray-200 rounded-lg px-4 py-2.5 text-sm text-gray-700 hover:bg-white hover:border-gray-300 transition-all"
                  >
                    {t('practiceAddition')}
                  </button>
                  <button 
                    onClick={() => {
                      const message = currentLanguage.code === 'zh' ? '教我几何学' : 'Teach me geometry';
                      setInput(message);
                      setTimeout(() => sendMessage(), 0);
                    }}
                    className="bg-white/80 backdrop-blur-sm border border-gray-200 rounded-lg px-4 py-2.5 text-sm text-gray-700 hover:bg-white hover:border-gray-300 transition-all"
                  >
                    {t('learnGeometry')}
                  </button>
                  <button 
                    onClick={() => {
                      const message = currentLanguage.code === 'zh' ? '帮我练习乘法表' : 'Help me with times tables';
                      setInput(message);
                      setTimeout(() => sendMessage(), 0);
                    }}
                    className="bg-white/80 backdrop-blur-sm border border-gray-200 rounded-lg px-4 py-2.5 text-sm text-gray-700 hover:bg-white hover:border-gray-300 transition-all"
                  >
                    {t('timesTables')}
                  </button>
                  <button 
                    onClick={() => {
                      const message = currentLanguage.code === 'zh' ? '给我一些文化相关的数学例子' : 'Give me cultural math examples';
                      setInput(message);
                      setTimeout(() => sendMessage(), 0);
                    }}
                    className="bg-white/80 backdrop-blur-sm border border-gray-200 rounded-lg px-4 py-2.5 text-sm text-gray-700 hover:bg-white hover:border-gray-300 transition-all"
                  >
                    {t('culturalExamples')}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Chat Messages Area - Shows when conversation starts */}
          {messages.length > 0 && (
            <>
              <div className="flex-1 overflow-y-auto px-4 py-4">
                <div className="max-w-3xl mx-auto">
                  <div className="space-y-4 pb-4">
                    {messages.map((message) => (
                      <div
                        key={message.id}
                        className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                      >
                        <div className={`group relative max-w-[70%]`}>
                          <div
                            className={`rounded-2xl px-4 py-3 ${
                              message.role === 'user'
                                ? 'bg-gray-900 text-white'
                                : 'bg-white border border-gray-200 text-gray-900 shadow-sm'
                            }`}
                          >
                            <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.content}</p>
                          </div>
                          <span className={`text-xs mt-1 px-2 block ${
                            message.role === 'user' ? 'text-right text-gray-400' : 'text-left text-gray-400'
                          }`}>
                            {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                      </div>
                    ))}
                    
                    {/* Loading indicator */}
                    {isLoading && (
                      <div className="flex justify-start">
                        <div className="bg-white border border-gray-200 rounded-2xl px-4 py-3 shadow-sm">
                          <div className="flex space-x-1.5">
                            <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse"></div>
                            <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse" style={{ animationDelay: '150ms' }}></div>
                            <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse" style={{ animationDelay: '300ms' }}></div>
                          </div>
                        </div>
                      </div>
                    )}
                    <div ref={messagesEndRef} />
                  </div>
                </div>
              </div>

              {/* Input Section - At bottom when in chat mode */}
              <div className="border-t border-gray-200 bg-white/90 backdrop-blur-sm px-4 py-4">
                <div className="max-w-3xl mx-auto">
                  <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-1">
                    <div className="flex items-center">
                      <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyPress={handleKeyPress}
                        placeholder={t('inputPlaceholder')}
                        className="flex-1 px-5 py-3.5 text-base placeholder-gray-400 border-none outline-none bg-transparent"
                        disabled={isLoading}
                      />
                      <button 
                        onClick={sendMessage}
                        disabled={!input.trim() || isLoading}
                        className="mr-1 bg-gray-900 text-white rounded-xl p-3 hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <svg 
                          width="20" 
                          height="20" 
                          viewBox="0 0 24 24" 
                          fill="none" 
                          stroke="currentColor" 
                          strokeWidth="2" 
                          strokeLinecap="round" 
                          strokeLinejoin="round"
                        >
                          <line x1="22" y1="2" x2="11" y2="13"></line>
                          <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Footer text - Always at bottom */}
        <div className="text-center py-3">
          <p className="text-gray-400 text-xs">
            {t('bottomText')}
          </p>
        </div>
      </div>
    </div>
  );
}
