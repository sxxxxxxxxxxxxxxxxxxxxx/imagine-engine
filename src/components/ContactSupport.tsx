/**
 * 联系客服组件
 * 用户可以通过邮件联系支持
 */

'use client';

import { useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Mail, Send, CheckCircle, X } from 'lucide-react';

interface ContactSupportProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ContactSupport({ isOpen, onClose }: ContactSupportProps) {
  const { language } = useLanguage();
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // 构建mailto链接
    const mailtoLink = `mailto:imagine-engine@2art.fun?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(`
发件人邮箱: ${email}

留言内容:
${message}

---
此邮件来自 Imagine Engine 用户反馈系统
    `)}`;
    
    // 打开默认邮件客户端
    window.location.href = mailtoLink;
    
    setSent(true);
    setTimeout(() => {
      onClose();
      setSent(false);
    }, 2000);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="card relative w-full max-w-lg mx-4 p-8 animate-slide-up">
        {/* 关闭按钮 */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 hover:bg-dark-100 dark:hover:bg-dark-800 rounded-lg transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* 成功状态 */}
        {sent ? (
          <div className="text-center py-12">
            <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
              <CheckCircle className="w-10 h-10 text-green-600 dark:text-green-400" />
            </div>
            <h2 className="text-2xl font-bold text-dark-900 dark:text-dark-50 mb-2">
              {language === 'zh' ? '邮件客户端已打开' : 'Email Client Opened'}
            </h2>
            <p className="text-dark-600 dark:text-dark-400">
              {language === 'zh' ? '请在邮件客户端中发送您的消息' : 'Please send your message in the email client'}
            </p>
          </div>
        ) : (
          <>
            {/* 标题 */}
            <div className="text-center mb-6">
              <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center">
                <Mail className="w-8 h-8 text-primary-600 dark:text-primary-400" />
              </div>
              <h2 className="text-2xl font-bold text-dark-900 dark:text-dark-50 mb-2">
                {language === 'zh' ? '联系我们' : 'Contact Us'}
              </h2>
              <p className="text-dark-600 dark:text-dark-400 text-sm">
                {language === 'zh' 
                  ? '有任何问题或建议？发邮件给我们' 
                  : 'Have questions or suggestions? Email us'}
              </p>
            </div>

            {/* 联系邮箱显示 */}
            <div className="mb-6 p-4 bg-primary-50 dark:bg-primary-900/20 border border-primary-200 dark:border-primary-800 rounded-lg">
              <p className="text-sm text-primary-700 dark:text-primary-300 mb-2">
                {language === 'zh' ? '官方邮箱' : 'Official Email'}
              </p>
              <p className="text-base font-mono font-semibold text-primary-600 dark:text-primary-400">
                imagine-engine@2art.fun
              </p>
            </div>

            {/* 表单 */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* 邮箱 */}
              <div>
                <label className="block text-sm font-medium mb-2 text-dark-700 dark:text-dark-300">
                  {language === 'zh' ? '您的邮箱' : 'Your Email'}
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder={language === 'zh' ? '请输入您的邮箱' : 'Enter your email'}
                  className="w-full px-4 py-3 rounded-lg border border-dark-200 dark:border-dark-800 bg-white dark:bg-dark-900 text-dark-900 dark:text-dark-50 focus:border-primary-500 dark:focus:border-primary-500 outline-none transition-colors"
                />
              </div>

              {/* 主题 */}
              <div>
                <label className="block text-sm font-medium mb-2 text-dark-700 dark:text-dark-300">
                  {language === 'zh' ? '主题' : 'Subject'}
                </label>
                <input
                  type="text"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  required
                  placeholder={language === 'zh' ? '请输入主题' : 'Enter subject'}
                  className="w-full px-4 py-3 rounded-lg border border-dark-200 dark:border-dark-800 bg-white dark:bg-dark-900 text-dark-900 dark:text-dark-50 focus:border-primary-500 dark:focus:border-primary-500 outline-none transition-colors"
                />
              </div>

              {/* 消息 */}
              <div>
                <label className="block text-sm font-medium mb-2 text-dark-700 dark:text-dark-300">
                  {language === 'zh' ? '留言内容' : 'Message'}
                </label>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  required
                  rows={5}
                  placeholder={language === 'zh' ? '请描述您的问题或建议...' : 'Describe your question or suggestion...'}
                  className="w-full px-4 py-3 rounded-lg border border-dark-200 dark:border-dark-800 bg-white dark:bg-dark-900 text-dark-900 dark:text-dark-50 focus:border-primary-500 dark:focus:border-primary-500 outline-none transition-colors resize-none"
                />
              </div>

              {/* 提交按钮 */}
              <button
                type="submit"
                className="w-full btn-primary py-4 flex items-center justify-center gap-2"
              >
                <Send className="w-5 h-5" />
                {language === 'zh' ? '发送邮件' : 'Send Email'}
              </button>
            </form>

            {/* 说明 */}
            <p className="mt-4 text-xs text-center text-dark-500">
              {language === 'zh' 
                ? '点击发送将打开您的默认邮件客户端' 
                : 'Clicking send will open your default email client'}
            </p>
          </>
        )}
      </div>
    </div>
  );
}

