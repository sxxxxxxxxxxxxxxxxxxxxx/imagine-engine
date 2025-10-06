'use client';

import { useState } from 'react';

interface PromptHint {
  category: 'subject' | 'scene' | 'action' | 'style' | 'camera';
  title: string;
  text: string;
  example: string;
  color: string;
}

const promptHints: PromptHint[] = [
  {
    category: 'subject',
    title: '🎯 主体描述',
    text: '具体描述主要对象，避免模糊概念',
    example: '✅ "一辆复古红色自行车" ❌ "自行车"',
    color: 'blue'
  },
  {
    category: 'scene',
    title: '🌆 场景环境',
    text: '描述环境、地点和时间',
    example: '✅ "在鹅卵石小巷，黄金时刻" ❌ "户外"',
    color: 'green'
  },
  {
    category: 'action',
    title: '🏃 动作描述',
    text: '包含运动、活动或状态',
    example: '✅ "骑行者踩着水坑奔驰" ❌ "骑车"',
    color: 'purple'
  },
  {
    category: 'style',
    title: '🎨 艺术风格',
    text: '指定艺术风格、氛围或情绪',
    example: '✅ "电影摄影，情绪照明，暗调" ❌ "好看"',
    color: 'orange'
  },
  {
    category: 'camera',
    title: '📷 相机参数',
    text: '添加相机视角、镜头和拍摄细节',
    example: '✅ "85mm镜头，浅景深，f/1.8" ❌ "清晰"',
    color: 'pink'
  }
];

const colorClasses = {
  blue: 'bg-blue-500/10 border-blue-500/30 text-blue-600',
  green: 'bg-green-500/10 border-green-500/30 text-green-600',
  purple: 'bg-purple-500/10 border-purple-500/30 text-purple-600',
  orange: 'bg-orange-500/10 border-orange-500/30 text-orange-600',
  pink: 'bg-pink-500/10 border-pink-500/30 text-pink-600',
};

interface PromptHintsProps {
  isVisible: boolean;
  onClose: () => void;
}

export default function PromptHints({ isVisible, onClose }: PromptHintsProps) {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  if (!isVisible) return null;

  const displayHints = selectedCategory
    ? promptHints.filter(hint => hint.category === selectedCategory)
    : promptHints;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4" 
      style={{ background: 'rgba(0, 0, 0, 0.75)' }}
      onClick={onClose}
    >
      <div 
        className="w-full max-w-3xl max-h-[80vh] overflow-hidden rounded-2xl shadow-2xl flex flex-col"
        style={{ background: 'var(--bg-secondary)' }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* 头部 */}
        <div className="px-6 py-4 border-b" style={{ borderColor: 'var(--border-subtle)' }}>
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
                💡 提示词质量提升指南
              </h2>
              <p className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>
                写出高质量提示词的5个关键要素
              </p>
            </div>
            <button
              onClick={onClose}
              className="w-10 h-10 rounded-full hover:bg-red-500/10 flex items-center justify-center transition-colors"
              style={{ color: 'var(--text-secondary)' }}
            >
              <span className="text-2xl">×</span>
            </button>
          </div>
        </div>

        {/* 分类筛选 */}
        <div className="px-6 py-3 border-b flex gap-2" style={{ borderColor: 'var(--border-subtle)' }}>
          <button
            onClick={() => setSelectedCategory(null)}
            className={`text-xs px-3 py-1 rounded-full transition-all ${
              !selectedCategory
                ? 'bg-gradient-primary text-white shadow-md'
                : 'btn-secondary'
            }`}
          >
            全部
          </button>
          {promptHints.map((hint) => (
            <button
              key={hint.category}
              onClick={() => setSelectedCategory(hint.category)}
              className={`text-xs px-3 py-1 rounded-full transition-all ${
                selectedCategory === hint.category
                  ? 'bg-gradient-primary text-white shadow-md'
                  : 'btn-secondary'
              }`}
            >
              {hint.title}
            </button>
          ))}
        </div>

        {/* 内容区域 */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="space-y-4">
            {displayHints.map((hint, index) => (
              <div key={index} className="glass-card p-4">
                <div className={`inline-block px-3 py-1 rounded-full text-xs font-medium border mb-3 ${colorClasses[hint.color as keyof typeof colorClasses]}`}>
                  {hint.title}
                </div>
                <p className="text-sm mb-2" style={{ color: 'var(--text-primary)' }}>
                  {hint.text}
                </p>
                <p className="text-sm font-mono p-2 rounded" style={{ 
                  color: 'var(--text-secondary)',
                  background: 'var(--bg-tertiary)'
                }}>
                  {hint.example}
                </p>
              </div>
            ))}
          </div>

          {/* 最佳实践 */}
          <div className="mt-6 p-4 rounded-xl" style={{ 
            background: 'linear-gradient(135deg, rgba(168, 85, 247, 0.1) 0%, rgba(236, 72, 153, 0.1) 100%)',
            border: '1px solid rgba(168, 85, 247, 0.2)'
          }}>
            <h4 className="font-bold text-sm mb-2 flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
              <span className="text-lg">⭐</span>
              黄金法则
            </h4>
            <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
              <strong className="text-yellow-500">写完整的句子，而不是关键词堆砌。</strong>
              <br />
              把你想要的画面用文字描绘出来，就像在给别人讲故事一样。
              <br />
              <br />
              <span className="text-green-500">✅ 好例子：</span>
              "一位身穿红色和服的日本女孩站在京都古老的木桥上，樱花飘落，夕阳余晖洒在她的脸上，电影级摄影，85mm镜头，浅景深"
              <br />
              <br />
              <span className="text-red-500">❌ 坏例子：</span>
              "女孩 和服 樱花 桥 夕阳"
            </p>
          </div>
        </div>

        {/* 底部 */}
        <div className="px-6 py-3 border-t" style={{ borderColor: 'var(--border-subtle)' }}>
          <div className="flex items-center justify-between text-xs" style={{ color: 'var(--text-muted)' }}>
            <span>提示：按 P 键快速打开此面板</span>
            <button
              onClick={onClose}
              className="btn-gradient px-4 py-2 text-sm"
            >
              知道了
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

