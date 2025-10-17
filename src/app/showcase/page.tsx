'use client';

import { useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { showcaseCases, categoryNames } from '@/data/showcaseCases';
import ShowcaseCard from '@/components/ShowcaseCard';
import ShowcaseDetailModal from '@/components/ShowcaseDetailModal';
import { Search, Filter, Sparkles } from 'lucide-react';

export default function ShowcasePage() {
  const { language } = useLanguage();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('all');
  const [selectedCase, setSelectedCase] = useState<number | null>(null);

  // 筛选案例
  const filteredCases = showcaseCases.filter(c => {
    const matchesSearch = (language === 'zh' ? c.title : c.titleEn)
      .toLowerCase()
      .includes(searchQuery.toLowerCase()) ||
      c.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesCategory = selectedCategory === 'all' || c.category === selectedCategory;
    const matchesDifficulty = selectedDifficulty === 'all' || c.difficulty === selectedDifficulty;
    
    return matchesSearch && matchesCategory && matchesDifficulty;
  });

  const featuredCases = showcaseCases.filter(c => c.featured);
  const currentCaseData = selectedCase !== null 
    ? showcaseCases.find(c => c.id === selectedCase) 
    : null;

  return (
    <div className="page-container">
      <div className="content-wrapper">
        {/* 页面标题 */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-dark-900 dark:text-dark-50 mb-2">
            {language === 'zh' ? '案例展示' : 'Showcase'}
          </h1>
          <p className="text-dark-600 dark:text-dark-400">
            {language === 'zh' 
              ? `${showcaseCases.length} 个精选案例 · 学习优秀提示词 · 激发创作灵感` 
              : `${showcaseCases.length} curated cases · Learn great prompts · Inspire creativity`}
          </p>
        </div>

        {/* 精选案例横幅 */}
        {featuredCases.length > 0 && (
          <div className="card-elevated p-6 mb-8 bg-gradient-to-r from-primary-50 to-primary-100/50 dark:from-primary-900/20 dark:to-primary-900/10 border-primary-200 dark:border-primary-800">
            <div className="flex items-center gap-3 mb-4">
              <Sparkles className="w-6 h-6 text-primary-600 dark:text-primary-400" />
              <h2 className="text-xl font-bold text-dark-900 dark:text-dark-50">
                {language === 'zh' ? '精选案例' : 'Featured Cases'}
              </h2>
            </div>
            <div className="grid md:grid-cols-3 gap-3">
              {featuredCases.slice(0, 3).map(c => (
                <ShowcaseCard
                  key={c.id}
                  case={c}
                  language={language}
                  onClick={() => setSelectedCase(c.id)}
                />
              ))}
            </div>
          </div>
        )}

        {/* 搜索和筛选 - 优化布局 */}
        <div className="card p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-4 mb-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-dark-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={language === 'zh' ? '搜索案例标题、标签、作者...' : 'Search titles, tags, authors...'}
                className="input pl-10 text-base"
              />
            </div>

            <div className="flex gap-3">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="select w-40"
              >
                <option value="all">{language === 'zh' ? '全部分类' : 'All'}</option>
                {Object.entries(categoryNames).map(([key, value]) => (
                  <option key={key} value={key}>{value[language]}</option>
                ))}
              </select>

              <select
                value={selectedDifficulty}
                onChange={(e) => setSelectedDifficulty(e.target.value)}
                className="select w-32"
              >
                <option value="all">{language === 'zh' ? '全部难度' : 'All'}</option>
                <option value="easy">{language === 'zh' ? '简单' : 'Easy'}</option>
                <option value="medium">{language === 'zh' ? '中等' : 'Medium'}</option>
                <option value="hard">{language === 'zh' ? '困难' : 'Hard'}</option>
              </select>
            </div>
          </div>

          {/* 结果统计 - 优化显示 */}
          <div className="flex items-center justify-between text-sm">
            <span className="text-dark-600 dark:text-dark-400">
              {language === 'zh' ? '显示' : 'Showing'} <span className="font-semibold text-primary-600 dark:text-primary-400">{filteredCases.length}</span> {language === 'zh' ? '个案例' : 'cases'}
            </span>
            {(selectedCategory !== 'all' || selectedDifficulty !== 'all' || searchQuery) && (
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedCategory('all');
                  setSelectedDifficulty('all');
                }}
                className="text-primary-600 dark:text-primary-400 hover:underline"
              >
                {language === 'zh' ? '清除筛选' : 'Clear Filters'}
              </button>
            )}
          </div>
        </div>

        {/* 案例网格 - 根据输入图数量分组显示 */}
        {filteredCases.length === 0 ? (
          <div className="card p-12 text-center">
            <Filter className="w-12 h-12 text-dark-400 mx-auto mb-4" />
            <p className="text-dark-600 dark:text-dark-400">
              {language === 'zh' ? '没有找到匹配的案例' : 'No matching cases found'}
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {/* 有输入图的案例（图生图） */}
            {filteredCases.filter(c => c.inputImages.length > 0).length > 0 && (
              <div>
                <h3 className="text-sm font-semibold text-dark-700 dark:text-dark-300 mb-3 flex items-center gap-2">
                  <span className="w-1 h-4 bg-primary-500 rounded"></span>
                  {language === 'zh' ? '图生图案例' : 'Image-to-Image Cases'}
                  <span className="text-xs text-dark-500">
                    ({filteredCases.filter(c => c.inputImages.length > 0).length})
                  </span>
                </h3>
                <div className="grid md:grid-cols-3 gap-3">
                  {filteredCases.filter(c => c.inputImages.length > 0).map(c => (
                    <ShowcaseCard
                      key={c.id}
                      case={c}
                      language={language}
                      onClick={() => setSelectedCase(c.id)}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* 无输入图的案例（纯文生图） - 更紧凑布局 */}
            {filteredCases.filter(c => c.inputImages.length === 0).length > 0 && (
              <div>
                <h3 className="text-sm font-semibold text-dark-700 dark:text-dark-300 mb-3 flex items-center gap-2">
                  <span className="w-1 h-4 bg-accent-500 rounded"></span>
                  {language === 'zh' ? '纯文生图案例' : 'Text-to-Image Cases'}
                  <span className="text-xs text-dark-500">
                    ({filteredCases.filter(c => c.inputImages.length === 0).length})
                  </span>
                </h3>
                <div className="grid md:grid-cols-4 lg:grid-cols-5 gap-2">
                  {filteredCases.filter(c => c.inputImages.length === 0).map(c => (
                    <ShowcaseCard
                      key={c.id}
                      case={c}
                      language={language}
                      onClick={() => setSelectedCase(c.id)}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* 详情模态框 */}
        {currentCaseData && (
          <ShowcaseDetailModal
            case={currentCaseData}
            language={language}
            onClose={() => setSelectedCase(null)}
          />
        )}
      </div>
    </div>
  );
}

