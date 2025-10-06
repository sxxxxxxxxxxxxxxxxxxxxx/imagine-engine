'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';

export default function Sidebar() {
  const pathname = usePathname();

  const navItems = [
    {
      href: '/',
      icon: '🎨',
      label: '魔法画室',
      description: '文生图创作'
    },
    {
      href: '/editor',
      icon: '✨',
      label: '智能编辑器',
      description: '图片编辑'
    }
  ];

  return (
    <div className="sidebar">
      {/* Logo区域 */}
      <div className="mb-8">
        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
          <span className="text-2xl">🚀</span>
        </div>
      </div>

      {/* 导航项 */}
      <nav className="flex flex-col space-y-4">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`
                group relative w-12 h-12 rounded-xl flex items-center justify-center
                transition-all duration-300 hover:scale-110
                ${isActive 
                  ? 'bg-gradient-to-br from-purple-500 to-pink-500 shadow-lg' 
                  : 'bg-white/5 hover:bg-white/10'
                }
              `}
              title={item.label}
            >
              <span className="text-2xl">{item.icon}</span>
              
              {/* 活动指示器 */}
              {isActive && (
                <div className="absolute -right-1 top-1/2 transform -translate-y-1/2 w-1 h-8 bg-gradient-to-b from-purple-500 to-pink-500 rounded-full"></div>
              )}
              
              {/* 悬停提示 */}
              <div className="absolute left-full ml-4 px-3 py-2 bg-gray-900 text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50">
                {item.label}
                <div className="absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-1 w-2 h-2 bg-gray-900 rotate-45"></div>
              </div>
            </Link>
          );
        })}
      </nav>

      {/* 底部设置 */}
      <div className="mt-auto">
        <button className="w-12 h-12 rounded-xl bg-white/5 hover:bg-white/10 flex items-center justify-center transition-all duration-300 hover:scale-110 group">
          <span className="text-xl">⚙️</span>
          
          {/* 悬停提示 */}
          <div className="absolute left-full ml-4 px-3 py-2 bg-gray-900 text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50">
            设置
            <div className="absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-1 w-2 h-2 bg-gray-900 rotate-45"></div>
          </div>
        </button>
      </div>
    </div>
  );
}