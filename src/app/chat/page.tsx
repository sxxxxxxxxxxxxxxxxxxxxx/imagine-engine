'use client';

import { useState, useRef, useEffect } from 'react';
import WorkspaceLayout from '@/components/WorkspaceLayout';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  imageUrl?: string;
  timestamp: number;
}

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: '你好！我是你的AI创作伙伴 🎨\n\n告诉我你想要创作什么，或者上传图片让我帮你修改。我们可以一步步完善你的创意！',
      timestamp: Date.now()
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // 自动滚动到底部
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // 自动调整输入框高度
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = textareaRef.current.scrollHeight + 'px';
    }
  }, [inputText]);

  // 处理图片上传
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => setUploadedImage(e.target?.result as string);
      reader.readAsDataURL(file);
    }
  };

  // 处理图片粘贴
  const handlePaste = (e: React.ClipboardEvent) => {
    const items = e.clipboardData?.items;
    if (items) {
      for (let i = 0; i < items.length; i++) {
        if (items[i].type.indexOf('image') !== -1) {
          const blob = items[i].getAsFile();
          if (blob) {
            const reader = new FileReader();
            reader.onload = (e) => setUploadedImage(e.target?.result as string);
            reader.readAsDataURL(blob);
          }
        }
      }
    }
  };

  // 语音输入（模拟）
  const handleVoiceInput = () => {
    if (isRecording) {
      setIsRecording(false);
      alert('语音输入功能演示版：实际项目中需要集成语音识别API');
    } else {
      setIsRecording(true);
      // 实际项目中，这里需要集成语音识别API
      setTimeout(() => setIsRecording(false), 3000);
    }
  };

  // 发送消息
  const handleSend = async () => {
    if (!inputText.trim() && !uploadedImage) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: inputText.trim(),
      imageUrl: uploadedImage || undefined,
      timestamp: Date.now()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setUploadedImage(null);
    setIsProcessing(true);

    try {
      // 模拟AI响应（实际需要调用API）
      await new Promise(resolve => setTimeout(resolve, 1500));

      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: '我理解了你的需求！让我为你创作一张图片...',
        imageUrl: 'https://via.placeholder.com/512x512?text=AI+Generated+Image',
        timestamp: Date.now()
      };

      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      console.error('AI response error:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  // 键盘快捷键
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <WorkspaceLayout>
      <div className="h-screen flex flex-col">
        {/* 标题栏 */}
        <div className="glass-card p-4 m-8 mb-0">
          <h1 className="text-xl font-bold" style={{ color: 'var(--text-primary)' }}>💬 AI 伙伴</h1>
          <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>对话式创作，让想象自由流动</p>
        </div>

        {/* 对话区域 */}
        <div className="flex-1 overflow-y-auto p-8 space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`max-w-2xl ${message.role === 'user' ? 'ml-auto' : 'mr-auto'}`}>
                {/* 消息气泡 */}
                <div
                  className={`glass-card p-4 ${
                    message.role === 'user'
                      ? 'bg-gradient-primary'
                      : ''
                  }`}
                  style={message.role === 'assistant' ? { background: 'var(--bg-secondary)' } : undefined}
                >
                  {message.imageUrl && (
                    <img
                      src={message.imageUrl}
                      alt="消息图片"
                      className="w-full rounded-lg mb-3"
                    />
                  )}
                  {message.content && (
                    <p 
                      className="whitespace-pre-wrap" 
                      style={{ color: message.role === 'user' ? 'white' : 'var(--text-primary)' }}
                    >
                      {message.content}
                    </p>
                  )}
                </div>
                
                {/* 时间戳 */}
                <div className={`text-xs mt-1 ${message.role === 'user' ? 'text-right' : 'text-left'}`} style={{ color: 'var(--text-muted)' }}>
                  {new Date(message.timestamp).toLocaleTimeString('zh-CN', {
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </div>
              </div>
            </div>
          ))}

          {/* 处理中指示器 */}
          {isProcessing && (
            <div className="flex justify-start">
              <div className="glass-card p-4" style={{ background: 'var(--bg-secondary)' }}>
                <div className="flex items-center space-x-2">
                  <div className="loading-spinner" />
                  <span style={{ color: 'var(--text-secondary)' }}>AI 正在思考...</span>
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* 输入区域 */}
        <div className="p-8 pt-0">
          <div className="glass-card p-4">
            {/* 已上传的图片预览 */}
            {uploadedImage && (
              <div className="mb-3 relative inline-block">
                <img src={uploadedImage} alt="上传的图片" className="h-20 rounded-lg" />
                <button
                  onClick={() => setUploadedImage(null)}
                  className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center text-white text-sm"
                >
                  ×
                </button>
              </div>
            )}

            {/* 输入框 */}
            <div className="flex items-end space-x-3">
              {/* 图片上传按钮 */}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />
              <button
                onClick={() => fileInputRef.current?.click()}
                className="p-3 bg-white/10 hover:bg-white/20 rounded-xl transition-colors"
                title="上传图片"
              >
                <span className="text-xl">📎</span>
              </button>

              {/* 语音输入按钮 */}
              <button
                onClick={handleVoiceInput}
                className={`p-3 rounded-xl transition-colors ${
                  isRecording
                    ? 'bg-red-500 animate-pulse'
                    : 'bg-white/10 hover:bg-white/20'
                }`}
                title="语音输入"
              >
                <span className="text-xl">{isRecording ? '🔴' : '🎤'}</span>
              </button>

              {/* 文本输入框 */}
              <textarea
                ref={textareaRef}
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyDown={(e) => {
                  if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
                    e.preventDefault();
                    if ((inputText.trim() || uploadedImage) && !isProcessing) {
                      handleSend();
                    }
                  }
                }}
                onPaste={handlePaste}
                placeholder="描述你的创意，或粘贴图片...（Ctrl+Enter发送）"
                className="flex-1 input-glass resize-none max-h-32"
                rows={1}
              />

              {/* 发送按钮 */}
              <button
                onClick={handleSend}
                disabled={(!inputText.trim() && !uploadedImage) || isProcessing}
                className="btn-gradient px-6 py-3 disabled:opacity-50"
              >
                {isProcessing ? '...' : '发送'}
              </button>
            </div>

            {/* 提示文本 */}
            <div className="mt-2 text-xs text-center" style={{ color: 'var(--text-muted)' }}>
              支持拖拽/粘贴图片 • Ctrl+Enter 发送 • 语音输入
            </div>
          </div>
        </div>
      </div>
    </WorkspaceLayout>
  );
}