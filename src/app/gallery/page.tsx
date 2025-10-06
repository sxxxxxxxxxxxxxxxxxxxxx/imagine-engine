'use client';

import { useState } from 'react';
import WorkspaceLayout from '@/components/WorkspaceLayout';
import Link from 'next/link';
import { fullGalleryCases as galleryCases, type GalleryCase } from '@/data/fullGalleryData';

export default function GalleryPage() {
  const [selectedCategory, setSelectedCategory] = useState('全部');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDifficulty, setSelectedDifficulty] = useState('全部');
  const [lightboxImage, setLightboxImage] = useState<{input: string; output: string; title: string; prompt: string} | null>(null);

  const categories = ['全部', '风格转换', '创意编辑', '创意生成', '专业应用', '特效合成'];
  const difficulties = ['全部', 'easy', 'medium', 'hard'];
  const difficultyLabels = { easy: '简单', medium: '中等', hard: '高级' };

  const filteredCases = galleryCases.filter(item => {
    const matchesCategory = selectedCategory === '全部' || item.category === selectedCategory;
    const matchesSearch = 
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.prompt.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesDifficulty = selectedDifficulty === '全部' || item.difficulty === selectedDifficulty;
    return matchesCategory && matchesSearch && matchesDifficulty;
  });

  const copyPrompt = (prompt: string) => {
    navigator.clipboard.writeText(prompt);
    alert('提示词已复制到剪贴板！');
  };

  return (
    <WorkspaceLayout>
      <div className="min-h-screen p-8">
        {/* 页面标题 */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-4xl font-bold mb-2" style={{ 
                fontFamily: 'Orbitron, sans-serif',
                color: 'var(--text-primary)' 
              }}>
                🎨 创意画廊
              </h1>
              <p className="text-lg" style={{ color: 'var(--text-secondary)' }}>
                {galleryCases.length}+ 精选案例 · GitHub Awesome-Nano-Banana (14k⭐)
              </p>
            </div>
            <Link href="/create" className="btn-gradient px-6 py-3">
              ✨ 开始创作
            </Link>
          </div>
        </div>

        {/* 筛选和搜索 */}
        <div className="glass-card p-6 mb-6">
          {/* 搜索框 */}
          <div className="mb-4">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="🔍 搜索案例、提示词、作者..."
              className="input-glass w-full"
            />
          </div>

          {/* 分类标签 */}
          <div className="mb-4">
            <div className="flex items-center mb-2">
              <span className="text-sm font-semibold mr-3" style={{ color: 'var(--text-primary)' }}>
                📂 分类：
              </span>
              <div className="flex gap-2 flex-wrap">
                {categories.map((category) => (
                  <button
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                      selectedCategory === category
                        ? 'bg-gradient-primary text-white shadow-lg'
                        : 'btn-secondary'
                    }`}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* 难度筛选 */}
          <div>
            <div className="flex items-center">
              <span className="text-sm font-semibold mr-3" style={{ color: 'var(--text-primary)' }}>
                🎯 难度：
              </span>
              <div className="flex gap-2">
                {difficulties.map((diff) => (
                  <button
                    key={diff}
                    onClick={() => setSelectedDifficulty(diff)}
                    className={`px-3 py-1 rounded-lg text-xs font-medium transition-all ${
                      selectedDifficulty === diff
                        ? 'bg-gradient-primary text-white'
                        : 'btn-secondary'
                    }`}
                  >
                    {diff === '全部' ? '全部' : difficultyLabels[diff as keyof typeof difficultyLabels]}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* 统计信息 */}
          <div className="mt-4 pt-4 border-t" style={{ borderColor: 'var(--border-subtle)' }}>
            <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
              📊 共找到 <span className="font-bold text-purple-600">{filteredCases.length}</span> 个精选案例
            </p>
          </div>
        </div>

        {/* 案例网格 */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCases.map((item) => (
            <div key={item.id} className="glass-card p-0 overflow-hidden hover:scale-[1.02] transition-all">
              {/* 对比图片 */}
              {/* 输入输出标签 - 在图片外部 */}
              <div className="grid grid-cols-2 gap-1 px-3 pt-3 pb-2">
                <div className="text-xs font-medium text-center px-2 py-1 rounded" style={{
                  background: 'rgba(147, 51, 234, 0.1)',
                  color: '#9333ea'
                }}>
                  📥 输入
                </div>
                <div className="text-xs font-medium text-center px-2 py-1 rounded" style={{
                  background: 'rgba(236, 72, 153, 0.1)',
                  color: '#ec4899'
                }}>
                  📤 输出
                </div>
              </div>

              {/* 对比图片 - 无标签遮挡 */}
              <div 
                className="grid grid-cols-2 gap-1 px-3 cursor-pointer"
                onClick={() => setLightboxImage({
                  input: item.inputImage,
                  output: item.outputImage,
                  title: item.title,
                  prompt: item.prompt
                })}
              >
                <div className="relative group overflow-hidden rounded-lg">
                  <img
                    src={item.inputImage}
                    alt="输入"
                    className="w-full aspect-square object-cover transition-transform group-hover:scale-105"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="400"%3E%3Crect fill="%23f0f0f0" width="400" height="400"/%3E%3Ctext x="50%25" y="50%25" text-anchor="middle" dy=".3em" fill="%23999" font-size="20"%3E输入图%3C/text%3E%3C/svg%3E';
                    }}
                  />
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <span className="text-white text-sm font-semibold">🔍 查看大图</span>
                  </div>
                </div>
                <div className="relative group overflow-hidden rounded-lg">
                  <img
                    src={item.outputImage}
                    alt="输出"
                    className="w-full aspect-square object-cover transition-transform group-hover:scale-105"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="400"%3E%3Crect fill="%23f0f0f0" width="400" height="400"/%3E%3Ctext x="50%25" y="50%25" text-anchor="middle" dy=".3em" fill="%23999" font-size="20"%3E输出图%3C/text%3E%3C/svg%3E';
                    }}
                  />
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <span className="text-white text-sm font-semibold">🔍 查看大图</span>
                  </div>
                </div>
              </div>

              {/* 案例信息 */}
              <div className="p-4">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="font-bold flex-1" style={{ color: 'var(--text-primary)' }}>
                    {item.title}
                  </h3>
                  <span 
                    className={`text-xs px-2 py-0.5 rounded ml-2 flex-shrink-0 ${
                      item.difficulty === 'easy' ? 'bg-green-500/20 text-green-600' :
                      item.difficulty === 'medium' ? 'bg-yellow-500/20 text-yellow-600' :
                      'bg-red-500/20 text-red-600'
                    }`}
                  >
                    {difficultyLabels[item.difficulty]}
                  </span>
                </div>

                <div className="flex flex-wrap gap-2 mb-3">
                  <span className="text-xs px-2 py-0.5 rounded" style={{
                    background: 'var(--bg-tertiary)',
                    color: 'var(--text-secondary)'
                  }}>
                    {item.category}
                  </span>
                  <span className="text-xs px-2 py-0.5 rounded" style={{
                    background: 'var(--bg-tertiary)',
                    color: 'var(--text-secondary)'
                  }}>
                    {item.author}
                  </span>
                </div>

                <p className="text-sm mb-3 line-clamp-2" style={{ color: 'var(--text-secondary)' }}>
                  {item.description}
                </p>

                {/* 操作按钮 */}
                <div className="flex gap-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      copyPrompt(item.prompt);
                    }}
                    className="flex-1 btn-secondary py-2 text-xs"
                  >
                    📋 复制
                  </button>
                  <Link
                    href={`/create?prompt=${encodeURIComponent(item.prompt)}`}
                    className="flex-1 btn-gradient py-2 text-xs text-center flex items-center justify-center"
                    onClick={(e) => e.stopPropagation()}
                  >
                    🎨 使用
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* 空状态 */}
        {filteredCases.length === 0 && (
          <div className="text-center py-20">
            <span className="text-6xl">🔍</span>
            <h3 className="text-xl font-bold mt-4 mb-2" style={{ color: 'var(--text-primary)' }}>
              没有找到匹配的案例
            </h3>
            <p style={{ color: 'var(--text-secondary)' }}>
              试试其他关键词或分类
            </p>
          </div>
        )}

        {/* Lightbox 全屏查看 */}
        {lightboxImage && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            style={{ background: 'rgba(0, 0, 0, 0.95)' }}
            onClick={() => setLightboxImage(null)}
          >
            <div 
              className="max-w-7xl w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold text-white">{lightboxImage.title}</h3>
                <button
                  onClick={() => setLightboxImage(null)}
                  className="w-10 h-10 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center text-white text-2xl transition-colors"
                >
                  ×
                </button>
              </div>

              {/* 输入输出对比 */}
              <div className="grid md:grid-cols-2 gap-4 mb-6">
                <div>
                  <div className="text-sm font-semibold text-white mb-2 flex items-center gap-2">
                    <span className="px-2 py-1 bg-purple-600 rounded">输入</span>
                    原始图片
                  </div>
                  <img
                    src={lightboxImage.input}
                    alt="输入"
                    className="w-full rounded-xl shadow-2xl"
                  />
                </div>
                <div>
                  <div className="text-sm font-semibold text-white mb-2 flex items-center gap-2">
                    <span className="px-2 py-1 bg-pink-600 rounded">输出</span>
                    AI生成效果
                  </div>
                  <img
                    src={lightboxImage.output}
                    alt="输出"
                    className="w-full rounded-xl shadow-2xl"
                  />
                </div>
              </div>

              {/* 提示词 */}
              <div className="glass-card p-6">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-semibold text-white flex items-center gap-2">
                    💬 完整提示词
                  </h4>
                  <button
                    onClick={() => copyPrompt(lightboxImage.prompt)}
                    className="btn-gradient px-4 py-2 text-sm"
                  >
                    📋 复制提示词
                  </button>
                </div>
                <p className="text-white text-sm leading-relaxed bg-black/20 p-4 rounded-lg">
                  {lightboxImage.prompt}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </WorkspaceLayout>
  );
}