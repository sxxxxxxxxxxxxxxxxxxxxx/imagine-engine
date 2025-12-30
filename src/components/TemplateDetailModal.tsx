'use client';

import { X, Copy, ExternalLink, Tag, Sparkles } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useLanguage } from '@/contexts/LanguageContext';
import { PromptTemplate, templateCategories, templateDifficulty } from '@/data/promptTemplates';

interface TemplateDetailModalProps {
  template: PromptTemplate;
  onClose: () => void;
}

export default function TemplateDetailModal({ template, onClose }: TemplateDetailModalProps) {
  const { language, t } = useLanguage();
  const router = useRouter();

  const categoryName = templateCategories[template.category];
  const difficultyInfo = templateDifficulty[template.difficulty];

  const handleCopyPrompt = async () => {
    const promptText = language === 'zh' ? template.prompt : template.promptEn;
    await navigator.clipboard.writeText(promptText);
    alert(language === 'zh' ? '✓ 提示词已复制' : '✓ Prompt copied');
  };

  const handleUseInStudio = () => {
    const promptText = language === 'zh' ? template.prompt : template.promptEn;
    localStorage.setItem('pending-prompt', promptText);
    router.push('/create');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm" onClick={onClose}>
      <div 
        className="bg-white dark:bg-dark-950 rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto border border-dark-200 dark:border-dark-800"
        onClick={(e) => e.stopPropagation()}
      >
        {/* 头部 */}
        <div className="sticky top-0 bg-white dark:bg-dark-950 border-b border-dark-200 dark:border-dark-800 p-6 flex items-start justify-between z-10">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <h2 className="text-2xl font-bold text-dark-900 dark:text-dark-50">
                {language === 'zh' ? template.title : template.titleEn}
              </h2>
              {template.featured && (
                <span className="px-2 py-1 bg-accent-100 dark:bg-accent-900/30 text-accent-600 dark:text-accent-400 text-xs font-semibold rounded">
                  {language === 'zh' ? '精选' : 'Featured'}
                </span>
              )}
            </div>
            <p className="text-dark-600 dark:text-dark-400">
              {language === 'zh' ? template.description : template.descriptionEn}
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-10 h-10 rounded-lg hover:bg-dark-100 dark:hover:bg-dark-900 transition-colors flex items-center justify-center flex-shrink-0 ml-4"
          >
            <X className="w-5 h-5 text-dark-600 dark:text-dark-400" />
          </button>
        </div>

        {/* 内容 */}
        <div className="p-6 space-y-6">
          {/* 元数据 */}
          <div className="flex flex-wrap gap-3">
            <div className="flex items-center gap-2 px-3 py-2 bg-primary-50 dark:bg-primary-900/20 rounded-lg">
              <Tag className="w-4 h-4 text-primary-600 dark:text-primary-400" />
              <span className="text-sm font-medium text-primary-700 dark:text-primary-300">
                {language === 'zh' ? categoryName.zh : categoryName.en}
              </span>
            </div>
            <div className="flex items-center gap-2 px-3 py-2 bg-dark-100 dark:bg-dark-900 rounded-lg">
              <span className={`text-sm font-medium ${difficultyInfo.color}`}>
                {language === 'zh' ? difficultyInfo.zh : difficultyInfo.en}
              </span>
            </div>
            <div className="flex items-center gap-2 px-3 py-2 bg-dark-100 dark:bg-dark-900 rounded-lg">
              <Sparkles className="w-4 h-4 text-dark-600 dark:text-dark-400" />
              <span className="text-sm text-dark-700 dark:text-dark-300">
                {template.uses.toLocaleString()} {language === 'zh' ? '次使用' : 'uses'}
              </span>
            </div>
          </div>

          {/* 推荐配置 */}
          {(template.recommendedModel || template.recommendedRatio) && (
            <div className="space-y-2">
              <h3 className="text-sm font-semibold text-dark-900 dark:text-dark-50">
                {language === 'zh' ? '推荐配置' : 'Recommended Settings'}
              </h3>
              <div className="grid grid-cols-2 gap-3">
                {template.recommendedModel && (
                  <div className="px-4 py-3 bg-dark-50 dark:bg-dark-900 rounded-lg">
                    <p className="text-xs text-dark-500 mb-1">
                      {language === 'zh' ? '推荐模型' : 'Recommended Model'}
                    </p>
                    <p className="text-sm font-medium text-dark-900 dark:text-dark-50 font-mono">
                      {template.recommendedModel}
                    </p>
                  </div>
                )}
                {template.recommendedRatio && (
                  <div className="px-4 py-3 bg-dark-50 dark:bg-dark-900 rounded-lg">
                    <p className="text-xs text-dark-500 mb-1">
                      {language === 'zh' ? '推荐比例' : 'Recommended Ratio'}
                    </p>
                    <p className="text-sm font-medium text-dark-900 dark:text-dark-50">
                      {template.recommendedRatio}
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* 提示词 */}
          <div className="space-y-2">
            <h3 className="text-sm font-semibold text-dark-900 dark:text-dark-50">
              {language === 'zh' ? '完整提示词' : 'Full Prompt'}
            </h3>
            <div className="relative">
              <pre className="text-sm text-dark-700 dark:text-dark-300 bg-dark-50 dark:bg-dark-900 p-4 rounded-lg border border-dark-200 dark:border-dark-700 overflow-x-auto whitespace-pre-wrap font-mono">
                {language === 'zh' ? template.prompt : template.promptEn}
              </pre>
            </div>
          </div>

          {/* 标签 */}
          {template.tags.length > 0 && (
            <div className="space-y-2">
              <h3 className="text-sm font-semibold text-dark-900 dark:text-dark-50">
                {language === 'zh' ? '相关标签' : 'Tags'}
              </h3>
              <div className="flex flex-wrap gap-2">
                {template.tags.map((tag, i) => (
                  <span
                    key={i}
                    className="px-3 py-1 bg-dark-100 dark:bg-dark-900 text-dark-700 dark:text-dark-300 text-xs rounded-full"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* 操作按钮 */}
          <div className="flex gap-3 pt-4">
            <button
              onClick={handleCopyPrompt}
              className="btn-secondary flex-1"
            >
              <Copy className="w-5 h-5" />
              {t('templates.copyPrompt')}
            </button>
            <button
              onClick={handleUseInStudio}
              className="btn-primary flex-1"
            >
              <ExternalLink className="w-5 h-5" />
              {language === 'zh' ? '去 AI Studio 使用' : 'Use in AI Studio'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

