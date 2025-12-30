'use client';

import { useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { showcaseCases, categoryNames } from '@/data/showcaseCases';
import ShowcaseCard from '@/components/ShowcaseCard';
import ShowcaseDetailModal from '@/components/ShowcaseDetailModal';
import CustomSelect from '@/components/CustomSelect';
import { Search, Filter, Sparkles } from 'lucide-react';

export default function ShowcasePage() {
  const { language } = useLanguage();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('all');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [selectedCase, setSelectedCase] = useState<number | null>(null);
  const [showAllTags, setShowAllTags] = useState(false);

  // 获取所有唯一标签，并按使用频率排序
  const tagCounts = new Map<string, number>();
  showcaseCases.forEach(c => {
    c.tags.forEach(tag => {
      tagCounts.set(tag, (tagCounts.get(tag) || 0) + 1);
    });
  });
  const allTags = Array.from(tagCounts.entries())
    .sort((a, b) => b[1] - a[1]) // 按使用频率降序排序
    .map(([tag]) => tag);

  // 筛选案例
  const filteredCases = showcaseCases.filter(c => {
    // 搜索筛选：如果搜索框为空，跳过搜索筛选
    const matchesSearch = searchQuery.trim() === '' || 
      (language === 'zh' ? c.title : c.titleEn)
        .toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      c.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase())) ||
      c.author.toLowerCase().includes(searchQuery.toLowerCase());
    
    // 分类筛选
    const matchesCategory = selectedCategory === 'all' || c.category === selectedCategory;
    
    // 难度筛选
    const matchesDifficulty = selectedDifficulty === 'all' || c.difficulty === selectedDifficulty;
    
    // 标签筛选：如果选择了标签，使用 OR 逻辑（包含任意一个选中的标签即可）
    // 这样选择多个标签时，会显示更多结果，而不是更少
    const matchesTags = selectedTags.length === 0 || 
      selectedTags.some(tag => c.tags.includes(tag));
    
    return matchesSearch && matchesCategory && matchesDifficulty && matchesTags;
  });

  // 切换标签选择
  const toggleTag = (tag: string) => {
    setSelectedTags(prev => 
      prev.includes(tag) 
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    );
  };

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
              <CustomSelect
                value={selectedCategory}
                onChange={setSelectedCategory}
                options={[
                  { value: 'all', label: language === 'zh' ? '全部分类' : 'All' },
                  ...Object.entries(categoryNames).map(([key, value]) => ({
                    value: key,
                    label: value[language]
                  }))
                ]}
                className="w-40"
              />

              <CustomSelect
                value={selectedDifficulty}
                onChange={setSelectedDifficulty}
                options={[
                  { value: 'all', label: language === 'zh' ? '全部难度' : 'All' },
                  { value: 'easy', label: language === 'zh' ? '简单' : 'Easy' },
                  { value: 'medium', label: language === 'zh' ? '中等' : 'Medium' },
                  { value: 'hard', label: language === 'zh' ? '困难' : 'Hard' }
                ]}
                className="w-32"
              />
            </div>
          </div>

          {/* 标签筛选 */}
          {allTags.length > 0 && (
            <div className="mb-4">
              <div className="flex items-center justify-between mb-2">
                <div className="text-sm font-medium text-dark-700 dark:text-dark-300">
                  {language === 'zh' ? '标签筛选' : 'Filter by Tags'} 
                  <span className="ml-2 text-xs text-dark-500 dark:text-dark-500">
                    ({allTags.length} {language === 'zh' ? '个标签' : 'tags'})
                  </span>
                </div>
                {allTags.length > 30 && (
                  <button
                    onClick={() => setShowAllTags(!showAllTags)}
                    className="text-xs text-primary-600 dark:text-primary-400 hover:underline"
                  >
                    {showAllTags 
                      ? (language === 'zh' ? '收起' : 'Show Less')
                      : (language === 'zh' ? `展开全部 (${allTags.length})` : `Show All (${allTags.length})`)
                    }
                  </button>
                )}
              </div>
              <div className="flex flex-wrap gap-2">
                {(showAllTags ? allTags : allTags.slice(0, 30)).map(tag => (
                  <button
                    key={tag}
                    onClick={() => toggleTag(tag)}
                    className={`px-3 py-1.5 rounded-full text-sm transition-all ${
                      selectedTags.includes(tag)
                        ? 'bg-primary-500 text-white shadow-md'
                        : 'bg-dark-100 dark:bg-dark-800 text-dark-700 dark:text-dark-300 hover:bg-dark-200 dark:hover:bg-dark-700'
                    }`}
                  >
                    {tag}
                  </button>
                ))}
              </div>
              {selectedTags.length > 0 && (
                <div className="mt-2 flex items-center gap-2 flex-wrap">
                  <span className="text-xs text-dark-500 dark:text-dark-500">
                    {language === 'zh' ? '已选择' : 'Selected'}: 
                  </span>
                  {selectedTags.map(tag => (
                    <span
                      key={tag}
                      className="px-2 py-1 bg-primary-100 dark:bg-primary-900 text-primary-700 dark:text-primary-300 rounded text-xs flex items-center gap-1"
                    >
                      {tag}
                      <button
                        onClick={() => toggleTag(tag)}
                        className="hover:text-primary-900 dark:hover:text-primary-100"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* 结果统计 - 优化显示 */}
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-2">
              <span className="text-dark-600 dark:text-dark-400">
                {language === 'zh' ? '显示' : 'Showing'} 
                <span className="font-semibold text-primary-600 dark:text-primary-400 mx-1">
                  {filteredCases.length}
                </span>
                {language === 'zh' ? '个案例' : 'cases'}
                {filteredCases.length < showcaseCases.length && (
                  <span className="text-dark-500 dark:text-dark-500 ml-1">
                    / {showcaseCases.length} {language === 'zh' ? '总计' : 'total'}
                  </span>
                )}
              </span>
              {/* 显示当前筛选条件 */}
              {(selectedCategory !== 'all' || selectedDifficulty !== 'all' || searchQuery.trim() || selectedTags.length > 0) && (
                <span className="text-xs text-dark-500 dark:text-dark-500">
                  (
                  {selectedCategory !== 'all' && `${categoryNames[selectedCategory as keyof typeof categoryNames]?.[language] || selectedCategory} `}
                  {selectedDifficulty !== 'all' && `${selectedDifficulty} `}
                  {searchQuery.trim() && `"${searchQuery}" `}
                  {selectedTags.length > 0 && `${selectedTags.length} ${language === 'zh' ? '个标签' : 'tags'}`}
                  )
                </span>
              )}
            </div>
            {(selectedCategory !== 'all' || selectedDifficulty !== 'all' || searchQuery.trim() || selectedTags.length > 0) && (
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedCategory('all');
                  setSelectedDifficulty('all');
                  setSelectedTags([]);
                }}
                className="text-primary-600 dark:text-primary-400 hover:underline text-sm"
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

