'use client';

import { ShowcaseCase, categoryNames, difficultyNames } from '@/data/showcaseCases';
import { X, Copy, Sparkles, ArrowRight, ExternalLink } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

interface ShowcaseDetailModalProps {
  case: ShowcaseCase;
  language: 'zh' | 'en';
  onClose: () => void;
}

export default function ShowcaseDetailModal({ case: showcase, language, onClose }: ShowcaseDetailModalProps) {
  const router = useRouter();
  const [copied, setCopied] = useState(false);
  
  const title = language === 'zh' ? showcase.title : showcase.titleEn;
  const description = language === 'zh' ? showcase.description : showcase.descriptionEn;
  const prompt = language === 'zh' ? showcase.prompt : showcase.promptEn;
  const category = categoryNames[showcase.category][language];
  const difficulty = difficultyNames[showcase.difficulty];
  const difficultyText = difficulty[language];

  const handleCopy = () => {
    navigator.clipboard.writeText(prompt);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleUseInStudio = () => {
    localStorage.setItem('pending-prompt', prompt);
    if (showcase.inputImages.length > 0) {
      localStorage.setItem('showcase-needs-input', 'true');
    }
    router.push('/create');
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content max-w-5xl" onClick={(e) => e.stopPropagation()}>
        {/* 关闭按钮 */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 rounded-full bg-dark-100 dark:bg-dark-900 hover:bg-dark-200 dark:hover:bg-dark-800 flex items-center justify-center transition-colors"
        >
          <X className="w-5 h-5 text-dark-600 dark:text-dark-400" />
        </button>

        {/* 标题 */}
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-dark-900 dark:text-dark-50 mb-2">
            {title}
          </h2>
          <p className="text-dark-600 dark:text-dark-400">
            {description}
          </p>
        </div>

        {/* 图片对比 */}
        <div className="mb-6">
          <div className="flex gap-4 items-center">
            {/* 输入图 */}
            {showcase.inputImages.length > 0 && (
              <>
                <div className="flex-1">
                  <label className="form-label mb-2">
                    {language === 'zh' ? '输入图' : 'Input'}
                  </label>
                  <div className="grid gap-2">
                    {showcase.inputImages.map((img, idx) => (
                      <div key={idx} className="aspect-video rounded-lg overflow-hidden bg-dark-100 dark:bg-dark-900">
                        <img
                          src={img}
                          alt={`Input ${idx + 1}`}
                          className="w-full h-full object-contain"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="300"%3E%3Crect fill="%23e2e8f0" width="400" height="300"/%3E%3Ctext x="200" y="150" text-anchor="middle" fill="%2394a3b8" font-size="16"%3E输入图片%3C/text%3E%3C/svg%3E';
                          }}
                        />
                      </div>
                    ))}
                  </div>
                </div>
                <ArrowRight className="w-8 h-8 text-primary-500 flex-shrink-0 mt-8" />
              </>
            )}
            
            {/* 输出图 */}
            <div className="flex-1">
              <label className="form-label mb-2">
                {language === 'zh' ? '输出图' : 'Output'}
              </label>
              <div className="aspect-video rounded-lg overflow-hidden bg-dark-100 dark:bg-dark-900">
                <img
                  src={showcase.outputImage}
                  alt="Output"
                  className="w-full h-full object-contain"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="300"%3E%3Crect fill="%23e2e8f0" width="400" height="300"/%3E%3Ctext x="200" y="150" text-anchor="middle" fill="%2394a3b8" font-size="16"%3E输出图片%3C/text%3E%3C/svg%3E';
                  }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* 提示词 */}
        <div className="mb-6">
          <label className="form-label mb-2">
            {language === 'zh' ? '完整提示词' : 'Full Prompt'}
          </label>
          <div className="relative">
            <pre className="p-4 bg-dark-50 dark:bg-dark-900 rounded-lg text-sm text-dark-800 dark:text-dark-200 overflow-x-auto whitespace-pre-wrap font-mono">
              {prompt}
            </pre>
            <button
              onClick={handleCopy}
              className="absolute top-2 right-2 btn-ghost text-xs"
            >
              <Copy className="w-3 h-3" />
              {copied 
                ? (language === 'zh' ? '已复制' : 'Copied') 
                : (language === 'zh' ? '复制' : 'Copy')}
            </button>
          </div>
        </div>

        {/* 元数据 */}
        <div className="grid md:grid-cols-2 gap-4 mb-6">
          <div className="card p-4 bg-dark-50 dark:bg-dark-900">
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-dark-600 dark:text-dark-400">
                  {language === 'zh' ? '分类' : 'Category'}:
                </span>
                <span className="font-medium text-dark-900 dark:text-dark-50">{category}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-dark-600 dark:text-dark-400">
                  {language === 'zh' ? '难度' : 'Difficulty'}:
                </span>
                <span className="font-medium text-dark-900 dark:text-dark-50">{difficultyText}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-dark-600 dark:text-dark-400">
                  {language === 'zh' ? '作者' : 'Author'}:
                </span>
                <span className="font-medium text-dark-900 dark:text-dark-50">{showcase.author}</span>
              </div>
            </div>
          </div>

          <div className="card p-4 bg-dark-50 dark:bg-dark-900">
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-dark-600 dark:text-dark-400">
                  {language === 'zh' ? '模型' : 'Model'}:
                </span>
                <span className="font-medium text-dark-900 dark:text-dark-50">{showcase.modelUsed}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-dark-600 dark:text-dark-400">
                  {language === 'zh' ? '需要参考图' : 'Needs Input'}:
                </span>
                <span className="font-medium text-dark-900 dark:text-dark-50">
                  {showcase.requiresInput 
                    ? (language === 'zh' ? '是' : 'Yes') 
                    : (language === 'zh' ? '否' : 'No')}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* 标签 */}
        {showcase.tags.length > 0 && (
          <div className="mb-6">
            <div className="flex flex-wrap gap-2">
              {showcase.tags.map((tag, idx) => (
                <span key={idx} className="badge-primary">
                  #{tag}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* 操作按钮 */}
        <div className="flex gap-3">
          <button onClick={handleCopy} className="btn-secondary flex-1">
            <Copy className="w-4 h-4" />
            {language === 'zh' ? '复制提示词' : 'Copy Prompt'}
          </button>
          <button onClick={handleUseInStudio} className="btn-primary flex-1">
            <Sparkles className="w-4 h-4" />
            {language === 'zh' ? '去 AI Studio 使用' : 'Use in Studio'}
          </button>
          <a
            href="https://github.com/PicoTrex/Awesome-Nano-Banana-images"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-ghost"
          >
            <ExternalLink className="w-4 h-4" />
          </a>
        </div>
      </div>
    </div>
  );
}

