'use client';

import { useState } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';

interface NavigationItem {
  id: string;
  label: string;
  icon: string;
  path: string;
  description: string;
}

export default function MainNavigation() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const pathname = usePathname();

  const navigationItems: NavigationItem[] = [
    {
      id: 'create',
      label: 'AI 创作',
      icon: '✨',
      path: '/create',
      description: '从无到有的图像生成'
    },
    {
      id: 'edit',
      label: 'AI 编辑',
      icon: '🔧',
      path: '/edit',
      description: '智能图片编辑修复'
    },
    {
      id: 'tools',
      label: '创意工具',
      icon: '🎨',
      path: '/tools',
      description: '多图片创意工作流'
    },
    {
      id: 'chat',
      label: 'AI 伙伴',
      icon: '💬',
      path: '/chat',
      description: '对话式创作体验'
    }
  ];

  return (
    <div className={`
      fixed left-0 top-0 h-full bg-white border-r border-gray-200 transition-all duration-300 z-50
      ${isCollapsed ? 'w-16' : 'w-64'}
    `}>
      {/* 导航栏头部 */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          {!isCollapsed && (
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                <span className="text-white text-lg font-bold">AI</span>
              </div>
              <div>
                <h1 className="text-lg font-bold text-gray-900">创想引擎</h1>
                <p className="text-xs text-gray-500">AI Creative Studio</p>
              </div>
            </div>
          )}
          
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            title={isCollapsed ? '展开导航栏' : '收缩导航栏'}
          >
            <svg 
              className={`w-5 h-5 text-gray-600 transition-transform duration-300 ${isCollapsed ? 'rotate-180' : ''}`}
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
            </svg>
          </button>
        </div>
      </div>

      {/* 导航菜单 */}
      <nav className="p-4 space-y-2">
        {navigationItems.map((item) => {
          const isActive = pathname === item.path;
          
          return (
            <Link
              key={item.id}
              href={item.path}
              className={`
                group relative flex items-center p-3 rounded-xl transition-all duration-200
                ${isActive 
                  ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg' 
                  : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                }
              `}
            >
              {/* 图标 */}
              <div className={`
                flex items-center justify-center w-8 h-8 rounded-lg flex-shrink-0
                ${isActive ? 'bg-white/20' : 'bg-gray-100 group-hover:bg-gray-200'}
              `}>
                <span className={`text-lg ${isActive ? 'text-white' : 'text-gray-600'}`}>
                  {item.icon}
                </span>
              </div>

              {/* 文字标签 */}
              {!isCollapsed && (
                <div className="ml-3 flex-1 min-w-0">
                  <div className={`font-medium text-sm ${isActive ? 'text-white' : 'text-gray-900'}`}>
                    {item.label}
                  </div>
                  <div className={`text-xs ${isActive ? 'text-white/80' : 'text-gray-500'}`}>
                    {item.description}
                  </div>
                </div>
              )}

              {/* 活动指示器 */}
              {isActive && (
                <div className="absolute -right-1 top-1/2 transform -translate-y-1/2 w-1 h-8 bg-white rounded-full"></div>
              )}

              {/* 收缩状态下的悬停提示 */}
              {isCollapsed && (
                <div className="absolute left-full ml-2 px-3 py-2 bg-gray-900 text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50">
                  {item.label}
                  <div className="absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-1 w-2 h-2 bg-gray-900 rotate-45"></div>
                </div>
              )}
            </Link>
          );
        })}
      </nav>

      {/* 底部设置区域 */}
      <div className="absolute bottom-4 left-4 right-4">
        <div className={`
          flex items-center p-3 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors cursor-pointer
          ${isCollapsed ? 'justify-center' : ''}
        `}>
          <div className="w-8 h-8 bg-gray-200 rounded-lg flex items-center justify-center flex-shrink-0">
            <span className="text-lg">⚙️</span>
          </div>
          {!isCollapsed && (
            <div className="ml-3">
              <div className="font-medium text-sm text-gray-900">设置</div>
              <div className="text-xs text-gray-500">偏好设置</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}