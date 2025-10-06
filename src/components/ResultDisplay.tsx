'use client';

import { useState } from 'react';

interface ResultDisplayProps {
  imageUrl: string | null;
  isGenerating: boolean;
}

export default function ResultDisplay({ imageUrl, isGenerating }: ResultDisplayProps) {
  const [isImageLoading, setIsImageLoading] = useState(false);

  const handleDownload = async () => {
    if (!imageUrl) return;

    try {
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      
      const link = document.createElement('a');
      link.href = url;
      link.download = `imagine-engine-${Date.now()}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('下载失败:', error);
      alert('下载失败，请重试');
    }
  };

  if (isGenerating) {
    return (
      <div className="flex flex-col items-center justify-center h-96 space-y-4">
        <div className="loading-spinner w-12 h-12"></div>
        <div className="text-center">
          <p className="text-lg font-medium text-gray-700">AI正在创作中...</p>
          <p className="text-sm text-gray-500 mt-1">这可能需要几秒钟时间</p>
        </div>
        
        {/* 创作过程动画 */}
        <div className="flex space-x-1">
          {[...Array(3)].map((_, i) => (
            <div
              key={i}
              className="w-2 h-2 bg-primary-600 rounded-full animate-pulse"
              style={{ animationDelay: `${i * 0.2}s` }}
            ></div>
          ))}
        </div>
      </div>
    );
  }

  if (!imageUrl) {
    return (
      <div className="flex flex-col items-center justify-center h-96 text-gray-500">
        <div className="text-6xl mb-4">🎨</div>
        <p className="text-lg font-medium">等待你的创意...</p>
        <p className="text-sm mt-2">输入提示词，开始AI创作之旅</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* 图片展示 */}
      <div className="image-container aspect-square">
        {isImageLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
            <div className="loading-spinner"></div>
          </div>
        )}
        <img
          src={imageUrl}
          alt="AI生成的图片"
          className="w-full h-full object-cover"
          onLoad={() => setIsImageLoading(false)}
          onLoadStart={() => setIsImageLoading(true)}
          onError={() => {
            setIsImageLoading(false);
            console.error('图片加载失败');
          }}
        />
      </div>

      {/* 操作按钮 */}
      <div className="flex space-x-3">
        <button
          onClick={handleDownload}
          className="btn-primary flex-1 flex items-center justify-center space-x-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <span>下载图片</span>
        </button>
        
        <button
          onClick={() => window.open(imageUrl, '_blank')}
          className="btn-secondary flex items-center justify-center space-x-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
          </svg>
          <span>新窗口查看</span>
        </button>
      </div>

      {/* 图片信息 */}
      <div className="text-xs text-gray-500 space-y-1">
        <p>💡 提示：点击历史记录可以重新查看之前的作品</p>
        <p>🔄 想要不同效果？尝试调整提示词或更换风格</p>
      </div>
    </div>
  );
}