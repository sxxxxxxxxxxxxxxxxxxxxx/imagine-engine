'use client';

import { useState } from 'react';

interface StyleSelectorProps {
  selectedStyle: string;
  onStyleChange: (style: string) => void;
}

export default function StyleSelector({ selectedStyle, onStyleChange }: StyleSelectorProps) {
  const [showAll, setShowAll] = useState(false);
  
  const styles = [
    {
      id: 'realistic',
      name: '写实风格',
      description: '真实自然，细节丰富',
      emoji: '📸',
      gradient: 'from-blue-500 to-green-600',
      preview: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=300&h=300&fit=crop&crop=center',
    },
    {
      id: 'anime',
      name: '动漫风格',
      description: '二次元，色彩鲜艳',
      emoji: '🎭',
      gradient: 'from-pink-500 to-purple-600',
      preview: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=300&h=300&fit=crop&crop=center',
    },
    {
      id: 'oil_painting',
      name: '油画风格',
      description: '古典艺术，笔触明显',
      emoji: '🎨',
      gradient: 'from-orange-500 to-red-600',
      preview: 'https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=300&h=300&fit=crop&crop=center',
    },
    {
      id: 'watercolor',
      name: '水彩风格',
      description: '清新淡雅，朦胧美感',
      emoji: '🌸',
      gradient: 'from-purple-500 to-pink-600',
      preview: 'https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=300&h=300&fit=crop&crop=center',
    },
    {
      id: 'cyberpunk',
      name: '赛博朋克',
      description: '未来科技，霓虹色彩',
      emoji: '🌃',
      gradient: 'from-cyan-500 to-blue-600',
      preview: 'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=300&h=300&fit=crop&crop=center',
    },
    {
      id: 'minimalist',
      name: '极简风格',
      description: '简洁明了，突出主体',
      emoji: '⚪',
      gradient: 'from-gray-500 to-gray-600',
      preview: 'https://images.unsplash.com/photo-1493119508027-2b584f234d6c?w=300&h=300&fit=crop&crop=center',
    },
  ];

  const displayedStyles = showAll ? styles : styles.slice(0, 3);

  return (
    <div className="space-y-4">
      {/* 风格选择网格 */}
      <div className="grid grid-cols-1 gap-3">
        {displayedStyles.map((style) => (
          <button
            key={style.id}
            onClick={() => onStyleChange(style.id)}
            className={`
              flex items-center p-3 rounded-lg border transition-all duration-200 text-left
              ${selectedStyle === style.id 
                ? 'border-purple-500 bg-purple-50' 
                : 'border-gray-200 hover:border-gray-300 bg-white hover:bg-gray-50'
              }
            `}
          >
            {/* 风格图标 */}
            <div className={`
              w-10 h-10 rounded-lg flex items-center justify-center mr-3 flex-shrink-0
              ${selectedStyle === style.id ? 'bg-purple-500' : 'bg-gray-100'}
            `}>
              <span className={`text-lg ${selectedStyle === style.id ? 'text-white' : 'text-gray-600'}`}>
                {style.emoji}
              </span>
            </div>
            
            {/* 风格信息 */}
            <div className="flex-1 min-w-0">
              <h4 className={`font-medium text-sm ${selectedStyle === style.id ? 'text-purple-900' : 'text-gray-900'}`}>
                {style.name}
              </h4>
              <p className={`text-xs ${selectedStyle === style.id ? 'text-purple-700' : 'text-gray-600'}`}>
                {style.description}
              </p>
            </div>
            
            {/* 选中指示器 */}
            {selectedStyle === style.id && (
              <div className="w-5 h-5 bg-purple-500 rounded-full flex items-center justify-center flex-shrink-0">
                <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </div>
            )}
          </button>
        ))}
      </div>
      
      {/* 查看全部按钮 */}
      {!showAll && styles.length > 3 && (
        <button
          onClick={() => setShowAll(true)}
          className="w-full py-2 text-sm text-purple-600 hover:text-purple-700 font-medium transition-colors"
        >
          查看全部风格 ({styles.length})
        </button>
      )}
      
      {showAll && (
        <button
          onClick={() => setShowAll(false)}
          className="w-full py-2 text-sm text-gray-600 hover:text-gray-700 font-medium transition-colors"
        >
          收起
        </button>
      )}
    </div>
  );
}