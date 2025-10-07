'use client';

import { useState, useRef, useEffect } from 'react';
import WorkspaceLayout from '@/components/WorkspaceLayout';
import { downloadWithOriginalResolution } from '@/lib/resolutionKeeper';
import PromptGallery from '@/components/PromptGallery';
import QuickPlayModes from '@/components/QuickPlayModes';
import PromptHints from '@/components/PromptHints';
import KeyboardShortcutsHelp from '@/components/KeyboardShortcutsHelp';
import { useKeyboardShortcuts } from '@/hooks/useKeyboardShortcuts';

export default function CreatePage() {
  const [prompt, setPrompt] = useState('');
  const [referenceImage, setReferenceImage] = useState<string | null>(null);
  const [selectedRatio, setSelectedRatio] = useState('1:1');
  const [selectedStyle, setSelectedStyle] = useState('original');
  const [batchCount, setBatchCount] = useState(1);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedImages, setGeneratedImages] = useState<Array<{ url: string; prompt: string; timestamp: number }>>([]);
  const [error, setError] = useState<string | null>(null);
  const [showPromptGallery, setShowPromptGallery] = useState(false);
  const [showQuickPlay, setShowQuickPlay] = useState(false);
  const [showPromptHints, setShowPromptHints] = useState(false);
  const [showKeyboardHelp, setShowKeyboardHelp] = useState(false);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const ratios = [
    { id: '1:1', label: '1:1', size: '1024×1024' },
    { id: '16:9', label: '16:9', size: '1920×1080' },
    { id: '9:16', label: '9:16', size: '1080×1920' },
    { id: '4:3', label: '4:3', size: '1024×768' },
    { id: '3:4', label: '3:4', size: '768×1024' },
  ];

  const styles = [
    { id: 'original', name: '保持原图', emoji: '🎯' },
    { id: 'realistic', name: '写实风格', emoji: '📸' },
    { id: 'anime', name: '动漫风格', emoji: '🎭' },
    { id: 'oil_painting', name: '油画风格', emoji: '🎨' },
    { id: 'watercolor', name: '水彩风格', emoji: '🌸' },
    { id: 'cyberpunk', name: '赛博朋克', emoji: '🌃' },
    { id: 'minimalist', name: '极简风格', emoji: '⚪' },
  ];

  const handleReferenceUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => setReferenceImage(e.target?.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      setError('请输入创作描述');
      return;
    }

    // 获取用户配置
    const apiKey = localStorage.getItem('imagine-engine-api-key') || '';
    const baseUrl = localStorage.getItem('imagine-engine-base-url') || 'https://newapi.aicohere.org/v1/chat/completions';
    const model = localStorage.getItem('imagine-engine-model') || 'gemini-2.5-flash-image-preview';

    if (!apiKey) {
      setError('请先在设置中配置API密钥（点击左侧导航栏"⚙️ 设置"按钮）');
      return;
    }

    setIsGenerating(true);
    setError(null);

    try {
      // 批量生成
      const promises = [];
      for (let i = 0; i < batchCount; i++) {
        promises.push(
          fetch('/api/generate', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              prompt: prompt.trim(),
              style: selectedStyle,
              aspectRatio: selectedRatio,
              referenceImage,
              apiKey,
              baseUrl,
              model
            })
          }).then(res => res.json())
        );
      }

      const results = await Promise.all(promises);
      const newImages = results
        .filter(data => data.imageUrl)
        .map(data => ({ 
          url: data.imageUrl, 
          prompt, 
          timestamp: Date.now() 
        }));
      
      if (newImages.length > 0) {
        setGeneratedImages(prev => [...newImages, ...prev]);
      } else {
        throw new Error('未能生成图片');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : '生成失败');
    } finally {
      setIsGenerating(false);
    }
  };

  // 集成键盘快捷键（放在函数定义之后）
  useKeyboardShortcuts({
    onGenerate: handleGenerate,
    onTogglePromptGallery: () => setShowPromptGallery(prev => !prev),
    isGenerating
  });

  // 首次访问时显示快捷键帮助（仅一次）
  useEffect(() => {
    const hasSeenHelp = localStorage.getItem('hasSeenKeyboardHelp');
    if (!hasSeenHelp) {
      setTimeout(() => {
        setShowKeyboardHelp(true);
        localStorage.setItem('hasSeenKeyboardHelp', 'true');
      }, 2000);
    }
  }, []);

  return (
    <WorkspaceLayout>
      <div className="min-h-screen p-6 max-w-[1800px] mx-auto">
        {/* 页面标题 */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold mb-2" style={{ color: 'var(--text-primary)' }}>✨ AI 创作</h1>
          <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>输入描述，让AI为你创造独特作品</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-6 items-start">
          {/* 左侧 - 提示词输入区 */}
          <div className="space-y-4 flex flex-col">
            {/* 文本输入 */}
            <div className="glass-card p-4">
              <div className="flex items-center justify-between mb-3">
                <label className="block font-semibold" style={{ color: 'var(--text-primary)' }}>
                  创作描述
                </label>
                <div className="flex gap-2">
                  <button
                    onClick={() => setShowPromptHints(true)}
                    className="text-xs px-3 py-1 rounded-lg btn-secondary"
                    title="提示词质量提升 (P)"
                  >
                    💡 提示
                  </button>
                  <button
                    onClick={() => setShowPromptGallery(true)}
                    className="text-xs px-3 py-1 rounded-lg btn-secondary"
                    title="打开提示词画廊 (P)"
                  >
                    🎨 画廊
                  </button>
                  <button
                    onClick={() => setShowQuickPlay(!showQuickPlay)}
                    className="text-xs px-3 py-1 rounded-lg btn-gradient"
                    title="一键玩法"
                  >
                    ⚡ 一键玩法
                  </button>
                  <button
                    onClick={() => setShowKeyboardHelp(true)}
                    className="text-xs px-3 py-1 rounded-lg btn-secondary"
                    title="键盘快捷键 (?)"
                  >
                    ⌨️
                  </button>
                </div>
              </div>
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                onKeyDown={(e) => {
                  if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
                    e.preventDefault();
                    if (prompt.trim() && !isGenerating) {
                      handleGenerate();
                    }
                  }
                }}
                placeholder="描述你想要创作的画面，或点击'画廊'/'一键玩法'快速开始...（Ctrl+Enter快速生成）"
                className="textarea-glass h-32"
                maxLength={500}
              />
              <div className="text-right text-xs mt-2" style={{ color: 'var(--text-muted)' }}>
                {prompt.length}/500
              </div>
            </div>

            {/* 一键玩法展开区域 */}
            {showQuickPlay && (
              <div className="glass-card p-6">
                <QuickPlayModes onSelectMode={(mode) => {
                  setPrompt(mode.prompt);
                  setShowQuickPlay(false);
                }} />
              </div>
            )}

            {/* 参考图上传 */}
            <div className="glass-card p-4">
              <label className="block font-semibold mb-3" style={{ color: 'var(--text-primary)' }}>参考图（可选）</label>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleReferenceUpload}
                className="hidden"
              />
              {referenceImage ? (
                <div className="relative">
                  <img src={referenceImage} alt="参考图" className="w-full rounded-lg" />
                  <button
                    onClick={() => setReferenceImage(null)}
                    className="absolute top-2 right-2 w-8 h-8 bg-red-500/80 rounded-full flex items-center justify-center text-white hover:bg-red-600"
                  >
                    ×
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full p-6 border-2 border-dashed rounded-xl hover:border-purple-500 transition-colors"
                  style={{ borderColor: 'var(--border-medium)' }}
                >
                  <div className="text-center">
                    <span className="text-3xl">📎</span>
                    <p className="text-sm mt-2" style={{ color: 'var(--text-secondary)' }}>点击上传参考图</p>
                  </div>
                </button>
              )}
            </div>

            {/* 比例控制 */}
            <div className="glass-card p-4">
              <label className="block font-semibold mb-3" style={{ color: 'var(--text-primary)' }}>图片比例</label>
              <div className="grid grid-cols-2 gap-2">
                {ratios.map((ratio) => (
                  <button
                    key={ratio.id}
                    onClick={() => setSelectedRatio(ratio.id)}
                    className={`ratio-btn ${selectedRatio === ratio.id ? 'active' : ''}`}
                  >
                    <div className="text-sm font-bold">{ratio.label}</div>
                    <div className="text-xs text-gray-400">{ratio.size}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* 批量生成控制 */}
            <div className="glass-card p-4">
              <div className="flex items-center justify-between mb-3">
                <label className="block font-semibold" style={{ color: 'var(--text-primary)' }}>
                  批量生成
                </label>
                <button
                  onClick={() => setShowAdvanced(!showAdvanced)}
                  className="text-xs px-2 py-1 rounded-md hover:bg-gray-100 transition-colors"
                  style={{ color: 'var(--text-secondary)' }}
                >
                  {showAdvanced ? '收起 ▲' : '展开 ▼'}
                </button>
              </div>
              
              <div className="flex items-center gap-3">
                {[1, 2, 4].map((count) => (
                  <button
                    key={count}
                    onClick={() => setBatchCount(count)}
                    className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-all ${
                      batchCount === count
                        ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-md'
                        : 'bg-gray-100 hover:bg-gray-200'
                    }`}
                    style={batchCount !== count ? { color: 'var(--text-secondary)' } : {}}
                  >
                    {count}张
                  </button>
                ))}
              </div>
              
              {showAdvanced && (
                <div className="mt-3 p-3 rounded-lg" style={{ backgroundColor: 'var(--bg-secondary)' }}>
                  <p className="text-xs mb-2" style={{ color: 'var(--text-secondary)' }}>
                    💡 批量生成可同时创建多张变体
                  </p>
                  <div className="flex items-center gap-2">
                    <input
                      type="range"
                      min="1"
                      max="4"
                      value={batchCount}
                      onChange={(e) => setBatchCount(Number(e.target.value))}
                      className="flex-1"
                    />
                    <span className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>
                      {batchCount}
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* 生成按钮 */}
            <button
              onClick={handleGenerate}
              disabled={!prompt.trim() || isGenerating}
              className="w-full btn-gradient py-4"
            >
              {isGenerating ? (
                <span className="flex items-center justify-center">
                  <div className="loading-spinner mr-3" />
                  AI 正在创作第 {batchCount} 张...
                </span>
              ) : (
                `🎨 开始创作${batchCount > 1 ? ` (${batchCount}张)` : ''}`
              )}
            </button>

            {error && (
              <div className="glass-card p-4 border-2 border-red-500/50">
                <p className="text-red-400 text-sm">⚠️ {error}</p>
              </div>
            )}
          </div>

          {/* 中间 - 艺术风格 */}
          <div className="flex flex-col h-full">
            {/* 艺术风格 - 占满整列 */}
            <div className="glass-card p-4 flex-1 flex flex-col">
              <label className="block font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>🎨 艺术风格</label>
              <div className="space-y-3.5 flex-1 flex flex-col justify-between">
                {styles.map((style) => (
                  <button
                    key={style.id}
                    onClick={() => setSelectedStyle(style.id)}
                    className={`w-full p-4 rounded-lg border-2 transition-all ${
                      selectedStyle === style.id 
                        ? 'border-purple-500 bg-purple-500/10 shadow-md' 
                        : 'border-transparent hover:border-purple-500/30'
                    }`}
                    style={{ background: selectedStyle === style.id ? undefined : 'var(--bg-tertiary)' }}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{style.emoji}</span>
                      <div className="text-left flex-1">
                        <div className="font-semibold text-sm mb-1" style={{ color: 'var(--text-primary)' }}>{style.name}</div>
                        {style.id === 'original' ? (
                          <div className="text-xs" style={{ color: 'var(--text-secondary)' }}>默认选项，AI自动判断</div>
                        ) : (
                          <div className="text-xs" style={{ color: 'var(--text-muted)' }}>点击切换风格</div>
                        )}
                      </div>
                      {selectedStyle === style.id && (
                        <div className="w-5 h-5 bg-purple-500 rounded-full flex items-center justify-center flex-shrink-0 shadow-sm">
                          <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        </div>
                      )}
                    </div>
                  </button>
                ))}

                {/* Nano Banana 技术卡片 - 填充底部 */}
                <div className="p-4 rounded-xl bg-gradient-to-br from-yellow-50 via-orange-50 to-pink-50 border-2 border-yellow-300/50">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-2xl">🍌</span>
                    <span className="text-sm font-bold bg-gradient-to-r from-orange-600 to-pink-600 bg-clip-text text-transparent">
                      Nano Banana AI
                    </span>
                  </div>
                  <p className="text-xs leading-relaxed mb-2" style={{ color: 'var(--text-secondary)' }}>
                    Google Gemini 2.5 Flash 顶级图像生成技术
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-purple-100 text-purple-700 font-medium">
                      角色一致性
                    </span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-blue-100 text-blue-700 font-medium">
                      批量生成
                    </span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-green-100 text-green-700 font-medium">
                      场景融合
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 右侧结果展示 */}
          <div className="h-full">
            <div className="glass-card p-6 h-full flex flex-col">
              <h2 className="text-xl font-bold mb-6" style={{ color: 'var(--text-primary)' }}>创作作品集</h2>

              {generatedImages.length === 0 && !isGenerating ? (
                <div className="flex flex-col items-center justify-center flex-1">
                  <div className="w-24 h-24 bg-gradient-secondary rounded-3xl flex items-center justify-center mb-6">
                    <span className="text-5xl">🎨</span>
                  </div>
                  <h3 className="text-xl font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>开始你的创作之旅</h3>
                  <p className="text-center max-w-md" style={{ color: 'var(--text-secondary)' }}>
                    输入您的创意描述，选择喜欢的风格和比例，让 AI 为您创造独一无二的艺术作品
                  </p>
                </div>
              ) : (
                <div className="space-y-4 flex-1">
                  {/* 操作栏 */}
                  <div className="flex items-center gap-2 pb-3 border-b" style={{ borderColor: 'var(--border-subtle)' }}>
                    <span className="text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>
                      共 {generatedImages.length} 张作品
                    </span>
                    {generatedImages.length > 0 && (
                      <button
                        onClick={() => setGeneratedImages([])}
                        className="ml-auto text-xs px-3 py-1 rounded-md hover:bg-red-50 text-red-600 transition-colors"
                      >
                        🗑️ 清空
                      </button>
                    )}
                  </div>

                  {/* 图片网格 */}
                  <div className="grid grid-cols-2 gap-3 flex-1 content-start overflow-y-auto" style={{ maxHeight: 'calc(100vh - 300px)' }}>
                    {isGenerating && (
                      <div className="aspect-square bg-gradient-secondary rounded-xl flex items-center justify-center border-2 border-dashed border-purple-500/50 animate-pulse">
                        <div className="text-center">
                          <div className="loading-spinner mx-auto mb-3" />
                          <p className="text-sm font-medium" style={{ color: 'var(--accent-purple)' }}>
                            AI 正在创作...
                          </p>
                          <p className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>
                            {batchCount > 1 ? `批量生成 ${batchCount} 张` : '即将完成'}
                          </p>
                        </div>
                      </div>
                    )}

                    {generatedImages.map((item, idx) => (
                      <div key={`${item.timestamp}-${idx}`} className="group relative aspect-square rounded-xl overflow-hidden hover:ring-2 hover:ring-purple-500 transition-all shadow-md hover:shadow-xl" style={{ background: 'var(--bg-tertiary)' }}>
                        <img
                          src={item.url}
                          alt={item.prompt}
                          className="w-full h-full object-cover"
                          loading="lazy"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-200">
                          <div className="absolute bottom-0 left-0 right-0 p-3">
                            <p className="text-white text-sm line-clamp-2 mb-3">{item.prompt}</p>
                            <div className="flex gap-2">
                              <button 
                                onClick={async (e) => {
                                  e.stopPropagation();
                                  try {
                                    const response = await fetch(item.url);
                                    const blob = await response.blob();
                                    const url = window.URL.createObjectURL(blob);
                                    const link = document.createElement('a');
                                    link.href = url;
                                    link.download = `imagine-${Date.now()}.png`;
                                    document.body.appendChild(link);
                                    link.click();
                                    document.body.removeChild(link);
                                    window.URL.revokeObjectURL(url);
                                  } catch (error) {
                                    window.open(item.url, '_blank');
                                  }
                                }}
                                className="flex-1 btn-secondary py-2 text-sm"
                              >
                                💾 下载
                              </button>
                              <button 
                                onClick={(e) => {
                                  e.stopPropagation();
                                  sessionStorage.setItem('edit-image', item.url);
                                  window.location.href = '/edit';
                                }}
                                className="flex-1 btn-gradient py-2 text-sm"
                              >
                                ✨ 编辑
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* 提示词画廊模态框 */}
      <PromptGallery
        isVisible={showPromptGallery}
        onClose={() => setShowPromptGallery(false)}
        onSelectPrompt={(selectedPrompt) => {
          setPrompt(selectedPrompt);
        }}
      />

      {/* 提示词质量提示 */}
      <PromptHints
        isVisible={showPromptHints}
        onClose={() => setShowPromptHints(false)}
      />

      {/* 键盘快捷键帮助 */}
      <KeyboardShortcutsHelp
        isVisible={showKeyboardHelp}
        onClose={() => setShowKeyboardHelp(false)}
      />
    </WorkspaceLayout>
  );
}