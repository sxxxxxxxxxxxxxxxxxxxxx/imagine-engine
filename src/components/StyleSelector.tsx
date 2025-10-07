'use client';

import { useState } from 'react';

interface StyleSelectorProps {
  selectedStyle: string;
  onStyleChange: (style: string) => void;
}

export default function StyleSelector({ selectedStyle, onStyleChange }: StyleSelectorProps) {
  const styles = [
    {
      id: 'realistic',
      name: '超写实',
      description: '真实自然，专业级细节',
      emoji: '📸',
      tag: '推荐'
    },
    {
      id: 'anime',
      name: '动漫风',
      description: '二次元，色彩鲜艳',
      emoji: '🎭',
      tag: '热门'
    },
    {
      id: 'oil_painting',
      name: '油画',
      description: '古典艺术，笔触质感',
      emoji: '🎨',
      tag: null
    },
    {
      id: 'watercolor',
      name: '水彩',
      description: '清新淡雅，朦胧美感',
      emoji: '🌸',
      tag: null
    },
    {
      id: 'cyberpunk',
      name: '赛博朋克',
      description: '未来科技，霓虹灯光',
      emoji: '🌃',
      tag: null
    },
    {
      id: 'minimalist',
      name: '极简',
      description: '简洁明了，突出主体',
      emoji: '⚪',
      tag: null
    },
  ];

  return (
    <div className="space-y-2.5">
      {/* 风格选择网格 - 紧凑垂直布局 */}
      <div className="grid grid-cols-1 gap-2">
        {styles.map((style) => {
          const isSelected = selectedStyle === style.id;
          return (
            <button
              key={style.id}
              onClick={() => onStyleChange(style.id)}
              className={`
                group relative flex items-center gap-3 p-3 rounded-xl border-2 
                transition-all duration-200 text-left overflow-hidden
                ${isSelected 
                  ? 'border-purple-500 bg-gradient-to-r from-purple-50 to-pink-50 shadow-md' 
                  : 'border-gray-200 bg-white hover:border-purple-300 hover:shadow-sm'
                }
              `}
            >
              {/* 背景渐变效果 */}
              {isSelected && (
                <div className="absolute inset-0 bg-gradient-to-r from-purple-500/5 to-pink-500/5" />
              )}

              {/* 风格图标 */}
              <div className={`
                relative z-10 w-11 h-11 rounded-lg flex items-center justify-center 
                flex-shrink-0 transition-all duration-200
                ${isSelected 
                  ? 'bg-gradient-to-br from-purple-500 to-pink-500 shadow-lg scale-110' 
                  : 'bg-gray-100 group-hover:bg-gray-200'
                }
              `}>
                <span className={`text-xl ${isSelected ? 'text-white' : 'text-gray-600'}`}>
                  {style.emoji}
                </span>
              </div>
              
              {/* 风格信息 */}
              <div className="relative z-10 flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-0.5">
                  <h4 className={`font-semibold text-sm ${isSelected ? 'text-purple-900' : 'text-gray-900'}`}>
                    {style.name}
                  </h4>
                  {style.tag && (
                    <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-medium ${
                      style.tag === '推荐' ? 'bg-orange-100 text-orange-700' :
                      style.tag === '热门' ? 'bg-red-100 text-red-700' :
                      'bg-blue-100 text-blue-700'
                    }`}>
                      {style.tag}
                    </span>
                  )}
                </div>
                <p className={`text-xs leading-tight ${isSelected ? 'text-purple-700' : 'text-gray-500'}`}>
                  {style.description}
                </p>
              </div>
              
              {/* 选中指示器 */}
              <div className={`
                relative z-10 w-5 h-5 rounded-full flex items-center justify-center 
                flex-shrink-0 transition-all duration-200
                ${isSelected ? 'bg-purple-500 scale-100' : 'bg-transparent scale-0'}
              `}>
                {isSelected && (
                  <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                )}
              </div>

              {/* Hover 效果 */}
              {!isSelected && (
                <div className="absolute inset-0 bg-gradient-to-r from-purple-500/0 to-pink-500/0 group-hover:from-purple-500/5 group-hover:to-pink-500/5 transition-all duration-200" />
              )}
            </button>
          );
        })}
      </div>

      {/* Nano Banana 技术标识 */}
      <div className="mt-4 p-3 rounded-lg bg-gradient-to-r from-blue-50 to-purple-50 border border-purple-200">
        <div className="flex items-start gap-2">
          <span className="text-lg">🍌</span>
          <div>
            <p className="text-xs font-semibold text-purple-900 mb-1">
              Nano Banana AI
            </p>
            <p className="text-[10px] text-purple-700 leading-relaxed">
              基于 Google Gemini 2.5 的顶级图像生成技术，支持角色一致性保持和场景融合
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}