'use client';

import { useState, useEffect } from 'react';
import { Heart, Share2, Download, Copy, Check } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { isFavorite, toggleFavorite, FavoriteImage } from '@/lib/favorites';
import { toastManager } from './Toast';

interface ImageActionsProps {
  imageId: string;
  imageUrl: string;
  prompt?: string;
  onDownload?: () => void;
  className?: string;
}

export default function ImageActions({
  imageId,
  imageUrl,
  prompt,
  onDownload,
  className = ''
}: ImageActionsProps) {
  const { language } = useLanguage();
  const [favorited, setFavorited] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    setFavorited(isFavorite(imageId));
  }, [imageId]);

  const handleFavorite = () => {
    const image: FavoriteImage = {
      id: imageId,
      url: imageUrl,
      prompt,
      timestamp: Date.now()
    };
    
    const newState = toggleFavorite(image);
    setFavorited(newState);
    
    if (newState) {
      toastManager.success(
        language === 'zh' ? '已添加到收藏' : 'Added to favorites',
        { duration: 2000 }
      );
    } else {
      toastManager.info(
        language === 'zh' ? '已取消收藏' : 'Removed from favorites',
        { duration: 2000 }
      );
    }
  };

  const handleShare = async () => {
    try {
      // 尝试使用 Web Share API
      if (navigator.share) {
        await navigator.share({
          title: language === 'zh' ? 'AI 生成的图片' : 'AI Generated Image',
          text: prompt || '',
          url: imageUrl
        });
        toastManager.success(
          language === 'zh' ? '分享成功' : 'Shared successfully',
          { duration: 2000 }
        );
      } else {
        // 回退到复制链接
        handleCopyLink();
      }
    } catch (error) {
      // 用户取消分享，不显示错误
      if ((error as Error).name !== 'AbortError') {
        handleCopyLink();
      }
    }
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(imageUrl);
      setCopied(true);
      toastManager.success(
        language === 'zh' ? '链接已复制到剪贴板' : 'Link copied to clipboard',
        { duration: 2000 }
      );
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      toastManager.error(
        language === 'zh' ? '复制失败' : 'Copy failed',
        { duration: 2000 }
      );
    }
  };

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      {/* 收藏按钮 */}
      <button
        onClick={handleFavorite}
        className={`
          p-2 rounded-lg transition-all duration-200
          ${favorited
            ? 'bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/30'
            : 'bg-dark-100 dark:bg-dark-800 text-dark-600 dark:text-dark-400 hover:bg-dark-200 dark:hover:bg-dark-700'
          }
        `}
        title={favorited 
          ? (language === 'zh' ? '取消收藏' : 'Remove from favorites')
          : (language === 'zh' ? '添加到收藏' : 'Add to favorites')
        }
      >
        <Heart className={`w-4 h-4 ${favorited ? 'fill-current' : ''}`} />
      </button>

      {/* 分享按钮 */}
      <button
        onClick={handleShare}
        className="p-2 rounded-lg bg-dark-100 dark:bg-dark-800 text-dark-600 dark:text-dark-400 hover:bg-dark-200 dark:hover:bg-dark-700 transition-all duration-200"
        title={language === 'zh' ? '分享' : 'Share'}
      >
        <Share2 className="w-4 h-4" />
      </button>

      {/* 复制链接按钮 */}
      <button
        onClick={handleCopyLink}
        className={`
          p-2 rounded-lg transition-all duration-200
          ${copied
            ? 'bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400'
            : 'bg-dark-100 dark:bg-dark-800 text-dark-600 dark:text-dark-400 hover:bg-dark-200 dark:hover:bg-dark-700'
          }
        `}
        title={language === 'zh' ? '复制链接' : 'Copy link'}
      >
        {copied ? (
          <Check className="w-4 h-4" />
        ) : (
          <Copy className="w-4 h-4" />
        )}
      </button>

      {/* 下载按钮 */}
      {onDownload && (
        <button
          onClick={onDownload}
          className="p-2 rounded-lg bg-dark-100 dark:bg-dark-800 text-dark-600 dark:text-dark-400 hover:bg-dark-200 dark:hover:bg-dark-700 transition-all duration-200"
          title={language === 'zh' ? '下载' : 'Download'}
        >
          <Download className="w-4 h-4" />
        </button>
      )}
    </div>
  );
}

