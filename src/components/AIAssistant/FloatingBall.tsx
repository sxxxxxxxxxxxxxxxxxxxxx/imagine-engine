'use client';

import { useState, useEffect, useRef } from 'react';
import { Sparkles, X, Minus } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import ChatPanel from './ChatPanel';

export default function FloatingBall() {
  const { language, t } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [hasUnread, setHasUnread] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [hasMoved, setHasMoved] = useState(false);
  const ballRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
    // 检查是否有未读消息
    const unread = localStorage.getItem('ai-assistant-unread');
    if (unread === 'true') {
      setHasUnread(true);
    }
    
    // 恢复浮动球位置
    const savedPosition = localStorage.getItem('ai-assistant-ball-position');
    if (savedPosition) {
      try {
        const pos = JSON.parse(savedPosition);
        setPosition(pos);
      } catch (error) {
        // 默认位置：右下角
        setPosition({ x: window.innerWidth - 100, y: window.innerHeight - 100 });
      }
    } else {
      // 默认位置：右下角
      setPosition({ x: window.innerWidth - 100, y: window.innerHeight - 100 });
    }
  }, []);

  // 保存位置
  useEffect(() => {
    if (mounted && position.x !== 0 && position.y !== 0) {
      localStorage.setItem('ai-assistant-ball-position', JSON.stringify(position));
    }
  }, [position, mounted]);

  const handleToggle = () => {
    // Toggle功能：点击打开，再次点击关闭
    if (isOpen && !isMinimized) {
      // 已打开 → 关闭
      setIsOpen(false);
    } else {
      // 已关闭或最小化 → 打开
      setIsOpen(true);
      setIsMinimized(false);
      setHasUnread(false);
      localStorage.setItem('ai-assistant-unread', 'false');
    }
  };

  const handleClose = () => {
    setIsOpen(false);
    setIsMinimized(false);
  };

  const handleMinimize = () => {
    setIsMinimized(true);
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsDragging(true);
    setHasMoved(false); // 重置移动标志
    setDragStart({
      x: e.clientX - position.x,
      y: e.clientY - position.y
    });
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging) return;

      const newX = e.clientX - dragStart.x;
      const newY = e.clientY - dragStart.y;

      // 计算拖拽距离
      const distance = Math.sqrt(
        Math.pow(newX - position.x, 2) + 
        Math.pow(newY - position.y, 2)
      );

      // 只要移动了超过5px，就标记为已移动
      if (distance > 5) {
        setHasMoved(true);
        
        // 限制在视口内
        const maxX = window.innerWidth - 80;
        const maxY = window.innerHeight - 80;

        setPosition({
          x: Math.max(20, Math.min(newX, maxX)),
          y: Math.max(20, Math.min(newY, maxY))
        });
      }
    };

    const handleMouseUp = () => {
      if (isDragging) {
        // 只有没有移动时才触发toggle（纯点击）
        if (!hasMoved) {
          handleToggle();
        }
        setIsDragging(false);
        setHasMoved(false);
      }
    };

    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, dragStart, position, hasMoved, isOpen, isMinimized]);

  if (!mounted) return null;

  return (
    <>
      {/* 浮动球 */}
      {(!isOpen || isMinimized) && (
        <div
          ref={ballRef}
          onMouseDown={handleMouseDown}
          className={`fixed z-50 group ${isDragging ? 'cursor-grabbing' : 'cursor-grab'}`}
          style={{
            left: `${position.x}px`,
            top: `${position.y}px`,
            transition: isDragging ? 'none' : 'all 0.3s'
          }}
          title={t('assistant.title')}
        >
          {/* 主球体 */}
          <div 
            className={`relative w-14 h-14 rounded-full shadow-2xl transition-all duration-300 ${!isDragging && 'hover:scale-110 hover:shadow-2xl hover:shadow-primary-500/50'} flex items-center justify-center overflow-hidden`}
            style={{ opacity: isDragging ? 0.8 : 1 }}
          >
            {/* 渐变背景 */}
            <div className="absolute inset-0 bg-gradient-to-br from-primary-400 via-primary-500 to-primary-600 animate-gradient" />
            
            {/* 闪光效果 */}
            <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/20 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-500" />
            
            {/* 图标 */}
            <div className="relative z-10">
              <Sparkles className="w-7 h-7 text-white drop-shadow-lg" />
            </div>
            
            {/* 未读消息红点 */}
            {hasUnread && (
              <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full border-2 border-white dark:border-dark-950 animate-pulse shadow-lg" />
            )}
            
            {/* 悬停提示 */}
            <div className="absolute right-full mr-3 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
              <div className="bg-dark-900 dark:bg-dark-800 text-white text-sm px-3 py-2 rounded-lg whitespace-nowrap shadow-xl">
                {t('assistant.title')}
                <div className="absolute left-full top-1/2 -translate-y-1/2 -ml-1 w-0 h-0 border-t-4 border-b-4 border-l-4 border-transparent border-l-dark-900 dark:border-l-dark-800"></div>
              </div>
            </div>
          </div>

          {/* 脉冲圆环 */}
          <div className="absolute inset-0 rounded-full bg-primary-400 opacity-20 animate-ping" />
        </div>
      )}

      {/* 聊天面板 - 现在由ChatPanel自己管理位置 */}
      {isOpen && !isMinimized && (
        <ChatPanel 
          onClose={handleClose}
          onMinimize={handleMinimize}
          ballPosition={position}
        />
      )}
    </>
  );
}

