'use client';

import { useState, useRef } from 'react';
import WorkspaceLayout from '@/components/WorkspaceLayout';

export default function ToolsPage() {
  const [referenceImages, setReferenceImages] = useState<string[]>(['', '', '']);
  const [fusionPrompt, setFusionPrompt] = useState('');
  const [fusedImage, setFusedImage] = useState<string | null>(null);
  const [isFusing, setIsFusing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);
  
  const fileInputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const newImages = [...referenceImages];
        newImages[index] = e.target?.result as string;
        setReferenceImages(newImages);
        setProgress(25);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = (index: number) => {
    const newImages = [...referenceImages];
    newImages[index] = '';
    setReferenceImages(newImages);
  };

  const addImageSlot = () => {
    if (referenceImages.length < 6) {
      setReferenceImages([...referenceImages, '']);
    }
  };

  const handleFusion = async () => {
    const validImages = referenceImages.filter(img => img);
    
    if (validImages.length < 2) {
      setError('至少需要上传2张参考图片');
      return;
    }

    if (!fusionPrompt.trim()) {
      setError('请描述你想要的融合效果');
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

    setIsFusing(true);
    setError(null);
    setProgress(50);

    try {
      const response = await fetch('/api/fusion', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          images: validImages.map(img => img.split(',')[1]),
          prompt: fusionPrompt.trim(),
          imageCount: validImages.length,
          apiKey,
          baseUrl,
          model
        })
      });

      const data = await response.json();

      if (!response.ok) throw new Error(data.error || '融合失败');

      if (data.imageUrl) {
        setFusedImage(data.imageUrl);
        setProgress(100);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : '融合失败');
      setProgress(0);
    } finally {
      setIsFusing(false);
    }
  };

  const handleDownload = async (imageUrl: string) => {
    try {
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `fusion-${Date.now()}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      window.open(imageUrl, '_blank');
    }
  };

  const uploadedCount = referenceImages.filter(img => img).length;

  return (
    <WorkspaceLayout>
      <div className="min-h-screen p-6">
        {/* 页面标题 */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold mb-2" style={{ color: 'var(--text-primary)' }}>🎨 创意工坊</h1>
          <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
            上传多张参考图片，AI 将融合它们的特征生成全新的创意作品
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-6 items-start">
          {/* 左列 - 参考图片上传 */}
          <div className="space-y-4 flex flex-col" style={{ minHeight: '800px' }}>
            <div className="glass-card p-4">
              <div className="flex items-center justify-between mb-3">
                <label className="block font-semibold" style={{ color: 'var(--text-primary)' }}>
                  📸 参考图片
                </label>
                <span className="text-xs px-2 py-1 rounded" style={{
                  background: uploadedCount >= 2 ? 'rgba(34, 197, 94, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                  color: uploadedCount >= 2 ? '#22c55e' : '#ef4444'
                }}>
                  {uploadedCount}/6
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3">
                {referenceImages.slice(0, 4).map((img, idx) => (
                  <div key={idx} className="aspect-square">
                    <input
                      ref={(el) => { fileInputRefs.current[idx] = el; }}
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleImageUpload(e, idx)}
                      className="hidden"
                    />
                    {img ? (
                      <div className="relative w-full h-full group">
                        <img
                          src={img}
                          alt={`参考图${idx + 1}`}
                          className="w-full h-full object-cover rounded-lg"
                        />
                      <button
                          onClick={() => removeImage(idx)}
                          className="absolute top-2 right-2 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center text-white text-sm opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          ×
                      </button>
                        <div className="absolute bottom-2 left-2 px-2 py-0.5 bg-black/70 rounded text-white text-xs">
                          图{idx + 1}
                        </div>
                      </div>
                    ) : (
                      <button
                        onClick={() => fileInputRefs.current[idx]?.click()}
                        className="w-full h-full border-2 border-dashed rounded-lg hover:border-purple-500 transition-colors flex items-center justify-center"
                        style={{ borderColor: 'var(--border-medium)' }}
                      >
                        <div className="text-center">
                          <span className="text-2xl">🖼️</span>
                          <p className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>
                            图{idx + 1}
                          </p>
                        </div>
                      </button>
                    )}
                  </div>
                ))}
                    </div>
                    
              {referenceImages.length < 6 && (
                <button
                  onClick={addImageSlot}
                  className="w-full mt-3 btn-secondary py-2 text-sm"
                >
                  ➕ 添加更多图片 ({referenceImages.length}/6)
                </button>
                )}
              </div>

            {/* 使用提示 - 简化 */}
            <div className="glass-card p-4">
              <h3 className="text-sm font-semibold mb-3" style={{ color: 'var(--text-primary)' }}>
                💡 使用说明
              </h3>
              <div className="text-xs space-y-2" style={{ color: 'var(--text-secondary)' }}>
                <p>• 至少上传 2 张参考图片</p>
                <p>• 最多支持 6 张图片</p>
                <p>• AI 会分析所有图片的特征</p>
                <p>• 生成融合所有特点的新作品</p>
              </div>
            </div>

            {/* 占位区域 - 保持和其他列等高 */}
            <div className="flex-1"></div>
              </div>
              
          {/* 中列 - 融合控制 */}
          <div className="space-y-4 flex flex-col" style={{ minHeight: '800px' }}>
            {/* 融合描述 */}
            <div className="glass-card p-4">
              <label className="block font-semibold mb-3" style={{ color: 'var(--text-primary)' }}>
                ✍️ 融合描述
              </label>
                <textarea
                value={fusionPrompt}
                onChange={(e) => setFusionPrompt(e.target.value)}
                onKeyDown={(e) => {
                  if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
                    e.preventDefault();
                    const validImages = referenceImages.filter(img => img);
                    if (validImages.length >= 2 && fusionPrompt.trim() && !isFusing) {
                      handleFusion();
                    }
                  }
                }}
                placeholder="描述你想要的融合效果...（Ctrl+Enter快速生成）"
                className="textarea-glass h-32"
                maxLength={300}
              />
              <div className="text-right text-xs mt-2" style={{ color: 'var(--text-muted)' }}>
                {fusionPrompt.length}/300
              </div>
                </div>
                
            {/* 创意示例 - 扩展内容 */}
            <div className="glass-card p-4 flex-1 flex flex-col">
              <h3 className="text-sm font-semibold mb-3" style={{ color: 'var(--text-primary)' }}>
                💡 创意示例
              </h3>
              <div className="space-y-2 flex-1">
                <button
                  onClick={() => setFusionPrompt('融合这些图片的艺术风格和色彩，创造一幅梦幻般的超现实主义作品')}
                  className="w-full text-left p-3 rounded-lg hover:bg-purple-500/10 text-sm transition-colors"
                  style={{ color: 'var(--text-secondary)', background: 'var(--bg-tertiary)' }}
                >
                  🌈 超现实风格融合
                </button>
                <button
                  onClick={() => setFusionPrompt('提取所有图片的主要元素，创作一张赛博朋克风格的城市景观')}
                  className="w-full text-left p-3 rounded-lg hover:bg-purple-500/10 text-sm transition-colors"
                  style={{ color: 'var(--text-secondary)', background: 'var(--bg-tertiary)' }}
                >
                  🌃 赛博朋克风格
                </button>
                <button
                  onClick={() => setFusionPrompt('将这些图片融合成一幅水彩画风格的艺术作品，色彩柔和温暖')}
                  className="w-full text-left p-3 rounded-lg hover:bg-purple-500/10 text-sm transition-colors"
                  style={{ color: 'var(--text-secondary)', background: 'var(--bg-tertiary)' }}
                >
                  🎨 水彩画风格
                </button>
                <button
                  onClick={() => setFusionPrompt('以印象派风格融合这些图片，色彩明亮鲜艳，笔触大胆')}
                  className="w-full text-left p-3 rounded-lg hover:bg-purple-500/10 text-sm transition-colors"
                  style={{ color: 'var(--text-secondary)', background: 'var(--bg-tertiary)' }}
                >
                  🖌️ 印象派风格
                </button>
                <button
                  onClick={() => setFusionPrompt('创作一张抽象艺术作品，提取图片的色彩和形状，几何化构图')}
                  className="w-full text-left p-3 rounded-lg hover:bg-purple-500/10 text-sm transition-colors"
                  style={{ color: 'var(--text-secondary)', background: 'var(--bg-tertiary)' }}
                >
                  🎭 抽象艺术
                </button>
              </div>

              <div className="mt-4 pt-4 border-t" style={{ borderColor: 'var(--border-subtle)' }}>
                <p className="text-xs text-center" style={{ color: 'var(--text-muted)' }}>
                  💡 点击示例快速填充融合描述
                </p>
              </div>
            </div>

            {/* 融合按钮 */}
              <button
                onClick={handleFusion}
              disabled={uploadedCount < 2 || !fusionPrompt.trim() || isFusing}
              className="w-full btn-gradient py-4"
            >
              {isFusing ? (
                <span className="flex items-center justify-center">
                  <div className="loading-spinner mr-3" />
                  AI 正在融合创作...
                </span>
              ) : (
                '🎨 开始融合生成'
              )}
              </button>
              
            {error && (
              <div className="glass-card p-4 border-2 border-red-500/50">
                <p className="text-red-500 text-sm">⚠️ {error}</p>
              </div>
            )}
          </div>

          {/* 右列 - 融合结果 */}
          <div className="flex flex-col" style={{ minHeight: '800px' }}>
            <div className="glass-card p-4 flex-1 flex flex-col">
              {/* 进度条 */}
              {progress > 0 && (
                <div className="mb-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-semibold" style={{ color: 'var(--text-primary)' }}>
                      融合进度
                    </span>
                    <span className="text-xs font-mono" style={{ color: 'var(--text-secondary)' }}>
                      {progress}%
              </span>
            </div>
                  <div className="w-full h-2 rounded-full overflow-hidden" style={{ background: 'var(--bg-tertiary)' }}>
                    <div 
                      className="h-full bg-gradient-primary transition-all duration-300"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                  <div className="flex justify-between text-xs mt-2" style={{ color: 'var(--text-muted)' }}>
                    <span>📤 上传</span>
                    <span>🎨 融合</span>
                    <span>✅ 完成</span>
                  </div>
                </div>
              )}

              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
                  ✨ 融合结果
                </span>
                {fusedImage && (
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleDownload(fusedImage)}
                      className="btn-gradient px-3 py-1 text-xs"
                    >
                      💾 下载
                    </button>
              <button
                      onClick={() => {
                        sessionStorage.setItem('edit-image', fusedImage);
                        window.location.href = '/edit';
                      }}
                      className="btn-secondary px-3 py-1 text-xs"
                    >
                      ✨ 编辑
              </button>
                  </div>
                )}
              </div>
              
              <div className="flex-1 flex flex-col">
                {fusedImage ? (
                  <div className="rounded-xl overflow-hidden flex-1 flex items-center justify-center" style={{ background: 'var(--bg-tertiary)' }}>
                    <img
                      src={fusedImage}
                      alt="融合结果"
                      className="w-full h-auto max-h-full object-contain"
                    />
                  </div>
                ) : (
                  <div className="flex items-center justify-center flex-1 rounded-xl border-2 border-dashed" style={{ borderColor: 'var(--border-subtle)', minHeight: '400px' }}>
                    <div className="text-center">
                      <span className="text-6xl mb-4 block">🎨</span>
                      <h3 className="text-lg font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>
                        融合结果将在这里显示
                      </h3>
                      <p className="text-xs max-w-xs mx-auto" style={{ color: 'var(--text-secondary)' }}>
                        上传 2-6 张参考图片，输入融合描述，AI 将生成全新的融合创作
                      </p>
                      </div>
                  </div>
                )}
              </div>

              {fusedImage && (
                <button
                  onClick={() => {
                    setFusedImage(null);
                    setProgress(0);
                  }}
                  className="mt-4 w-full btn-secondary py-2 text-sm"
                >
                  🔄 重新生成
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </WorkspaceLayout>
  );
}
