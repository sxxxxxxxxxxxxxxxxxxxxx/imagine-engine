'use client';

import { useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { MessageCircle, Send, Bot, User } from 'lucide-react';

export default function ChatPage() {
  const { language } = useLanguage();
  const [message, setMessage] = useState('');

  return (
    <div className="page-container">
      <div className="content-wrapper">
        {/* 页面标题 */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-dark-900 dark:text-dark-50 mb-2">
            AI {language === 'zh' ? '助手' : 'Assistant'}
          </h1>
          <p className="text-dark-600 dark:text-dark-400">
            {language === 'zh' ? '智能对话助手，帮助你优化创作' : 'AI chat assistant for creative guidance'}
          </p>
        </div>

        {/* 对话界面占位 */}
        <div className="max-w-4xl mx-auto">
          <div className="card p-12 text-center">
            <div className="w-20 h-20 bg-primary-50 dark:bg-primary-900/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <MessageCircle className="w-10 h-10 text-primary-600 dark:text-primary-400" />
            </div>
            <h2 className="text-2xl font-bold text-dark-900 dark:text-dark-50 mb-3">
              AI {language === 'zh' ? '助手功能开发中' : 'Assistant Coming Soon'}
            </h2>
            <p className="text-dark-600 dark:text-dark-400 max-w-2xl mx-auto">
              {language === 'zh' 
                ? '智能对话助手将帮助你优化提示词、提供创作建议、解答问题。敬请期待！' 
                : 'AI assistant will help optimize prompts, provide creative suggestions, and answer questions. Stay tuned!'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
