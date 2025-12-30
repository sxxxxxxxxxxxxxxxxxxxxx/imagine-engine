'use client';

import { useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Layers, X } from 'lucide-react';

interface FusionTemplatesProps {
  onSelect: (template: string) => void;
  imageCount: number;
}

export default function FusionTemplates({ onSelect, imageCount }: FusionTemplatesProps) {
  const { language } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);

  // 多图融合提示词模板
  const templates = {
    zh: [
      {
        id: 'style-fusion',
        name: '风格融合',
        icon: '🎨',
        template: '融合这些图片的风格特点，创作一幅新的作品',
        desc: '提取各图的艺术风格并融合'
      },
      {
        id: 'element-combine',
        name: '元素合成',
        icon: '🧩',
        template: '结合这些图片中的关键元素，合成一张完整的图片',
        desc: '将不同图片的元素组合'
      },
      {
        id: 'composition-blend',
        name: '构图融合',
        icon: '📐',
        template: '参考第1张图的构图，融合其他图片的色调和风格',
        desc: '保持构图，融合色彩风格'
      },
      {
        id: 'creative-mix',
        name: '创意混合',
        icon: '✨',
        template: '将这些图片创意性地混合，生成一张视觉冲击力强的新图片',
        desc: '创意拼接和混合'
      },
      {
        id: 'color-fusion',
        name: '色调融合',
        icon: '🌈',
        template: '保持第1张图的主体，应用其他图片的色调和氛围',
        desc: '主体保持，色调融合'
      },
      {
        id: 'scene-composite',
        name: '场景合成',
        icon: '🏞️',
        template: '将这些图片中的人物/物体合成到一个统一的场景中',
        desc: '多图合成为统一场景'
      },
    ],
    en: [
      {
        id: 'style-fusion',
        name: 'Style Fusion',
        icon: '🎨',
        template: 'Fuse the artistic styles from these images to create a new artwork',
        desc: 'Extract and blend artistic styles'
      },
      {
        id: 'element-combine',
        name: 'Element Combine',
        icon: '🧩',
        template: 'Combine key elements from these images into one complete picture',
        desc: 'Combine elements from different images'
      },
      {
        id: 'composition-blend',
        name: 'Composition Blend',
        icon: '📐',
        template: 'Use the composition from image 1, blend colors and styles from others',
        desc: 'Keep composition, blend colors'
      },
      {
        id: 'creative-mix',
        name: 'Creative Mix',
        icon: '✨',
        template: 'Creatively mix these images into a visually striking new image',
        desc: 'Creative collage and mix'
      },
      {
        id: 'color-fusion',
        name: 'Color Fusion',
        icon: '🌈',
        template: 'Keep the subject from image 1, apply color tones from other images',
        desc: 'Keep subject, fuse colors'
      },
      {
        id: 'scene-composite',
        name: 'Scene Composite',
        icon: '🏞️',
        template: 'Composite people/objects from these images into a unified scene',
        desc: 'Multi-image scene composition'
      },
    ]
  };

  const currentTemplates = templates[language as keyof typeof templates] || templates.zh;

  if (imageCount < 2) {
    return null;  // 只有多图时才显示
  }

  return (
    <div className="space-y-3">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-3 rounded-lg border border-dark-200 dark:border-dark-800 hover:border-primary-400 dark:hover:border-primary-500 bg-white dark:bg-dark-800 transition-all"
      >
        <div className="flex items-center gap-2">
          <Layers className="w-4 h-4 text-primary-500" />
          <span className="text-sm font-medium text-dark-700 dark:text-dark-300">
            {language === 'zh' ? '融合模板' : 'Fusion Templates'}
          </span>
          <span className="text-xs text-dark-500">
            {currentTemplates.length}{language === 'zh' ? '种' : ' modes'}
          </span>
        </div>
        <div className={`transition-transform duration-200 text-dark-400 ${isOpen ? 'rotate-180' : ''}`}>
          ▼
        </div>
      </button>

      {isOpen && (
        <div className="grid grid-cols-2 gap-2 p-2 bg-dark-50 dark:bg-dark-900 rounded-lg animate-fadeIn">
          {currentTemplates.map((tpl) => (
            <button
              key={tpl.id}
              onClick={() => {
                onSelect(tpl.template);
                setIsOpen(false);
              }}
              className="p-3 text-left rounded-lg border border-dark-200 dark:border-dark-700 hover:border-primary-400 dark:hover:border-primary-500 bg-white dark:bg-dark-800 hover:bg-dark-50 dark:hover:bg-dark-750 transition-all"
            >
              <div className="flex items-start gap-2">
                <span className="text-xl flex-shrink-0">{tpl.icon}</span>
                <div className="flex-1 min-w-0">
                  <h5 className="text-sm font-semibold text-dark-900 dark:text-dark-100 mb-1">
                    {tpl.name}
                  </h5>
                  <p className="text-xs text-dark-500 dark:text-dark-400">
                    {tpl.desc}
                  </p>
                </div>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

