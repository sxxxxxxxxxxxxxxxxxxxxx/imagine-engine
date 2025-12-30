'use client';

import { useState, useRef, useEffect } from 'react';
import { Send, Sparkles, X, Minus, Trash2, Lightbulb, Wand2, HelpCircle, Bot } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { chatWithAssistant } from '@/lib/aiAssistant';
import { ProviderManager } from '@/lib/apiProviders';
import MarkdownMessage from './MarkdownMessage';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

interface ChatPanelProps {
  onClose: () => void;
  onMinimize: () => void;
  ballPosition: { x: number; y: number };
}

export default function ChatPanel({ onClose, onMinimize, ballPosition }: ChatPanelProps) {
  const { language, t } = useLanguage();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedModel, setSelectedModel] = useState('Qwen/Qwen2.5-72B-Instruct');
  const [size, setSize] = useState({ width: 380, height: 600 });
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isResizing, setIsResizing] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [resizeDirection, setResizeDirection] = useState<string>('');
  const [resizeStart, setResizeStart] = useState({ x: 0, y: 0, width: 0, height: 0, posX: 0, posY: 0 });
  const [dragStart, setDragStart] = useState({ x: 0, y: 0, panelX: 0, panelY: 0 });
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  // 获取ModelScope的聊天模型
  const modelscopeProvider = ProviderManager.getProviderById('modelscope');
  const chatModels = modelscopeProvider?.models.filter(m => m.type === 'chat') || [];

  // 滚动到底部
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // 加载历史消息、模型选择和窗口大小
  useEffect(() => {
    const stored = localStorage.getItem('ai-assistant-history');
    if (stored) {
      try {
        const history = JSON.parse(stored);
        setMessages(history.map((msg: any) => ({
          ...msg,
          timestamp: new Date(msg.timestamp),
        })));
      } catch (error) {
        console.error('Failed to load chat history:', error);
      }
    }

    // 恢复模型选择
    const savedModel = localStorage.getItem('ai-assistant-model');
    if (savedModel) {
      setSelectedModel(savedModel);
    }

    // 恢复窗口大小
    const savedSize = localStorage.getItem('ai-assistant-panel-size');
    if (savedSize) {
      try {
        const parsedSize = JSON.parse(savedSize);
        setSize(parsedSize);
      } catch (error) {
        console.error('Failed to load panel size:', error);
      }
    }

    // 恢复窗口位置
    const savedPosition = localStorage.getItem('ai-assistant-panel-position');
    if (savedPosition) {
      try {
        const parsedPosition = JSON.parse(savedPosition);
        setPosition(parsedPosition);
      } catch (error) {
        console.error('Failed to load panel position:', error);
      }
    } else {
      // 默认位置：基于浮动球位置，向上偏移一点
      // 浮动球在右下角时，面板显示在其上方
      const defaultX = Math.min(ballPosition.x, window.innerWidth - 400);
      const defaultY = Math.max(20, ballPosition.y - 620);
      setPosition({ 
        x: Math.max(20, defaultX), 
        y: defaultY
      });
    }
  }, [ballPosition]);

  // 保存历史消息
  useEffect(() => {
    if (messages.length > 0) {
      localStorage.setItem('ai-assistant-history', JSON.stringify(messages));
    }
  }, [messages]);

  // 保存模型选择
  useEffect(() => {
    localStorage.setItem('ai-assistant-model', selectedModel);
  }, [selectedModel]);

  // 保存窗口大小
  useEffect(() => {
    localStorage.setItem('ai-assistant-panel-size', JSON.stringify(size));
  }, [size]);

  // 保存窗口位置
  useEffect(() => {
    if (position.x !== 0 || position.y !== 0) {
      localStorage.setItem('ai-assistant-panel-position', JSON.stringify(position));
    }
  }, [position]);

  // 面板拖动处理
  const handleDragStart = (e: React.MouseEvent) => {
    // 只允许在头部区域拖动（不包括按钮）
    const target = e.target as HTMLElement;
    if (target.closest('button') || target.closest('select')) {
      return;
    }
    
    e.preventDefault();
    setIsDragging(true);
    setDragStart({
      x: e.clientX,
      y: e.clientY,
      panelX: position.x,
      panelY: position.y
    });
  };

  // 调整大小处理
  const handleResizeStart = (e: React.MouseEvent, direction: string) => {
    e.preventDefault();
    e.stopPropagation();
    setIsResizing(true);
    setResizeDirection(direction);
    
    setResizeStart({
      x: e.clientX,
      y: e.clientY,
      width: size.width,
      height: size.height,
      posX: position.x,
      posY: position.y
    });
  };

  useEffect(() => {
    const handleDragMove = (e: MouseEvent) => {
      if (!isDragging) return;

      const deltaX = e.clientX - dragStart.x;
      const deltaY = e.clientY - dragStart.y;

      const newX = dragStart.panelX + deltaX;
      const newY = dragStart.panelY + deltaY;

      // 限制在视口内
      const maxX = window.innerWidth - size.width - 20;
      const maxY = window.innerHeight - size.height - 20;

      setPosition({
        x: Math.max(20, Math.min(newX, maxX)),
        y: Math.max(20, Math.min(newY, maxY))
      });
    };

    const handleResizeMove = (e: MouseEvent) => {
      if (!isResizing || !resizeDirection) return;

      const deltaX = e.clientX - resizeStart.x;
      const deltaY = e.clientY - resizeStart.y;

      let newWidth = size.width;
      let newHeight = size.height;
      let newX = position.x;
      let newY = position.y;

      // 8方向调整支持
      if (resizeDirection.includes('right')) {
        newWidth = Math.max(320, Math.min(resizeStart.width + deltaX, window.innerWidth - resizeStart.posX - 20));
      }
      if (resizeDirection.includes('left')) {
        const widthChange = resizeStart.width - deltaX;
        if (widthChange >= 320 && resizeStart.posX + deltaX >= 20) {
          newWidth = widthChange;
          newX = resizeStart.posX + deltaX;
        }
      }
      if (resizeDirection.includes('bottom')) {
        newHeight = Math.max(400, Math.min(resizeStart.height + deltaY, window.innerHeight - resizeStart.posY - 20));
      }
      if (resizeDirection.includes('top')) {
        const heightChange = resizeStart.height - deltaY;
        if (heightChange >= 400 && resizeStart.posY + deltaY >= 20) {
          newHeight = heightChange;
          newY = resizeStart.posY + deltaY;
        }
      }

      setSize({ width: newWidth, height: newHeight });
      setPosition({ x: newX, y: newY });
    };

    const handleMouseUp = () => {
      setIsDragging(false);
      setIsResizing(false);
      setResizeDirection('');
    };

    if (isDragging) {
      document.addEventListener('mousemove', handleDragMove);
      document.addEventListener('mouseup', handleMouseUp);
    }

    if (isResizing) {
      document.addEventListener('mousemove', handleResizeMove);
      document.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      document.removeEventListener('mousemove', handleDragMove);
      document.removeEventListener('mousemove', handleResizeMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, isResizing, resizeDirection, resizeStart, dragStart, position, size]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      role: 'user',
      content: input.trim(),
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await chatWithAssistant(input.trim(), messages, selectedModel);
      
      const assistantMessage: Message = {
        role: 'assistant',
        content: response,
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (error: any) {
      const errorMessage: Message = {
        role: 'assistant',
        content: language === 'zh' 
          ? `抱歉，出现错误：${error.message}` 
          : `Sorry, an error occurred: ${error.message}`,
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
      inputRef.current?.focus();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleClear = () => {
    if (confirm(language === 'zh' ? '确定清空对话历史？' : 'Clear chat history?')) {
      setMessages([]);
      localStorage.removeItem('ai-assistant-history');
    }
  };

  const quickActions = [
    { 
      icon: Lightbulb, 
      label: t('assistant.optimize'),
      action: () => setInput(language === 'zh' ? '请帮我优化这个提示词：' : 'Please optimize this prompt:')
    },
    { 
      icon: Wand2, 
      label: t('assistant.generate'),
      action: () => setInput(language === 'zh' ? '请帮我生成3个提示词变体：' : 'Generate 3 prompt variants:')
    },
    { 
      icon: HelpCircle, 
      label: t('assistant.explain'),
      action: () => setInput(language === 'zh' ? '请解释一下这个概念：' : 'Please explain this concept:')
    },
  ];

  return (
    <div 
      className="fixed z-50 bg-white dark:bg-dark-950 rounded-2xl shadow-2xl border border-dark-200 dark:border-dark-800 flex flex-col overflow-hidden animate-in slide-in-from-bottom-4 duration-300"
      style={{ 
        width: `${size.width}px`, 
        height: `${size.height}px`,
        left: `${position.x}px`,
        top: `${position.y}px`,
        transition: isDragging || isResizing ? 'none' : 'all 0.15s ease-out',
        willChange: isDragging || isResizing ? 'transform' : 'auto'
      }}
    >
      {/* 头部 - 可拖动 */}
      <div 
        className="bg-gradient-to-r from-primary-500 to-primary-600 p-4 backdrop-blur-xl bg-opacity-95 cursor-move"
        onMouseDown={handleDragStart}
      >
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-3">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onClose();
              }}
              className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center hover:bg-white/30 transition-colors cursor-pointer"
              title={t('assistant.close')}
            >
              <Sparkles className="w-5 h-5 text-white" />
            </button>
            <div>
              <h3 className="text-white font-semibold">{t('assistant.title')}</h3>
              <p className="text-white/80 text-xs">{t('assistant.subtitle')}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={onMinimize}
              className="w-8 h-8 rounded-lg hover:bg-white/20 transition-colors flex items-center justify-center"
              title={t('assistant.minimize')}
            >
              <Minus className="w-4 h-4 text-white" />
            </button>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-lg hover:bg-white/20 transition-colors flex items-center justify-center"
              title={t('assistant.close')}
            >
              <X className="w-4 h-4 text-white" />
            </button>
          </div>
        </div>

        {/* 模型选择器 */}
        <div className="flex items-center gap-2">
          <Bot className="w-4 h-4 text-white/80" />
          <select
            value={selectedModel}
            onChange={(e) => setSelectedModel(e.target.value)}
            className="flex-1 bg-white/10 text-white text-xs rounded-lg px-2 py-1.5 border border-white/20 focus:outline-none focus:ring-2 focus:ring-white/30"
          >
            {chatModels.map((model) => (
              <option key={model.id} value={model.id} className="bg-dark-900 text-dark-50">
                {language === 'zh' ? model.nameZh : model.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* 消息区域 */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-dark-50 dark:bg-dark-900 custom-scrollbar">
        {messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center px-6">
            <div className="w-16 h-16 bg-primary-100 dark:bg-primary-900/30 rounded-full flex items-center justify-center mb-4">
              <Sparkles className="w-8 h-8 text-primary-600 dark:text-primary-400" />
            </div>
            <h4 className="text-lg font-semibold text-dark-900 dark:text-dark-50 mb-2">
              {language === 'zh' ? '你好！我是AI助手' : 'Hello! I\'m your AI assistant'}
            </h4>
            <p className="text-sm text-dark-600 dark:text-dark-400 mb-4">
              {language === 'zh' 
                ? '我可以帮你优化提示词、生成变体、解答问题' 
                : 'I can help optimize prompts, generate variants, and answer questions'}
            </p>
            <div className="space-y-2 w-full">
              <p className="text-xs font-semibold text-dark-700 dark:text-dark-300">
                {t('assistant.examplePrompts')}
              </p>
              {[
                t('assistant.example1'),
                t('assistant.example2'),
                t('assistant.example3'),
              ].map((example, i) => (
                <button
                  key={i}
                  onClick={() => setInput(example)}
                  className="w-full text-left px-3 py-2 text-xs bg-white dark:bg-dark-800 rounded-lg hover:bg-primary-50 dark:hover:bg-primary-900/20 text-dark-700 dark:text-dark-300 transition-colors"
                >
                  {example}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <>
            {messages.map((msg, i) => (
              <div
                key={i}
                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} message-enter`}
              >
                <div
                  className={`max-w-[85%] rounded-2xl px-4 py-3 shadow-lg transition-all hover:shadow-xl ${
                    msg.role === 'user'
                      ? 'bg-gradient-to-br from-primary-500 to-primary-600 text-white'
                      : 'bg-white dark:bg-dark-800 text-dark-900 dark:text-dark-50 border border-dark-200 dark:border-dark-700'
                  }`}
                >
                  {msg.role === 'user' ? (
                    <p className="text-sm whitespace-pre-wrap leading-relaxed">{msg.content}</p>
                  ) : (
                    <MarkdownMessage content={msg.content} />
                  )}
                  <p className={`text-xs mt-2 ${msg.role === 'user' ? 'text-white/70' : 'text-dark-500'}`}>
                    {msg.timestamp.toLocaleTimeString(language === 'zh' ? 'zh-CN' : 'en-US', { 
                      hour: '2-digit', 
                      minute: '2-digit' 
                    })}
                  </p>
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-white dark:bg-dark-800 rounded-2xl px-4 py-3 border border-dark-200 dark:border-dark-700">
                  <div className="flex items-center gap-2">
                    <div className="flex gap-1">
                      <div className="w-2 h-2 bg-primary-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                      <div className="w-2 h-2 bg-primary-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                      <div className="w-2 h-2 bg-primary-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                    </div>
                    <span className="text-xs text-dark-500">{t('assistant.thinking')}</span>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </>
        )}
      </div>

      {/* 快速操作 */}
      {messages.length > 0 && (
        <div className="px-4 py-2 bg-white dark:bg-dark-950 border-t border-dark-200 dark:border-dark-800">
          <div className="flex items-center gap-2 overflow-x-auto pb-1">
            <span className="text-xs text-dark-600 dark:text-dark-400 font-medium whitespace-nowrap">
              {t('assistant.quickActions')}:
            </span>
            {quickActions.map((action, i) => {
              const Icon = action.icon;
              return (
                <button
                  key={i}
                  onClick={action.action}
                  className="flex items-center gap-1 px-2 py-1 text-xs bg-dark-100 dark:bg-dark-900 hover:bg-primary-50 dark:hover:bg-primary-900/20 text-dark-700 dark:text-dark-300 rounded-lg transition-colors whitespace-nowrap"
                >
                  <Icon className="w-3 h-3" />
                  {action.label}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* 输入区域 */}
      <div className="p-4 bg-white dark:bg-dark-950 border-t border-dark-200 dark:border-dark-800">
        <div className="flex gap-2">
          <textarea
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={t('assistant.placeholder')}
            className="flex-1 resize-none bg-dark-50 dark:bg-dark-900 border border-dark-200 dark:border-dark-700 rounded-xl px-3 py-2 text-sm text-dark-900 dark:text-dark-50 placeholder-dark-400 focus:outline-none focus:ring-2 focus:ring-primary-400 focus:border-transparent transition-all duration-200"
            rows={2}
            disabled={isLoading}
          />
          <button
            onClick={handleSend}
            disabled={!input.trim() || isLoading}
            className="w-10 h-full bg-primary-500 hover:bg-primary-600 active:scale-95 disabled:bg-dark-300 dark:disabled:bg-dark-700 rounded-xl flex items-center justify-center transition-all duration-200 shadow-md hover:shadow-lg"
            title={t('assistant.send')}
          >
            <Send className="w-5 h-5 text-white" />
          </button>
        </div>
        
        {/* 工具栏 */}
        {messages.length > 0 && (
          <div className="flex items-center justify-between mt-2">
            <p className="text-xs text-dark-500">
              {language === 'zh' ? `${messages.length} 条消息` : `${messages.length} messages`}
            </p>
            <button
              onClick={handleClear}
              className="flex items-center gap-1 px-2 py-1 text-xs text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
            >
              <Trash2 className="w-3 h-3" />
              {t('assistant.clear')}
            </button>
          </div>
        )}
      </div>

      {/* 调整大小手柄 - 8方向全支持 */}
      {/* 边缘手柄 */}
      <div
        onMouseDown={(e) => handleResizeStart(e, 'top')}
        className="absolute top-0 left-4 right-4 h-1 cursor-ns-resize hover:bg-primary-400/30 transition-colors"
        style={{ touchAction: 'none' }}
      />
      <div
        onMouseDown={(e) => handleResizeStart(e, 'bottom')}
        className="absolute bottom-0 left-4 right-4 h-1 cursor-ns-resize hover:bg-primary-400/30 transition-colors"
        style={{ touchAction: 'none' }}
      />
      <div
        onMouseDown={(e) => handleResizeStart(e, 'left')}
        className="absolute left-0 top-4 bottom-4 w-1 cursor-ew-resize hover:bg-primary-400/30 transition-colors"
        style={{ touchAction: 'none' }}
      />
      <div
        onMouseDown={(e) => handleResizeStart(e, 'right')}
        className="absolute right-0 top-4 bottom-4 w-1 cursor-ew-resize hover:bg-primary-400/30 transition-colors"
        style={{ touchAction: 'none' }}
      />
      
      {/* 角手柄 */}
      <div
        onMouseDown={(e) => handleResizeStart(e, 'top-left')}
        className="absolute top-0 left-0 w-4 h-4 cursor-nwse-resize group"
        style={{ touchAction: 'none' }}
      >
        <div className="absolute top-1 left-1 w-2 h-2 rounded-full bg-dark-400 dark:bg-dark-600 group-hover:bg-primary-500 transition-colors" />
      </div>
      <div
        onMouseDown={(e) => handleResizeStart(e, 'top-right')}
        className="absolute top-0 right-0 w-4 h-4 cursor-nesw-resize group"
        style={{ touchAction: 'none' }}
      >
        <div className="absolute top-1 right-1 w-2 h-2 rounded-full bg-dark-400 dark:bg-dark-600 group-hover:bg-primary-500 transition-colors" />
      </div>
      <div
        onMouseDown={(e) => handleResizeStart(e, 'bottom-left')}
        className="absolute bottom-0 left-0 w-4 h-4 cursor-nesw-resize group"
        style={{ touchAction: 'none' }}
      >
        <div className="absolute bottom-1 left-1 w-2 h-2 rounded-full bg-dark-400 dark:bg-dark-600 group-hover:bg-primary-500 transition-colors" />
      </div>
      <div
        onMouseDown={(e) => handleResizeStart(e, 'bottom-right')}
        className="absolute bottom-0 right-0 w-4 h-4 cursor-nwse-resize group"
        style={{ touchAction: 'none' }}
      >
        <div className="absolute bottom-1 right-1 w-2 h-2 rounded-full bg-dark-400 dark:bg-dark-600 group-hover:bg-primary-500 transition-colors" />
      </div>
    </div>
  );
}
