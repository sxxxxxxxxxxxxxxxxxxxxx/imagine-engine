'use client';

import { Star, Copy, ExternalLink } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { PromptTemplate, templateCategories, templateDifficulty } from '@/data/promptTemplates';

interface TemplateCardProps {
  template: PromptTemplate;
  onClick: () => void;
  onUse: () => void;
}

export default function TemplateCard({ template, onClick, onUse }: TemplateCardProps) {
  const { language, t } = useLanguage();

  const handleCopy = async (e: React.MouseEvent) => {
    e.stopPropagation();
    const promptText = language === 'zh' ? template.prompt : template.promptEn;
    await navigator.clipboard.writeText(promptText);
    
    // 简单的复制成功提示
    const button = e.currentTarget as HTMLButtonElement;
    const originalText = button.innerHTML;
    button.innerHTML = language === 'zh' ? '✓ 已复制' : '✓ Copied';
    setTimeout(() => {
      button.innerHTML = originalText;
    }, 2000);
  };

  const handleUse = (e: React.MouseEvent) => {
    e.stopPropagation();
    onUse();
  };

  const categoryName = templateCategories[template.category];
  const difficultyInfo = templateDifficulty[template.difficulty];

  return (
    <div
      onClick={onClick}
      className="card-hover p-6 cursor-pointer group"
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-dark-900 dark:text-dark-50 mb-1 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
            {language === 'zh' ? template.title : template.titleEn}
          </h3>
          <p className="text-sm text-dark-600 dark:text-dark-400">
            {language === 'zh' ? template.description : template.descriptionEn}
          </p>
        </div>
        {template.featured && (
          <Star className="w-5 h-5 text-accent-400 fill-accent-400 flex-shrink-0 ml-2" />
        )}
      </div>

      {/* 提示词预览 */}
      <p className="text-xs text-dark-600 dark:text-dark-400 mb-4 font-mono bg-dark-50 dark:bg-dark-900 p-3 rounded-lg line-clamp-2">
        {language === 'zh' ? template.prompt : template.promptEn}
      </p>

      {/* 元数据 */}
      <div className="flex items-center gap-2 mb-4 flex-wrap">
        <span className="badge-primary text-xs">
          {language === 'zh' ? categoryName.zh : categoryName.en}
        </span>
        <span className={`text-xs font-medium ${difficultyInfo.color}`}>
          {language === 'zh' ? difficultyInfo.zh : difficultyInfo.en}
        </span>
        <span className="text-xs text-dark-500 ml-auto">
          {template.uses.toLocaleString()}{t('templates.uses')}
        </span>
      </div>

      {/* 操作按钮 */}
      <div className="flex gap-2">
        <button
          onClick={handleCopy}
          className="btn-secondary flex-1 text-sm"
        >
          <Copy className="w-4 h-4" />
          {t('templates.copyPrompt')}
        </button>
        <button
          onClick={handleUse}
          className="btn-primary flex-1 text-sm"
        >
          <ExternalLink className="w-4 h-4" />
          {t('templates.useTemplate')}
        </button>
      </div>
    </div>
  );
}

