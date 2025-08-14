'use client';

import { useState } from 'react';
import LanguageSwitcher from '@/components/ui/LanguageSwitcher';
import Sidebar from '@/components/ui/Sidebar';
import ChatInterface from '@/components/chat/ChatInterface';
import { useLanguage } from '@/contexts/LanguageContext';
import { useChat } from '@/contexts/ChatContext';

export default function Home() {
  const { t } = useLanguage();
  const { currentChat } = useChat();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 via-gray-100 to-gray-200">
      {/* Sidebar */}
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
      
      {/* Main Content */}
      <div className={`min-h-screen flex flex-col items-center justify-center px-4 transition-all duration-300 ease-out ${
        isSidebarOpen ? 'ml-80' : 'ml-0'
      }`}>
        {/* Sidebar Toggle Button */}
        <div className="absolute top-4 left-4">
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="p-2 bg-white/80 backdrop-blur-sm border border-gray-200 rounded-lg hover:bg-white hover:shadow-sm transition-all"
          >
            <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>

        {/* Language Switcher */}
        <div className="absolute top-4 right-4 z-10">
          <LanguageSwitcher />
        </div>

        {/* Show Chat Interface or Landing Page */}
        {currentChat ? (
          <ChatInterface />
        ) : (
          <>
            {/* Logo/Title Section */}
            <div className="mb-8 text-center">
              <h1 className="text-5xl font-bold text-gray-900 mb-2">
                {t('title')}
              </h1>
              <p className="text-gray-600 text-lg">
                {t('subtitle')}
              </p>
            </div>

            {/* Chat Input Section */}
            <div className="w-full max-w-3xl">
              <div className="relative">
                <div className="bg-white rounded-3xl shadow-sm border border-gray-200 p-6">
                  <div className="flex items-center space-x-4">
                    <div className="flex-1">
                      <input
                        type="text"
                        placeholder={t('inputPlaceholder')}
                        className="w-full text-lg placeholder-gray-500 border-none outline-none resize-none bg-transparent py-2"
                      />
                    </div>
                    <button className="bg-gray-900 text-white rounded-xl w-12 h-12 flex items-center justify-center hover:bg-gray-800 transition-colors">
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
                        <path d="m12 19-7-7 7-7"/>
                        <path d="m19 12-7 7-7-7"/>
                      </svg>
                    </button>
                  </div>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="mt-6 flex flex-wrap gap-3 justify-center">
                <button className="bg-white/80 backdrop-blur-sm border border-gray-200 rounded-full px-4 py-2 text-sm text-gray-700 hover:bg-white hover:shadow-sm transition-all">
                  {t('practiceAddition')}
                </button>
                <button className="bg-white/80 backdrop-blur-sm border border-gray-200 rounded-full px-4 py-2 text-sm text-gray-700 hover:bg-white hover:shadow-sm transition-all">
                  {t('learnGeometry')}
                </button>
                <button className="bg-white/80 backdrop-blur-sm border border-gray-200 rounded-full px-4 py-2 text-sm text-gray-700 hover:bg-white hover:shadow-sm transition-all">
                  {t('timesTables')}
                </button>
                <button className="bg-white/80 backdrop-blur-sm border border-gray-200 rounded-full px-4 py-2 text-sm text-gray-700 hover:bg-white hover:shadow-sm transition-all">
                  {t('culturalExamples')}
                </button>
              </div>
            </div>

            {/* Bottom Section */}
            <div className="mt-12 text-center">
              <p className="text-gray-500 text-sm">
                {t('bottomText')}
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
