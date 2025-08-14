'use client';

import { useLanguage } from '@/contexts/LanguageContext';
import { useChat } from '@/contexts/ChatContext';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
  const { t } = useLanguage();
  const { chatHistory, setCurrentChat } = useChat();

  const handleChatSelect = (chat: any) => {
    setCurrentChat(chat);
    onClose();
  };

  return (
    <div className={`fixed top-0 left-0 h-full w-80 bg-white/95 backdrop-blur-md border-r border-gray-200 shadow-xl z-40 transform transition-all duration-300 ease-out ${
      isOpen ? 'translate-x-0' : '-translate-x-full'
    }`}>
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Chat History</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Chat History List */}
        <div className="flex-1 overflow-y-auto p-4">
          <div className="space-y-3">
            {chatHistory.map((chat) => (
              <div
                key={chat.id}
                onClick={() => handleChatSelect(chat)}
                className="p-3 rounded-lg border border-gray-200 hover:bg-gray-50 cursor-pointer transition-colors"
              >
                <div className="flex justify-between items-start mb-1">
                  <h3 className="font-medium text-gray-900 text-sm truncate">{chat.title}</h3>
                  <span className="text-xs text-gray-500 ml-2 flex-shrink-0">{chat.timestamp.split(' ')[0]}</span>
                </div>
                <p className="text-sm text-gray-600 line-clamp-2">{chat.preview}</p>
                <div className="text-xs text-gray-400 mt-1">{chat.timestamp.split(' ')[1]} {chat.timestamp.split(' ')[2]}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-200">
          <button className="w-full bg-gray-900 text-white rounded-lg py-2 px-4 hover:bg-gray-800 transition-colors text-sm">
            New Chat
          </button>
        </div>
    </div>
  );
}