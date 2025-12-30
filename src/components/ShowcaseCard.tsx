'use client';

import { ShowcaseCase, categoryNames, difficultyNames } from '@/data/showcaseCases';
import { ArrowRight, User } from 'lucide-react';

interface ShowcaseCardProps {
  case: ShowcaseCase;
  language: 'zh' | 'en';
  onClick: () => void;
}

export default function ShowcaseCard({ case: showcase, language, onClick }: ShowcaseCardProps) {
  const title = language === 'zh' ? showcase.title : showcase.titleEn;
  const category = categoryNames[showcase.category][language];
  const difficulty = difficultyNames[showcase.difficulty];
  const difficultyText = difficulty[language];

  return (
    <div
      onClick={onClick}
      className="card-hover group cursor-pointer overflow-hidden relative"
    >
      {/* 图片对比区域 */}
      <div className="bg-dark-50 dark:bg-dark-900 p-2">
        <div className="flex items-center gap-1.5">
          {/* 输入图（如果有） */}
          {showcase.inputImages.length > 0 && (
            <>
              <div className="flex-1 aspect-square rounded-lg overflow-hidden bg-dark-100 dark:bg-dark-800">
                <img
                  src={showcase.inputImages[0]}
                  alt="Input"
                  className="w-full h-full object-cover"
                  loading="lazy"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="100" height="100"%3E%3Crect fill="%23ddd" width="100" height="100"/%3E%3Ctext x="50" y="50" text-anchor="middle" fill="%23999"%3EInput%3C/text%3E%3C/svg%3E';
                  }}
                />
              </div>
              <ArrowRight className="w-4 h-4 text-primary-500 flex-shrink-0" />
            </>
          )}
          
          {/* 输出图 */}
          <div className={`${showcase.inputImages.length > 0 ? 'flex-1' : 'w-full'} aspect-square rounded-lg overflow-hidden bg-dark-100 dark:bg-dark-800`}>
            <img
              src={showcase.outputImage}
              alt="Output"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              loading="lazy"
              onError={(e) => {
                (e.target as HTMLImageElement).src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="100" height="100"%3E%3Crect fill="%23ddd" width="100" height="100"/%3E%3Ctext x="50" y="50" text-anchor="middle" fill="%23999"%3EOutput%3C/text%3E%3C/svg%3E';
              }}
            />
          </div>
        </div>
      </div>

      {/* 信息区域 */}
      <div className="p-2">
        <h3 className="font-semibold text-xs text-dark-900 dark:text-dark-50 mb-1 line-clamp-1">
          {title}
        </h3>

        {/* 徽章 */}
        <div className="flex flex-wrap gap-1 mb-1">
          <span className="text-[10px] px-1.5 py-0.5 rounded bg-dark-100 dark:bg-dark-800 text-dark-600 dark:text-dark-400">
            {category}
          </span>
          <span className="text-[10px] px-1.5 py-0.5 rounded bg-dark-100 dark:bg-dark-800 text-dark-600 dark:text-dark-400">
            {difficultyText}
          </span>
          {showcase.requiresInput && (
            <span className="text-[10px] px-1.5 py-0.5 rounded bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300">
              📷
            </span>
          )}
          {showcase.featured && (
            <span className="text-[10px] px-1.5 py-0.5 rounded bg-accent-100 dark:bg-accent-900/30 text-accent-700 dark:text-accent-300">
              ⭐
            </span>
          )}
        </div>

        {/* 作者 */}
        <div className="flex items-center gap-1 text-[10px] text-dark-500">
          <User className="w-3 h-3" />
          <span className="truncate">{showcase.author}</span>
        </div>
      </div>

      {/* Hover 提示 */}
      <div className="absolute inset-0 bg-primary-500/90 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
        <span className="text-white font-medium">
          {language === 'zh' ? '点击查看详情' : 'Click for Details'}
        </span>
      </div>
    </div>
  );
}

