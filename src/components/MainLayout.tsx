'use client';

import { useState, useEffect } from 'react';
import MainNavigation from './MainNavigation';

interface MainLayoutProps {
  children: React.ReactNode;
}

export default function MainLayout({ children }: MainLayoutProps) {
  const [isNavCollapsed, setIsNavCollapsed] = useState(false);

  // 监听导航栏收缩状态（通过事件或context）
  useEffect(() => {
    const handleResize = () => {
      // 在小屏幕上自动收缩导航栏
      if (window.innerWidth < 1024) {
        setIsNavCollapsed(true);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className="min-h-screen bg-[#F7F7F8]">
      {/* 左侧导航栏 */}
      <MainNavigation />
      
      {/* 主内容区域 */}
      <div className={`
        transition-all duration-300
        ${isNavCollapsed ? 'ml-16' : 'ml-64'}
      `}>
        <main className="min-h-screen">
          {children}
        </main>
      </div>
    </div>
  );
}