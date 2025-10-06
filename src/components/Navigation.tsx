'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';

export default function Navigation() {
  const pathname = usePathname();

  const navItems = [
    {
      href: '/',
      label: '创想引擎',
      icon: '🎨',
      description: '文生图创作'
    },
    {
      href: '/editor',
      label: '智能编辑',
      icon: '✨',
      description: '图片编辑'
    }
  ];

  return (
    <nav className="fixed top-6 left-1/2 transform -translate-x-1/2 z-50">
      <div className="flex items-center space-x-2 bg-white/10 backdrop-blur-md rounded-2xl p-2 border border-white/20 shadow-2xl">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`
                group relative flex items-center space-x-3 px-6 py-3 rounded-xl transition-all duration-300
                ${isActive 
                  ? 'bg-white/90 text-gray-800 shadow-lg' 
                  : 'text-white/80 hover:text-white hover:bg-white/20'
                }
              `}
            >
              <span className="text-xl">{item.icon}</span>
              <div className="flex flex-col">
                <span className="font-semibold text-sm">{item.label}</span>
                <span className={`text-xs ${isActive ? 'text-gray-600' : 'text-white/60'}`}>
                  {item.description}
                </span>
              </div>
              
              {/* 活动指示器 */}
              {isActive && (
                <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-8 h-1 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"></div>
              )}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}