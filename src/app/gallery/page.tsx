'use client';

import { useState, useEffect } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
// import { useVirtualizer } from '@tanstack/react-virtual'; // 暂时注释，等安装依赖
// import { db, getArtworks, deleteArtwork, type Artwork } from '@/lib/db'; // 暂时注释
import { Search, Grid3x3, List, Download, Trash2, Edit } from 'lucide-react';
import Link from 'next/link';

// 临时类型定义（等 db.ts 可用后移除）
interface Artwork {
  id?: number;
  prompt: string;
  model: string;
  aspectRatio: string;
  imageUrl: string;
  thumbnail?: string;
  timestamp: number;
}

export default function GalleryPage() {
  const [artworks, setArtworks] = useState<Artwork[]>([]);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterModel, setFilterModel] = useState('all');
  const [loading, setLoading] = useState(true);
  const { language } = useLanguage();

  // 加载作品（暂时从 localStorage 加载，等 IndexedDB 准备好后切换）
  useEffect(() => {
    loadArtworks();
  }, []);

  const loadArtworks = async () => {
    setLoading(true);
    try {
      // 暂时使用 localStorage（等 db.ts 可用后切换到 IndexedDB）
      const savedImages = localStorage.getItem('imagine-engine-generated-images');
      if (savedImages) {
        const images = JSON.parse(savedImages) as Array<{ url: string; prompt: string; timestamp: number }>;
        const convertedArtworks: Artwork[] = images.map((img, idx) => ({
          id: idx,
          prompt: img.prompt,
          model: 'unknown',
          aspectRatio: '1:1',
          imageUrl: img.url,
          timestamp: img.timestamp
        }));
        setArtworks(convertedArtworks);
      }
    } catch (error) {
      console.error('加载作品失败:', error);
    } finally {
      setLoading(false);
    }
  };

  // 筛选作品
  const filteredArtworks = artworks.filter(artwork => {
    const matchesSearch = artwork.prompt.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesModel = filterModel === 'all' || artwork.model === filterModel;
    return matchesSearch && matchesModel;
  });

  const handleDelete = (id: number) => {
    if (confirm(language === 'zh' ? '确定要删除这张作品吗？' : 'Delete this artwork?')) {
      setArtworks(prev => prev.filter(a => a.id !== id));
      // TODO: 同步删除到 IndexedDB
      // 同步更新 localStorage
      const updatedArtworks = artworks.filter(a => a.id !== id);
      const images = updatedArtworks.map(a => ({
        url: a.imageUrl,
        prompt: a.prompt,
        timestamp: a.timestamp
      }));
      localStorage.setItem('imagine-engine-generated-images', JSON.stringify(images));
    }
  };

  // 下载图片函数 - 多重策略确保下载成功
  const handleDownload = async (imageUrl: string, filename?: string) => {
    const downloadFilename = filename || `gallery-${Date.now()}.png`;
    
    console.log('🔽 开始下载图片:', imageUrl.substring(0, 100));
    
    // 策略1: 尝试no-cors模式的fetch
    try {
      const response = await fetch(imageUrl, {
        mode: 'no-cors',
        cache: 'no-cache'
      });
      throw new Error('no-cors mode, fallback to proxy');
    } catch (firstError) {
      console.log('⚠️ no-cors方式不可行，尝试服务端代理');
      
      // 策略2: 通过服务端代理下载（主要方案）
      try {
        const proxyResponse = await fetch(`/api/proxy-image?url=${encodeURIComponent(imageUrl)}`);
        
        if (!proxyResponse.ok) {
          throw new Error(`Proxy failed: ${proxyResponse.status}`);
        }
        
        const blob = await proxyResponse.blob();
        const blobUrl = URL.createObjectURL(blob);
        
        const link = document.createElement('a');
        link.href = blobUrl;
        link.download = downloadFilename;
        link.style.display = 'none';
        document.body.appendChild(link);
        
        setTimeout(() => {
          link.click();
          console.log('✅ 通过服务端代理下载成功');
          
          setTimeout(() => {
            document.body.removeChild(link);
            URL.revokeObjectURL(blobUrl);
          }, 100);
        }, 10);
        
        return;
        
      } catch (proxyError) {
        console.error('❌ 服务端代理失败:', proxyError);
        
        // 策略3: 尝试cors模式的fetch
        try {
          const corsResponse = await fetch(imageUrl, {
            mode: 'cors',
            credentials: 'omit',
            headers: {
              'Accept': 'image/*'
            }
          });
          
          if (!corsResponse.ok) throw new Error('CORS fetch failed');
          
          const blob = await corsResponse.blob();
          const blobUrl = URL.createObjectURL(blob);
          
          const link = document.createElement('a');
          link.href = blobUrl;
          link.download = downloadFilename;
          link.style.display = 'none';
          document.body.appendChild(link);
          
          setTimeout(() => {
            link.click();
            console.log('✅ 通过CORS直接下载成功');
            
            setTimeout(() => {
              document.body.removeChild(link);
              URL.revokeObjectURL(blobUrl);
            }, 100);
          }, 10);
          
          return;
          
        } catch (corsError) {
          console.error('❌ CORS直接下载失败:', corsError);
          
          // 策略4: 最终备用方案 - 新窗口打开
          console.log('⚠️ 所有下载方式失败，在新窗口打开图片');
          const newWindow = window.open(imageUrl, '_blank');
          
          if (newWindow) {
            alert(language === 'zh' 
              ? '⚠️ 自动下载失败，已在新窗口打开图片。请右键点击图片选择"图片另存为"' 
              : '⚠️ Auto-download failed. Image opened in new window. Please right-click and "Save image as"');
          } else {
            alert(language === 'zh' 
              ? '❌ 下载失败，请允许弹出窗口或手动复制图片链接' 
              : '❌ Download failed. Please allow pop-ups or copy image URL manually');
          }
        }
      }
    }
  };

  // 编辑图片
  const handleEdit = (imageUrl: string) => {
    sessionStorage.setItem('edit-image', imageUrl);
    window.location.href = '/edit';
  };

  const models = Array.from(new Set(artworks.map(a => a.model)));

  return (
    <div className="page-container">
      <div className="content-wrapper">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-dark-900 dark:text-dark-50 mb-2">
            {language === 'zh' ? '作品画廊' : 'Gallery'}
          </h1>
          <p className="text-dark-600 dark:text-dark-400">
            {language === 'zh' 
              ? `${filteredArtworks.length} 张作品 · 自动保存到本地` 
              : `${filteredArtworks.length} artworks · Auto-saved locally`}
          </p>
        </div>

        {/* Toolbar */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          {/* Search */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-dark-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={language === 'zh' ? '搜索提示词...' : 'Search prompts...'}
              className="input pl-10"
            />
          </div>

          {/* Filter by Model */}
          <select
            value={filterModel}
            onChange={(e) => setFilterModel(e.target.value)}
            className="select w-48"
          >
            <option value="all">{language === 'zh' ? '所有模型' : 'All Models'}</option>
            {models.map(model => (
              <option key={model} value={model}>{model}</option>
            ))}
          </select>

          {/* View Mode */}
          <div className="flex gap-2">
            <button
              onClick={() => setViewMode('grid')}
              className={viewMode === 'grid' ? 'toolbar-btn-active' : 'toolbar-btn'}
              title="Grid View"
            >
              <Grid3x3 className="w-5 h-5" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={viewMode === 'list' ? 'toolbar-btn-active' : 'toolbar-btn'}
              title="List View"
            >
              <List className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Artworks Grid/List (暂时使用普通渲染，等虚拟滚动库安装后启用) */}
        {loading ? (
          <div className="grid grid-cols-4 gap-4">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="loading-pulse aspect-square rounded-lg" />
            ))}
          </div>
        ) : filteredArtworks.length === 0 ? (
          <div className="card p-12 text-center">
            <p className="text-dark-500">
              {language === 'zh' ? '还没有作品，去创作一张吧！' : 'No artworks yet. Create one!'}
            </p>
            <Link href="/create" className="btn-primary mt-4">
              {language === 'zh' ? '开始创作' : 'Start Creating'}
            </Link>
          </div>
        ) : (
          <div className="h-[calc(100vh-300px)] overflow-auto">
            <div className={viewMode === 'grid' ? 'grid grid-cols-4 gap-4' : 'space-y-4'}>
              {filteredArtworks.map((artwork) => (
                <ArtworkCard
                  key={artwork.id}
                  artwork={artwork}
                  viewMode={viewMode}
                  onDelete={() => artwork.id !== undefined && handleDelete(artwork.id)}
                  onDownload={handleDownload}
                  onEdit={handleEdit}
                  language={language}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// 作品卡片组件
function ArtworkCard({
  artwork,
  viewMode,
  onDelete,
  onDownload,
  onEdit,
  language
}: {
  artwork: Artwork;
  viewMode: 'grid' | 'list';
  onDelete: () => void;
  onDownload: (imageUrl: string, filename?: string) => void;
  onEdit: (imageUrl: string) => void;
  language: 'zh' | 'en';
}) {
  if (viewMode === 'list') {
    return (
      <div className="card-hover p-4 flex gap-4">
        <img
          src={artwork.thumbnail || artwork.imageUrl}
          alt={artwork.prompt}
          className="w-24 h-24 object-cover rounded-lg"
          loading="lazy"
        />
        <div className="flex-1">
          <p className="text-dark-900 dark:text-dark-50 font-medium mb-2 line-clamp-2">
            {artwork.prompt}
          </p>
          <div className="flex gap-2 mb-2">
            <span className="badge-neutral text-xs">{artwork.model}</span>
            <span className="badge-neutral text-xs">{artwork.aspectRatio}</span>
          </div>
          <p className="text-xs text-dark-500">
            {new Date(artwork.timestamp).toLocaleDateString()}
          </p>
        </div>
        <div className="flex gap-2">
          <button 
            onClick={() => onDownload(artwork.imageUrl, `${artwork.prompt.slice(0, 20)}-${Date.now()}.png`)}
            className="toolbar-btn" 
            title={language === 'zh' ? '下载' : 'Download'}
          >
            <Download className="w-4 h-4" />
          </button>
          <button 
            onClick={() => onEdit(artwork.imageUrl)}
            className="toolbar-btn" 
            title={language === 'zh' ? '编辑' : 'Edit'}
          >
            <Edit className="w-4 h-4" />
          </button>
          <button onClick={onDelete} className="toolbar-btn" title={language === 'zh' ? '删除' : 'Delete'}>
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="card-hover group overflow-hidden">
      <div className="relative aspect-square flex items-center justify-center bg-dark-50 dark:bg-dark-900 p-2">
        <img
          src={artwork.thumbnail || artwork.imageUrl}
          alt={artwork.prompt}
          className="max-w-full max-h-full object-contain"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/0 to-black/0 opacity-0 group-hover:opacity-100 transition-opacity">
          <div className="absolute bottom-0 left-0 right-0 p-4">
            <p className="text-white text-sm line-clamp-2 mb-3">{artwork.prompt}</p>
            <div className="flex gap-2">
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  onDownload(artwork.imageUrl, `${artwork.prompt.slice(0, 20)}-${Date.now()}.png`);
                }}
                className="btn-secondary text-sm py-1"
                title={language === 'zh' ? '下载' : 'Download'}
              >
                <Download className="w-4 h-4" />
              </button>
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  onEdit(artwork.imageUrl);
                }}
                className="btn-primary text-sm py-1 flex-1 flex items-center justify-center gap-2"
              >
                <Edit className="w-4 h-4" />
                {language === 'zh' ? '编辑' : 'Edit'}
              </button>
            </div>
          </div>
        </div>
        <button
          onClick={onDelete}
          className="absolute top-2 right-2 w-8 h-8 bg-accent-500/80 hover:bg-accent-600 rounded-full flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
      <div className="p-3">
        <div className="flex gap-2">
          <span className="badge-neutral text-xs">{artwork.model}</span>
          <span className="badge-neutral text-xs">{artwork.aspectRatio}</span>
        </div>
      </div>
    </div>
  );
}
