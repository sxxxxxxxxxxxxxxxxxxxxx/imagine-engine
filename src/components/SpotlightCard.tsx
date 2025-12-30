'use client';

import { useRef, useState } from 'react';

interface SpotlightCardProps {
  children: React.ReactNode;
  className?: string;
  spotlightColor?: string;
}

/**
 * SpotlightCard 组件
 * 鼠标跟随的卡片光晕效果
 * 适用于强调性内容展示
 */
export default function SpotlightCard({ 
  children, 
  className = '',
  spotlightColor = 'rgba(20, 184, 166, 0.12)' // 使用 primary-500 的 RGB
}: SpotlightCardProps) {
  const divRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [opacity, setOpacity] = useState(0);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!divRef.current) return;
    const rect = divRef.current.getBoundingClientRect();
    setPosition({ 
      x: e.clientX - rect.left, 
      y: e.clientY - rect.top 
    });
  };

  const handleMouseEnter = () => setOpacity(1);
  const handleMouseLeave = () => setOpacity(0);

  return (
    <div
      ref={divRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={`relative overflow-hidden ${className}`}
    >
      {/* 主光晕效果 */}
      <div
        className="pointer-events-none absolute -inset-px opacity-0 transition duration-300"
        style={{
          opacity,
          background: `radial-gradient(600px circle at ${position.x}px ${position.y}px, ${spotlightColor}, transparent 40%)`,
        }}
      />
      
      {/* 内部边缘光晕 */}
      <div 
        className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition duration-500"
        style={{
          background: `radial-gradient(500px circle at ${position.x}px ${position.y}px, rgba(255,255,255,0.03), transparent 40%)`,
        }}
      />

      {/* 内容 */}
      <div className="relative h-full z-10">{children}</div>
    </div>
  );
}

