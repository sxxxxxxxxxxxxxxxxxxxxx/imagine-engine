'use client';

import { useState } from 'react';

interface FiltersAndTexturesProps {
  onApply: (type: 'filter' | 'texture', effect: string, prompt: string) => void;
  isProcessing: boolean;
  hasImage: boolean;
}

interface Effect {
  id: string;
  name: string;
  description: string;
  prompt: string;
  emoji: string;
  preview: string;
}

export default function FiltersAndTextures({ onApply, isProcessing, hasImage }: FiltersAndTexturesProps) {
  const [activeTab, setActiveTab] = useState<'filters' | 'textures'>('filters');

  // 创意滤镜
  const filters: Effect[] = [
    {
      id: 'anime',
      name: '动漫风格',
      description: '日式动漫风格，色彩鲜艳',
      prompt: '将图片转换为日式动漫风格，色彩鲜艳，二次元画风，细腻线条',
      emoji: '🎨',
      preview: 'linear-gradient(45deg, #ff6b6b, #4ecdc4)'
    },
    {
      id: 'vintage',
      name: '复古胶片',
      description: '怀旧胶片效果，温暖色调',
      prompt: '添加复古胶片滤镜效果，怀旧色调，颗粒质感，温暖氛围',
      emoji: '📷',
      preview: 'linear-gradient(45deg, #d4a574, #8b4513)'
    },
    {
      id: 'cyberpunk',
      name: '赛博朋克',
      description: '未来科技感，霓虹色彩',
      prompt: '转换为赛博朋克风格，未来科技感，霓虹色彩，电子元素，暗色调',
      emoji: '🌃',
      preview: 'linear-gradient(45deg, #00ffff, #ff00ff)'
    },
    {
      id: 'watercolor',
      name: '水彩画',
      description: '水彩画风格，柔和朦胧',
      prompt: '将图片转换为水彩画风格，柔和朦胧，艺术感强，水彩质感',
      emoji: '🎭',
      preview: 'linear-gradient(45deg, #a8e6cf, #dcedc1)'
    },
    {
      id: 'oil_painting',
      name: '油画风格',
      description: '古典油画效果，厚重质感',
      prompt: '转换为古典油画风格，厚重质感，艺术感强，油画笔触',
      emoji: '🖼️',
      preview: 'linear-gradient(45deg, #8b4513, #daa520)'
    },
    {
      id: 'noir',
      name: '黑白电影',
      description: '经典黑白电影风格',
      prompt: '转换为黑白电影风格，高对比度，戏剧性光影，经典质感',
      emoji: '🎬',
      preview: 'linear-gradient(45deg, #000000, #ffffff)'
    },
    {
      id: 'lomo',
      name: 'Lomo风格',
      description: 'Lomo相机效果，暗角渐晕',
      prompt: '添加Lomo相机效果，暗角渐晕，色彩饱和，复古质感',
      emoji: '📸',
      preview: 'linear-gradient(45deg, #ff4757, #ffa502)'
    },
    {
      id: 'synthwave',
      name: '合成波',
      description: '80年代合成波美学',
      prompt: '转换为80年代合成波风格，霓虹粉紫色调，复古未来感',
      emoji: '🌈',
      preview: 'linear-gradient(45deg, #ff006e, #8338ec)'
    }
  ];

  // 纹理效果
  const textures: Effect[] = [
    {
      id: 'cracked_paint',
      name: '裂纹漆',
      description: '老旧墙面裂纹效果',
      prompt: '为图片添加裂纹漆纹理效果，老旧墙面质感，斑驳裂纹',
      emoji: '🧱',
      preview: 'linear-gradient(45deg, #8b7355, #d2b48c)'
    },
    {
      id: 'wood_grain',
      name: '木纹',
      description: '天然木材纹理',
      prompt: '添加天然木材纹理效果，木纹质感，温暖色调',
      emoji: '🌳',
      preview: 'linear-gradient(45deg, #8b4513, #daa520)'
    },
    {
      id: 'metal_brush',
      name: '金属拉丝',
      description: '金属拉丝质感',
      prompt: '添加金属拉丝纹理效果，金属质感，反光效果',
      emoji: '⚙️',
      preview: 'linear-gradient(45deg, #c0c0c0, #808080)'
    },
    {
      id: 'fabric',
      name: '布料纹理',
      description: '织物纤维质感',
      prompt: '添加布料纹理效果，织物纤维质感，柔软材质',
      emoji: '🧵',
      preview: 'linear-gradient(45deg, #f5f5dc, #deb887)'
    },
    {
      id: 'marble',
      name: '大理石',
      description: '天然大理石纹理',
      prompt: '添加大理石纹理效果，天然石材质感，优雅纹路',
      emoji: '🏛️',
      preview: 'linear-gradient(45deg, #ffffff, #f0f0f0)'
    },
    {
      id: 'leather',
      name: '皮革',
      description: '真皮质感纹理',
      prompt: '添加皮革纹理效果，真皮质感，自然纹路',
      emoji: '👜',
      preview: 'linear-gradient(45deg, #8b4513, #a0522d)'
    },
    {
      id: 'paper',
      name: '纸张纹理',
      description: '手工纸张质感',
      prompt: '添加手工纸张纹理效果，纸质质感，自然纤维',
      emoji: '📜',
      preview: 'linear-gradient(45deg, #faf0e6, #f5deb3)'
    },
    {
      id: 'glass',
      name: '玻璃效果',
      description: '透明玻璃质感',
      prompt: '添加玻璃效果，透明质感，反射光线，晶莹剔透',
      emoji: '🔮',
      preview: 'linear-gradient(45deg, #e6f3ff, #b3d9ff)'
    }
  ];

  const currentEffects = activeTab === 'filters' ? filters : textures;

  const handleEffectClick = (effect: Effect) => {
    if (!hasImage || isProcessing) return;
    onApply(activeTab, effect.id, effect.prompt);
  };

  return (
    <div className="card">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold">🎨 创意效果</h3>
        <div className="text-sm text-gray-500">
          {currentEffects.length} 个效果
        </div>
      </div>

      {/* 标签切换 */}
      <div className="flex space-x-1 mb-4 bg-gray-100 rounded-lg p-1">
        <button
          onClick={() => setActiveTab('filters')}
          className={`
            flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors
            ${activeTab === 'filters'
              ? 'bg-white text-primary-600 shadow-sm'
              : 'text-gray-600 hover:text-gray-900'
            }
          `}
        >
          🎨 滤镜效果
        </button>
        <button
          onClick={() => setActiveTab('textures')}
          className={`
            flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors
            ${activeTab === 'textures'
              ? 'bg-white text-primary-600 shadow-sm'
              : 'text-gray-600 hover:text-gray-900'
            }
          `}
        >
          🧱 纹理叠加
        </button>
      </div>

      {/* 效果网格 */}
      <div className="grid grid-cols-2 gap-3 max-h-80 overflow-y-auto scrollbar-thin">
        {currentEffects.map((effect) => (
          <button
            key={effect.id}
            onClick={() => handleEffectClick(effect)}
            disabled={!hasImage || isProcessing}
            className={`
              relative p-3 rounded-lg border-2 transition-all duration-200 text-left
              ${!hasImage || isProcessing
                ? 'border-gray-200 bg-gray-50 opacity-50 cursor-not-allowed'
                : 'border-gray-200 bg-white hover:border-gray-300 hover:shadow-md cursor-pointer'
              }
            `}
          >
            {/* 预览背景 */}
            <div 
              className="absolute inset-0 rounded-lg opacity-10"
              style={{ background: effect.preview }}
            />
            
            {/* 内容 */}
            <div className="relative z-10">
              <div className="flex items-center space-x-2 mb-2">
                <span className="text-lg">{effect.emoji}</span>
                <span className="font-medium text-gray-900 text-sm">
                  {effect.name}
                </span>
              </div>
              <p className="text-xs text-gray-600 line-clamp-2">
                {effect.description}
              </p>
            </div>

            {/* 悬停效果 */}
            <div className="absolute inset-0 bg-white bg-opacity-0 hover:bg-opacity-5 transition-all rounded-lg" />
          </button>
        ))}
      </div>

      {/* 使用说明 */}
      <div className="mt-4 pt-4 border-t border-gray-200">
        <div className="text-xs text-gray-500 bg-gray-50 rounded-lg p-3">
          <p className="font-medium mb-1">💡 使用说明：</p>
          <ul className="space-y-1">
            <li>• <strong>滤镜效果</strong>：改变图片整体风格和色调</li>
            <li>• <strong>纹理叠加</strong>：为图片添加材质质感</li>
            <li>• 点击效果即可应用到当前图片</li>
            <li>• 可以叠加使用多种效果</li>
          </ul>
        </div>
      </div>
    </div>
  );
}