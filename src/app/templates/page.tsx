'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useLanguage } from '@/contexts/LanguageContext';
import { Search, Plus, Star, Filter, TrendingUp } from 'lucide-react';
import { promptTemplates, templateCategories } from '@/data/promptTemplates';
import TemplateCard from '@/components/TemplateCard';
import TemplateDetailModal from '@/components/TemplateDetailModal';

export default function TemplatesPage() {
  const { language, t } = useLanguage();
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState('all');
  const [selectedTemplate, setSelectedTemplate] = useState<number | null>(null);
  const [sortBy, setSortBy] = useState<'uses' | 'featured'>('featured');

  const categories = [
    { id: 'all', name: language === 'zh' ? '全部模板' : 'All Templates' },
    { id: 'photography', name: t('templates.category.photography') },
    { id: 'art', name: t('templates.category.art') },
    { id: 'design', name: t('templates.category.design') },
    { id: 'portrait', name: t('templates.category.portrait') },
    { id: 'product', name: t('templates.category.product') },
    { id: 'landscape', name: t('templates.category.landscape') },
    { id: 'architecture', name: t('templates.category.architecture') },
    { id: 'food', name: t('templates.category.food') },
  ];

  const difficulties = [
    { id: 'all', name: language === 'zh' ? '全部难度' : 'All Difficulties' },
    { id: 'easy', name: t('templates.difficulty.easy') },
    { id: 'medium', name: t('templates.difficulty.medium') },
    { id: 'hard', name: t('templates.difficulty.hard') },
  ];

  // 筛选和排序
  const filteredTemplates = promptTemplates
    .filter(template => {
      const matchesSearch = (language === 'zh' ? template.title : template.titleEn)
        .toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
        template.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
      const matchesCategory = selectedCategory === 'all' || template.category === selectedCategory;
      const matchesDifficulty = selectedDifficulty === 'all' || template.difficulty === selectedDifficulty;
      return matchesSearch && matchesCategory && matchesDifficulty;
    })
    .sort((a, b) => {
      if (sortBy === 'featured') {
        if (a.featured && !b.featured) return -1;
        if (!a.featured && b.featured) return 1;
        return b.uses - a.uses;
      }
      return b.uses - a.uses;
    });

  const featuredTemplates = promptTemplates.filter(t => t.featured);
  const currentTemplateData = selectedTemplate !== null 
    ? promptTemplates.find(t => t.id === selectedTemplate) 
    : null;

  const handleUseTemplate = (template: typeof promptTemplates[0]) => {
    const promptText = language === 'zh' ? template.prompt : template.promptEn;
    localStorage.setItem('pending-prompt', promptText);
    router.push('/create');
  };

  return (
    <div className="page-container">
      <div className="content-wrapper">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-dark-900 dark:text-dark-50 mb-2">
            {t('templates.title')}
          </h1>
          <p className="text-dark-600 dark:text-dark-400">
            {t('templates.subtitle')}
          </p>
        </div>

        {/* Search & Filter */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-dark-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t('templates.search')}
              className="input pl-10"
            />
          </div>
          <button className="btn-primary">
            <Plus className="w-5 h-5" />
            {t('templates.newTemplate')}
          </button>
        </div>

        {/* 精选模板横幅 */}
        {featuredTemplates.length > 0 && (
          <div className="card-elevated p-6 mb-8 bg-gradient-to-r from-primary-50 to-primary-100/50 dark:from-primary-900/20 dark:to-primary-900/10 border-primary-200 dark:border-primary-800">
            <div className="flex items-center gap-3 mb-4">
              <Star className="w-6 h-6 text-accent-500 fill-accent-500" />
              <h2 className="text-xl font-bold text-dark-900 dark:text-dark-50">
                {language === 'zh' ? '精选模板' : 'Featured Templates'}
              </h2>
              <span className="text-sm text-primary-600 dark:text-primary-400">
                {featuredTemplates.length} {language === 'zh' ? '个' : ''}
              </span>
            </div>
            <div className="grid md:grid-cols-3 gap-4">
              {featuredTemplates.slice(0, 3).map(template => (
                <TemplateCard
                  key={template.id}
                  template={template}
                  onClick={() => setSelectedTemplate(template.id)}
                  onUse={() => handleUseTemplate(template)}
                />
              ))}
            </div>
          </div>
        )}

        {/* 搜索和筛选 */}
        <div className="card p-6 mb-6">
          <div className="flex flex-col md:flex-row gap-4 mb-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-dark-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={t('templates.search')}
                className="input pl-10 w-full"
              />
            </div>
            <select
              value={selectedDifficulty}
              onChange={(e) => setSelectedDifficulty(e.target.value)}
              className="select md:w-48"
            >
              {difficulties.map(d => (
                <option key={d.id} value={d.id}>{d.name}</option>
              ))}
            </select>
          </div>

          {/* 分类标签 */}
          <div className="flex gap-2 overflow-x-auto pb-2">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-4 py-2 rounded-button text-sm font-medium whitespace-nowrap transition-colors ${
                  selectedCategory === cat.id
                    ? 'bg-primary-400 text-white'
                    : 'bg-dark-100 dark:bg-dark-900 text-dark-600 dark:text-dark-400 hover:bg-dark-200 dark:hover:bg-dark-800'
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>

          {/* 结果统计 */}
          <div className="flex items-center justify-between mt-4 pt-4 border-t border-dark-200 dark:border-dark-800">
            <p className="text-sm text-dark-600 dark:text-dark-400">
              {language === 'zh' ? '找到' : 'Found'} <span className="font-semibold text-primary-600 dark:text-primary-400">{filteredTemplates.length}</span> {language === 'zh' ? '个模板' : 'templates'}
            </p>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setSortBy('featured')}
                className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors ${
                  sortBy === 'featured'
                    ? 'bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300'
                    : 'text-dark-600 dark:text-dark-400 hover:bg-dark-100 dark:hover:bg-dark-900'
                }`}
              >
                <Star className="w-3 h-3 inline mr-1" />
                {language === 'zh' ? '精选优先' : 'Featured'}
              </button>
              <button
                onClick={() => setSortBy('uses')}
                className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors ${
                  sortBy === 'uses'
                    ? 'bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300'
                    : 'text-dark-600 dark:text-dark-400 hover:bg-dark-100 dark:hover:bg-dark-900'
                }`}
              >
                <TrendingUp className="w-3 h-3 inline mr-1" />
                {language === 'zh' ? '热门优先' : 'Most Used'}
              </button>
            </div>
          </div>
        </div>

        {/* 模板网格 */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTemplates.map((template) => (
            <TemplateCard
              key={template.id}
              template={template}
              onClick={() => setSelectedTemplate(template.id)}
              onUse={() => handleUseTemplate(template)}
            />
          ))}
        </div>

        {/* 模板详情模态框 */}
        {selectedTemplate !== null && currentTemplateData && (
          <TemplateDetailModal
            template={currentTemplateData}
            onClose={() => setSelectedTemplate(null)}
          />
        )}
      </div>
    </div>
  );
}

