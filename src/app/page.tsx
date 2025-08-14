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
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
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
          role: 'user',
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
    <div className="min-h-screen bg-gradient-to-b from-gray-50 via-gray-100 to-gray-200 flex flex-col">
      {/* Sidebar */}
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
      
      {/* Main Content */}
      <div className={`flex-1 flex flex-col transition-all duration-300 ease-out ${
        isSidebarOpen ? 'ml-80' : 'ml-0'
      }`}>
        {/* Header */}
        <div className="relative px-4 py-4">
          <div className="flex items-center justify-between">
            {/* Sidebar Toggle Button */}
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="p-2 bg-white/80 backdrop-blur-sm border border-gray-200 rounded-lg hover:bg-white hover:shadow-sm transition-all"
            >
              <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>

            {/* Logo/Title Section */}
            <div className="text-center flex-1">
              <h1 className="text-2xl font-bold text-gray-900">
                {t('title')}
              </h1>
              {messages.length === 0 && (
                <p className="text-gray-600 text-sm mt-1">
                  {t('subtitle')}
                </p>
              )}
            </div>

            {/* Language Switcher */}
            <div className="z-10">
              <LanguageSwitcher />
            </div>
          </div>
        </div>

        {/* Chat Messages Area */}
        <div className="flex-1 overflow-y-auto px-4 py-2">
          <div className="max-w-3xl mx-auto">
            {messages.length === 0 ? (
              <div className="flex flex-col items-center justify-center min-h-[40vh]">
                <div className="text-center mb-8">
                  <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                    </svg>
                  </div>
                  <h2 className="text-lg font-medium text-gray-900 mb-2">Start learning math!</h2>
                  <p className="text-gray-500 text-sm">Ask me any math question to begin</p>
                </div>

                {/* Quick Actions */}
                <div className="flex flex-wrap gap-3 justify-center">
                  <button 
                    onClick={() => {
                      const message = currentLanguage.code === 'zh' ? '帮我练习加法' : 'Help me practice addition';
                      setInput(message);
                      setTimeout(() => sendMessage(), 0);
                    }}
                    className="bg-white/80 backdrop-blur-sm border border-gray-200 rounded-full px-4 py-2 text-sm text-gray-700 hover:bg-white hover:shadow-sm transition-all"
                  >
                    {t('practiceAddition')}
                  </button>
                  <button 
                    onClick={() => {
                      const message = currentLanguage.code === 'zh' ? '教我几何学' : 'Teach me geometry';
                      setInput(message);
                      setTimeout(() => sendMessage(), 0);
                    }}
                    className="bg-white/80 backdrop-blur-sm border border-gray-200 rounded-full px-4 py-2 text-sm text-gray-700 hover:bg-white hover:shadow-sm transition-all"
                  >
                    {t('learnGeometry')}
                  </button>
                  <button 
                    onClick={() => {
                      const message = currentLanguage.code === 'zh' ? '帮我练习乘法表' : 'Help me with times tables';
                      setInput(message);
                      setTimeout(() => sendMessage(), 0);
                    }}
                    className="bg-white/80 backdrop-blur-sm border border-gray-200 rounded-full px-4 py-2 text-sm text-gray-700 hover:bg-white hover:shadow-sm transition-all"
                  >
                    {t('timesTables')}
                  </button>
                  <button 
                    onClick={() => {
                      const message = currentLanguage.code === 'zh' ? '给我一些文化相关的数学例子' : 'Give me cultural math examples';
                      setInput(message);
                      setTimeout(() => sendMessage(), 0);
                    }}
                    className="bg-white/80 backdrop-blur-sm border border-gray-200 rounded-full px-4 py-2 text-sm text-gray-700 hover:bg-white hover:shadow-sm transition-all"
                  >
                    {t('culturalExamples')}
                  </button>
                </div>
              </div>
            ) : (
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
            )}
          </div>
        </div>

        {/* Input Section - Always at bottom */}
        <div className="border-t border-gray-200 bg-white/80 backdrop-blur-sm px-4 py-4">
          <div className="max-w-3xl mx-auto">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-4">
              <div className="flex items-center space-x-3">
                <div className="flex-1">
                  <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder={t('inputPlaceholder')}
                    className="w-full text-base placeholder-gray-500 border-none outline-none bg-transparent"
                    disabled={isLoading}
                  />
                </div>
                <button 
                  onClick={sendMessage}
                  disabled={!input.trim() || isLoading}
                  className="bg-gray-900 text-white rounded-xl p-3 hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
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
            
            {/* Bottom text */}
            <div className="text-center mt-3">
              <p className="text-gray-400 text-xs">
                {t('bottomText')}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
