'use client';

import { useState, useMemo } from 'react';
import { showcaseCases } from '@/data/showcaseCases';

interface PromptTemplate {
  id: number;
  category: string;
  title: string;
  prompt: string;
  description: string;
  inputRequired: boolean;
  difficulty: 'easy' | 'medium' | 'hard';
  exampleImage?: string;
}

// 将ShowcaseCase转换为PromptTemplate格式
const convertShowcaseCasesToTemplates = (): PromptTemplate[] => {
  const categoryMap: Record<string, string> = {
    'portrait': '人像摄影',
    'landscape': '风景建筑',
    'product': '产品摄影',
    'art': '艺术创意',
    'fusion': '图像融合',
    'edit': '图像编辑'
  };

  return showcaseCases.map(case_ => ({
    id: case_.id,
    category: categoryMap[case_.category] || '其他',
    title: case_.title,
    prompt: case_.prompt,
    description: case_.description,
    inputRequired: case_.requiresInput,
    difficulty: case_.difficulty,
    exampleImage: case_.outputImage
  }));
};

// 从showcaseCases生成110个提示词模板
const promptTemplates: PromptTemplate[] = convertShowcaseCasesToTemplates();

interface PromptGalleryProps {
  isVisible: boolean;
  onClose: () => void;
  onSelectPrompt: (prompt: string) => void;
}

export default function PromptGallery({ isVisible, onClose, onSelectPrompt }: PromptGalleryProps) {
  const [selectedCategory, setSelectedCategory] = useState('全部');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDifficulty, setSelectedDifficulty] = useState('全部');

  // 使用useMemo优化性能
  const categories = useMemo(() => {
    const cats = Array.from(new Set(promptTemplates.map(t => t.category)));
    return ['全部', ...cats];
  }, []);
  
  const difficulties = ['全部', 'easy', 'medium', 'hard'];
  const difficultyLabels = { easy: '简单', medium: '中等', hard: '高级' };

  const filteredTemplates = promptTemplates.filter(template => {
    const matchesCategory = selectedCategory === '全部' || template.category === selectedCategory;
    const matchesSearch = 
      template.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      template.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      template.prompt.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesDifficulty = selectedDifficulty === '全部' || template.difficulty === selectedDifficulty;
    return matchesCategory && matchesSearch && matchesDifficulty;
  });

  const handleSelectTemplate = (template: PromptTemplate) => {
    onSelectPrompt(template.prompt);
    onClose();
  };

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(0, 0, 0, 0.75)' }} onClick={onClose}>
      <div 
        className="w-full max-w-6xl h-[85vh] flex flex-col rounded-2xl shadow-2xl overflow-hidden bg-white dark:bg-dark-900"
        onClick={(e) => e.stopPropagation()}
      >
        {/* 头部 */}
        <div className="px-6 py-4 border-b border-dark-200 dark:border-dark-800">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h2 className="text-2xl font-bold flex items-center gap-2 text-dark-900 dark:text-dark-50">
                🎨 提示词画廊
              </h2>
              <p className="text-sm mt-1 text-dark-600 dark:text-dark-400">
                {promptTemplates.length}+ 精选创意模板，来自 GitHub 14k⭐ 项目
              </p>
            </div>
            <button
              onClick={onClose}
              className="w-10 h-10 rounded-full hover:bg-red-500/10 flex items-center justify-center transition-colors text-dark-500 dark:text-dark-400"
            >
              <span className="text-2xl">×</span>
            </button>
          </div>

          {/* 搜索框 */}
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="🔍 搜索提示词..."
            className="input w-full text-sm"
          />
        </div>

        {/* 筛选栏 */}
        <div className="px-6 py-3 border-b border-dark-200 dark:border-dark-800">
          <div className="flex flex-wrap gap-2 mb-3">
            <span className="text-xs font-semibold px-2 py-1 text-dark-600 dark:text-dark-400">分类:</span>
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`text-xs px-3 py-1 rounded-full transition-all ${
                  selectedCategory === category
                    ? 'bg-primary-500 text-white shadow-md'
                    : 'bg-dark-100 dark:bg-dark-800 text-dark-600 dark:text-dark-400 hover:bg-dark-200 dark:hover:bg-dark-700'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
          
          <div className="flex flex-wrap gap-2">
            <span className="text-xs font-semibold px-2 py-1 text-dark-600 dark:text-dark-400">难度:</span>
            {difficulties.map((diff) => (
              <button
                key={diff}
                onClick={() => setSelectedDifficulty(diff)}
                className={`text-xs px-3 py-1 rounded-full transition-all ${
                  selectedDifficulty === diff
                    ? 'bg-primary-500 text-white shadow-md'
                    : 'bg-dark-100 dark:bg-dark-800 text-dark-600 dark:text-dark-400 hover:bg-dark-200 dark:hover:bg-dark-700'
                }`}
              >
                {diff === '全部' ? '全部' : difficultyLabels[diff as keyof typeof difficultyLabels]}
              </button>
            ))}
          </div>
        </div>

        {/* 模板网格 */}
        <div className="flex-1 overflow-y-auto p-6 bg-dark-50 dark:bg-dark-950">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-3">
            {filteredTemplates.map((template) => (
              <div
                key={template.id}
                className="card-hover overflow-hidden cursor-pointer group bg-white dark:bg-dark-900"
                onClick={() => handleSelectTemplate(template)}
              >
                {/* 示例图片 */}
                {template.exampleImage && (
                  <div className="relative w-full h-32 overflow-hidden bg-dark-100 dark:bg-dark-800">
                    <img
                      src={template.exampleImage}
                      alt={template.title}
                      className="w-full h-full object-cover transition-transform group-hover:scale-105"
                      onError={(e) => {
                        (e.target as HTMLImageElement).style.display = 'none';
                      }}
                    />
                  </div>
                )}

                {/* 信息区域 */}
                <div className="p-3">
                  {/* 标题行 */}
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="font-bold text-sm flex-1 truncate text-dark-900 dark:text-dark-50" title={template.title}>
                      {template.title}
                    </h3>
                    {template.inputRequired && (
                      <span className="text-sm flex-shrink-0" title="需要上传图片">📷</span>
                    )}
                  </div>
                  
                  {/* 描述 */}
                  <p className="text-xs mb-2 line-clamp-2 text-dark-600 dark:text-dark-400">
                    {template.description}
                  </p>
                  
                  {/* 底部标签 */}
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs px-2 py-0.5 rounded bg-dark-100 dark:bg-dark-800 text-dark-600 dark:text-dark-400">
                      {template.category}
                    </span>
                    <span className={`text-xs px-2 py-0.5 rounded ${
                      template.difficulty === 'easy' ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300' :
                      template.difficulty === 'medium' ? 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300' :
                      'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300'
                    }`}>
                      {difficultyLabels[template.difficulty]}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {filteredTemplates.length === 0 && (
            <div className="text-center py-20">
              <span className="text-5xl">🔍</span>
              <p className="mt-4 text-dark-600 dark:text-dark-400">
                没有找到匹配的提示词
              </p>
            </div>
          )}
        </div>

        {/* 底部统计 */}
        <div className="px-6 py-3 border-t border-dark-200 dark:border-dark-800">
          <p className="text-xs text-center text-dark-500 dark:text-dark-500">
            共 {filteredTemplates.length} 个模板 · 点击卡片即可应用提示词
          </p>
        </div>
      </div>
    </div>
  );
}
