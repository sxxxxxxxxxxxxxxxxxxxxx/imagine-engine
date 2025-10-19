'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useTheme } from '@/contexts/ThemeContext';
import { LanguageSwitcher } from '@/contexts/LanguageContext';
import SettingsModal from './SettingsModal';
import HelpCenter from './HelpCenter';

export default function SideNav() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showHelp, setShowHelp] = useState(false);
  const pathname = usePathname();
  const { theme, toggleTheme } = useTheme();

  const navItems = [
    {
      icon: '✨',
      label: 'AI 创作',
      path: '/create',
      description: '文字生成图片'
    },
    {
      icon: '🔧',
      label: 'AI 编辑',
      path: '/edit',
      description: '智能图片编辑'
    },
    {
      icon: '🎨',
      label: '创意工坊',
      path: '/tools',
      description: '图像融合工具'
    },
    {
      icon: '💬',
      label: 'AI 伙伴',
      path: '/chat',
      description: '对话式创作'
    },
    {
      icon: '🖼️',
      label: '创意画廊',
      path: '/gallery',
      description: '精选案例展示'
    },
    {
      icon: '⚙️',
      label: '设置',
      path: '/settings',
      description: '模型配置'
    },
    {
      icon: '❓',
      label: '帮助',
      path: '/help',
      description: '使用帮助'
    }
  ];

  return (
    <aside
      className={`fixed left-0 top-0 h-screen border-r backdrop-blur-xl z-50 transition-all duration-300 ${
        isCollapsed ? 'w-20' : 'w-64'
      }`}
      style={{
        background: 'var(--nav-bg)',
        borderColor: 'var(--nav-border)'
      }}
    >
      <div className="flex flex-col h-full">
        {/* Logo */}
        <div className="p-6 border-b" style={{ borderColor: 'var(--nav-border)' }}>
          <Link href="/" className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-primary rounded-xl flex items-center justify-center animate-pulse-glow">
              <span className="text-2xl">🎨</span>
            </div>
            {!isCollapsed && (
              <div>
                <h1 className="text-xl font-bold text-gradient" style={{ fontFamily: 'Orbitron, sans-serif' }}>
                  创想引擎
                </h1>
                <p className="text-xs" style={{ color: 'var(--text-muted)' }}>v1.0</p>
              </div>
            )}
          </Link>
        </div>

        {/* 导航项 */}
        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          {navItems.map((item) => {
            const isActive = pathname === item.path;
            return (
              <Link
                key={item.path}
                href={item.path}
                className={`nav-item ${isActive ? 'active' : ''}`}
                title={isCollapsed ? item.label : ''}
              >
                <span className="text-2xl">{item.icon}</span>
                {!isCollapsed && (
                  <div className="flex-1">
                    <div className="font-semibold">{item.label}</div>
                    <div className="text-xs text-gray-400">{item.description}</div>
                  </div>
                )}
              </Link>
            );
          })}
        </nav>

        {/* 底部区域 */}
        <div className="p-4 border-t" style={{ borderColor: 'var(--nav-border)' }}>
          {/* 语言切换 */}
          <div className="mb-2">
            {!isCollapsed && <LanguageSwitcher />}
            {isCollapsed && (
              <button className="w-full btn-ghost flex items-center justify-center" title="Language">
                <span className="text-xl">🌐</span>
              </button>
            )}
          </div>

          {/* 主题切换按钮 */}
          <button
            onClick={toggleTheme}
            className="w-full btn-ghost flex items-center justify-center space-x-2 mb-2"
            title="切换主题"
          >
            <span className="text-xl">{theme === 'light' ? '🌙' : '☀️'}</span>
            {!isCollapsed && <span>{theme === 'light' ? '深色模式' : '浅色模式'}</span>}
          </button>

          {/* 收缩按钮 */}
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="w-full btn-ghost flex items-center justify-center space-x-2"
            title={isCollapsed ? '展开导航栏' : '收起导航栏'}
          >
            <span className="text-xl">{isCollapsed ? '→' : '←'}</span>
            {!isCollapsed && <span>收起</span>}
          </button>

        </div>
      </div>
    </aside>
  );
}
