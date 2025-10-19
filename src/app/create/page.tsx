'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import dynamic from 'next/dynamic';
import { useLanguage } from '@/contexts/LanguageContext';
import { useKeyboardShortcuts } from '@/hooks/useKeyboardShortcuts';
import { useAuth } from '@/hooks/useAuth';
import { ProviderManager } from '@/lib/apiProviders';
import { createBlankImageByRatio, getAspectRatioDimensions } from '@/utils/imageGenerator';
import { supabase } from '@/lib/supabase';
import { 
  Sparkles, 
  Image as ImageIcon, 
  Wand2, 
  Download, 
  Trash2, 
  Grid3x3,
  Sliders,
  Palette,
  X,
  BookOpen,
  Lightbulb,
  Zap,
  Keyboard,
  Bot
} from 'lucide-react';
import Link from 'next/link';

// 懒加载非关键组件 - 优化首屏加载性能
const PromptGallery = dynamic(() => import('@/components/PromptGallery'), {
  loading: () => <div className="flex items-center justify-center p-8"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500"></div></div>,
  ssr: false
});

const QuickPlayModes = dynamic(() => import('@/components/QuickPlayModes'), {
  loading: () => <div className="flex items-center justify-center p-4"><div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary-500"></div></div>,
  ssr: false
});

const PromptHints = dynamic(() => import('@/components/PromptHints'), {
  ssr: false
});

const KeyboardShortcutsHelp = dynamic(() => import('@/components/KeyboardShortcutsHelp'), {
  ssr: false
});

const FusionTemplates = dynamic(() => import('@/components/FusionTemplates'), {
  ssr: false
});

const AuthModal = dynamic(() => import('@/components/AuthModal'), {
  ssr: false
});

export default function CreatePage() {
  const { language, t } = useLanguage();
  const { user, isLoggedIn } = useAuth();  // ✅ 认证状态
  const [prompt, setPrompt] = useState('');
  const [referenceImages, setReferenceImages] = useState<string[]>([]);  // ✅ 改为数组支持多图
  const [selectedRatio, setSelectedRatio] = useState('auto');  // 默认自动检测
  const [selectedStyle, setSelectedStyle] = useState('realistic');
  const [selectedModel, setSelectedModel] = useState('gemini-2.5-flash-image');
  const [batchCount, setBatchCount] = useState(1);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedImages, setGeneratedImages] = useState<Array<{ url: string; prompt: string; timestamp: number }>>([]);
  const [error, setError] = useState<string | null>(null);
  const [showPromptGallery, setShowPromptGallery] = useState(false);
  const [showQuickPlay, setShowQuickPlay] = useState(false);
  const [showPromptHints, setShowPromptHints] = useState(false);
  const [showKeyboardHelp, setShowKeyboardHelp] = useState(false);
  const [isDragging, setIsDragging] = useState(false);  // ✅ 拖拽状态
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);  // ✅ 拖拽排序状态
  const [styleSectionOpen, setStyleSectionOpen] = useState(false);  // 风格区域折叠
  const [showAuthModal, setShowAuthModal] = useState(false);  // ✅ 认证模态框
  const [generationIntent, setGenerationIntent] = useState<any>(null);  // ✅ 生成意图
  const fileInputRef = useRef<HTMLInputElement>(null);
  const uploadAreaRef = useRef<HTMLDivElement>(null);  // ✅ 上传区域引用

  // 获取Pockgo Image的图像模型
  const pockgoProvider = ProviderManager.getProviderById('pockgo-image');
  const imageModels = pockgoProvider?.models.filter(m => m.type === 'image') || [];

  // 下载图片函数 - 多重策略确保下载成功
  const handleDownload = async (imageUrl: string, filename?: string) => {
    const downloadFilename = filename || `imagine-${Date.now()}.png`;
    
    console.log('🔽 开始下载图片:', imageUrl.substring(0, 100));
    
    // 策略1: 尝试no-cors模式的fetch（最宽松）
    try {
      const response = await fetch(imageUrl, {
        mode: 'no-cors',
        cache: 'no-cache'
      });
      
      // no-cors模式下无法读取blob，直接尝试服务端代理
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
        
        // 创建本地Blob URL
        const blobUrl = URL.createObjectURL(blob);
        
        // 创建隐藏的下载链接
        const link = document.createElement('a');
        link.href = blobUrl;
        link.download = downloadFilename;
        link.style.display = 'none';
        
        // 添加到DOM并触发点击
        document.body.appendChild(link);
        
        // 使用setTimeout确保DOM更新完成
        setTimeout(() => {
          link.click();
          console.log('✅ 通过服务端代理下载成功');
          
          // 清理
          setTimeout(() => {
            document.body.removeChild(link);
            URL.revokeObjectURL(blobUrl);
          }, 100);
        }, 10);
        
        return; // 成功，退出函数
        
      } catch (proxyError) {
        console.error('❌ 服务端代理失败:', proxyError);
        
        // 策略3: 尝试cors模式的fetch（有些API支持）
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
          
          return; // 成功，退出函数
          
        } catch (corsError) {
          console.error('❌ CORS直接下载失败:', corsError);
          
          // 策略4: 最终备用方案 - 新窗口打开
          console.log('⚠️ 所有下载方式失败，在新窗口打开图片');
          const newWindow = window.open(imageUrl, '_blank');
          
          if (newWindow) {
            setError(language === 'zh' 
              ? '⚠️ 自动下载失败，已在新窗口打开图片。请右键点击图片选择"图片另存为"' 
              : '⚠️ Auto-download failed. Image opened in new window. Please right-click and "Save image as"');
          } else {
            setError(language === 'zh' 
              ? '❌ 下载失败，请允许弹出窗口或手动复制图片链接' 
              : '❌ Download failed. Please allow pop-ups or copy image URL manually');
          }
          
          setTimeout(() => setError(null), 8000);
        }
      }
    }
  };

  // 页面加载时从 localStorage 恢复作品历史和模型选择
  useEffect(() => {
    const savedImages = localStorage.getItem('imagine-engine-generated-images');
    if (savedImages) {
      try {
        const images = JSON.parse(savedImages);
        setGeneratedImages(images);
        console.log(`📚 恢复历史作品: ${images.length} 张`);
      } catch (err) {
        console.error('❌ 恢复历史作品失败:', err);
      }
    }

    // 恢复模型选择
    const savedModel = localStorage.getItem('imagine-engine-model');
    if (savedModel) {
      setSelectedModel(savedModel);
      console.log(`🤖 恢复模型选择: ${savedModel}`);
    }

    // 检测从 Showcase 跳转过来的待填充提示词
    const pendingPrompt = localStorage.getItem('pending-prompt');
    if (pendingPrompt) {
      setPrompt(pendingPrompt);
      localStorage.removeItem('pending-prompt');
      
      const needsInput = localStorage.getItem('showcase-needs-input');
      if (needsInput) {
        localStorage.removeItem('showcase-needs-input');
        // 提示用户上传参考图
        setTimeout(() => {
          setError('💡 ' + (language === 'zh' 
            ? '此案例需要上传参考图。请点击下方"参考图"区域上传图片。' 
            : 'This case requires a reference image. Please upload one below.'));
          setTimeout(() => setError(null), 5000);
        }, 500);
      }
      
      console.log('✨ 已从 Showcase 加载提示词');
    }
  }, [language]);

  // 作品变化时自动保存到 localStorage
  useEffect(() => {
    if (generatedImages.length > 0) {
      try {
        const imagesToSave = generatedImages.slice(0, 50);
        localStorage.setItem('imagine-engine-generated-images', JSON.stringify(imagesToSave));
        console.log(`💾 自动保存作品历史: ${imagesToSave.length} 张`);
      } catch (err) {
        console.error('❌ 保存作品历史失败:', err);
      }
    }
  }, [generatedImages]);

  // 保存模型选择
  useEffect(() => {
    localStorage.setItem('imagine-engine-model', selectedModel);
    console.log(`💾 保存模型选择: ${selectedModel}`);
  }, [selectedModel]);

  const ratios = [
    { id: 'auto', label: language === 'zh' ? '自动检测' : 'Auto', size: language === 'zh' ? '智能' : 'Smart' },
    { id: '1:1', label: '1:1', size: '1024×1024' },
    { id: '16:9', label: '16:9', size: '1920×1080' },
    { id: '9:16', label: '9:16', size: '1080×1920' },
    { id: '4:3', label: '4:3', size: '1024×768' },
    { id: '3:4', label: '3:4', size: '768×1024' },
  ];

  const styles = [
    { id: 'realistic', name: language === 'zh' ? '写实' : 'Realistic', icon: '📸' },
    { id: 'anime', name: language === 'zh' ? '动漫' : 'Anime', icon: '🎭' },
    { id: 'oil_painting', name: language === 'zh' ? '油画' : 'Oil Painting', icon: '🎨' },
    { id: 'watercolor', name: language === 'zh' ? '水彩' : 'Watercolor', icon: '🌸' },
    { id: 'cyberpunk', name: language === 'zh' ? '赛博朋克' : 'Cyberpunk', icon: '🌃' },
    { id: 'minimalist', name: language === 'zh' ? '极简' : 'Minimal', icon: '⚪' },
  ];

  // 压缩图片函数（避免base64过大）
  const compressImage = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          let width = img.width;
          let height = img.height;
          
          // 如果图片过大，压缩到最大1920px
          const maxSize = 1920;
          if (width > maxSize || height > maxSize) {
            if (width > height) {
              height = (height / width) * maxSize;
              width = maxSize;
            } else {
              width = (width / height) * maxSize;
              height = maxSize;
            }
          }
          
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          if (ctx) {
            ctx.drawImage(img, 0, 0, width, height);
            // 压缩质量0.8，减小文件大小
            const compressed = canvas.toDataURL('image/jpeg', 0.8);
            console.log(`🗜️ 图片压缩: ${Math.round(e.target?.result.toString().length / 1024)}KB → ${Math.round(compressed.length / 1024)}KB`);
            resolve(compressed);
          } else {
            reject(new Error('Canvas context creation failed'));
          }
        };
        img.onerror = reject;
        img.src = e.target?.result as string;
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  // 处理多文件上传
  const handleReferenceUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []).filter(file => 
      file.type.startsWith('image/')
    );
    
    if (files.length === 0) return;
    
    // 限制最多6张图片
    const maxImages = 6;
    if (referenceImages.length + files.length > maxImages) {
      setError(language === 'zh' 
        ? `最多支持${maxImages}张参考图` 
        : `Maximum ${maxImages} reference images`);
      setTimeout(() => setError(null), 3000);
      return;
    }
    
    // 压缩并读取所有文件
    try {
      const compressedImages = await Promise.all(files.map(file => compressImage(file)));
      setReferenceImages(prev => [...prev, ...compressedImages]);
      console.log(`📎 成功上传并压缩${compressedImages.length}张参考图`);
    } catch (err) {
      console.error('❌ 文件读取失败:', err);
      setError(language === 'zh' ? '文件读取失败' : 'Failed to read files');
      setTimeout(() => setError(null), 3000);
    }
  };
  
  // 删除指定的参考图
  const handleRemoveImage = (index: number) => {
    setReferenceImages(prev => prev.filter((_, i) => i !== index));
    console.log(`🗑️ 删除第${index + 1}张参考图`);
  };

  // 检测图片比例，找到最接近的标准比例
  const detectImageRatio = async (imageUrl: string): Promise<string> => {
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => {
        const ratio = img.naturalWidth / img.naturalHeight;
        console.log(`📐 检测到图片尺寸: ${img.naturalWidth}x${img.naturalHeight}, 比例: ${ratio.toFixed(2)}`);
        
        const standardRatios = [
          { id: '1:1', value: 1.0 },
          { id: '16:9', value: 16/9 },
          { id: '9:16', value: 9/16 },
          { id: '4:3', value: 4/3 },
          { id: '3:4', value: 3/4 },
        ];
        
        let closestRatio = '1:1';
        let minDifference = Math.abs(ratio - 1.0);
        
        standardRatios.forEach(sr => {
          const difference = Math.abs(ratio - sr.value);
          if (difference < minDifference) {
            minDifference = difference;
            closestRatio = sr.id;
          }
        });
        
        console.log(`✅ 最接近的比例: ${closestRatio}`);
        resolve(closestRatio);
      };
      img.onerror = () => {
        console.log('❌ 无法加载图片，使用默认比例 1:1');
        resolve('1:1');
      };
      img.src = imageUrl;
    });
  };

  // 拖拽排序功能
  const handleImageDragStart = (e: React.DragEvent, index: number) => {
    e.stopPropagation();
    setDraggedIndex(index);
  };

  const handleImageDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (draggedIndex === null || draggedIndex === index) return;
    
    const newImages = [...referenceImages];
    const draggedItem = newImages[draggedIndex];
    newImages.splice(draggedIndex, 1);
    newImages.splice(index, 0, draggedItem);
    
    setReferenceImages(newImages);
    setDraggedIndex(index);
  };

  const handleImageDragEnd = () => {
    setDraggedIndex(null);
  };

  // ✅ 认证成功后的回调（恢复生成意图并自动执行）
  const handleAuthSuccess = () => {
    console.log('🎉 认证成功，恢复生成意图');
    if (generationIntent) {
      // 恢复用户之前的所有设置
      setPrompt(generationIntent.prompt);
      setSelectedStyle(generationIntent.selectedStyle);
      setSelectedRatio(generationIntent.selectedRatio);
      setSelectedModel(generationIntent.selectedModel);
      setReferenceImages(generationIntent.referenceImages);
      setBatchCount(generationIntent.batchCount);
      
      // 延迟执行生成，等待状态更新
      setTimeout(() => {
        console.log('🚀 自动执行生成...');
        handleGenerate();
      }, 500);
    }
  };
  
  // 拖拽上传处理
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };
  
  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };
  
  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    
    const files = Array.from(e.dataTransfer.files).filter(file => 
      file.type.startsWith('image/')
    );
    
    if (files.length === 0) return;
    
    // 限制最多6张图片
    const maxImages = 6;
    if (referenceImages.length + files.length > maxImages) {
      setError(language === 'zh' 
        ? `最多支持${maxImages}张参考图` 
        : `Maximum ${maxImages} reference images`);
      setTimeout(() => setError(null), 3000);
      return;
    }
    
    // 压缩并读取所有文件
    try {
      const compressedImages = await Promise.all(files.map(file => compressImage(file)));
      setReferenceImages(prev => [...prev, ...compressedImages]);
      console.log(`📎 成功拖入并压缩${compressedImages.length}张参考图`);
    } catch (err) {
      console.error('❌ 文件读取失败:', err);
      setError(language === 'zh' ? '文件读取失败' : 'Failed to read files');
      setTimeout(() => setError(null), 3000);
    }
  };

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      setError(language === 'zh' ? '请输入提示词' : 'Please enter a prompt');
      return;
    }

    // ✅ 1. 检查登录状态（延迟注册策略）
    if (!isLoggedIn) {
      console.log('🔐 未登录用户点击生成，触发注册流程');
      // 保存生成意图
      setGenerationIntent({
        prompt,
        selectedStyle,
        selectedRatio,
        selectedModel,
        referenceImages,
        batchCount
      });
      // 显示认证模态框
      setShowAuthModal(true);
      return;
    }

    const apiKey = localStorage.getItem('imagine-engine-api-key') || '';
    const baseUrl = localStorage.getItem('imagine-engine-base-url') || 'https://newapi.pockgo.com/v1/chat/completions';
    const model = selectedModel; // 使用当前选择的模型

    if (!apiKey) {
      setError(language === 'zh' ? '请先在设置中配置 API 密钥' : 'Please configure API key in settings');
      return;
    }

    setIsGenerating(true);
    setError(null);

    try {
      // 🎯 智能比例选择逻辑
      let finalRatio = selectedRatio;
      
      if (selectedRatio === 'auto') {
        // 自动模式：仅在单图时检测比例
        if (referenceImages.length === 1) {
          finalRatio = await detectImageRatio(referenceImages[0]);
          console.log(`🤖 自动检测单图比例: ${finalRatio}`);
        } else {
          // 多图或无图：使用默认1:1
          finalRatio = '1:1';
          console.log(`🤖 多图/无图模式，使用默认比例: 1:1`);
        }
      } else {
        // 用户指定比例：强制使用
        console.log(`👤 用户强制指定比例: ${finalRatio}`);
      }

      // 获取认证token
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        console.log('❌ 无session，弹出登录框');
        setShowAuthModal(true);
        setIsGenerating(false);
        return;
      }

      const promises = [];
      for (let i = 0; i < batchCount; i++) {
        const dimensions = getAspectRatioDimensions(finalRatio);
        
        // 🎨 增强提示词，加入比例信息（双重保险）
        const enhancedPrompt = `[STRICT ASPECT RATIO: ${finalRatio}, Target Size: ${dimensions.width}x${dimensions.height}]

${prompt.trim()}

CRITICAL: Generate in EXACTLY ${finalRatio} aspect ratio (${dimensions.width}x${dimensions.height} pixels). Fill entire canvas edge-to-edge.`;
        
        const requestBody: any = {
          prompt: enhancedPrompt,
          aspectRatio: finalRatio,
          apiKey,
          baseUrl,
          model
        };
        
        // 只在用户选择了风格时才发送
        if (selectedStyle && selectedStyle !== 'realistic') {
          requestBody.style = selectedStyle;
        }
        
        // 🎯 比例控制策略
        if (selectedRatio === 'auto' && referenceImages.length === 1) {
          // 自动模式+单图：直接使用参考图
          requestBody.baseImage = referenceImages[0];
          console.log(`📎 自动模式：使用参考图（检测比例: ${finalRatio}）`);
        } else if (selectedRatio !== 'auto' || referenceImages.length === 0) {
          // 用户指定比例 或 无图：使用空白画布强制控制
          const blankCanvas = createBlankImageByRatio(finalRatio);
          requestBody.baseImage = blankCanvas;
          console.log(`🎨 强制比例：使用空白画布 ${finalRatio} (${dimensions.width}x${dimensions.height})`);
          
          // 如果有参考图（多图），作为额外参考
          if (referenceImages.length > 0) {
            if (referenceImages.length > 1) {
              requestBody.referenceImages = referenceImages;
              console.log(`📎 ${referenceImages.length}张参考图（比例由空白画布强制控制）`);
            } else if (referenceImages.length === 1 && selectedRatio !== 'auto') {
              // 单图但用户指定了比例，使用referenceImages作为内容参考
              requestBody.referenceImages = referenceImages;
              console.log(`📎 单图作为内容参考（比例由空白画布强制控制为${finalRatio}）`);
            }
          }
        } else {
          // 多图自动模式：使用默认比例的空白画布
          const blankCanvas = createBlankImageByRatio(finalRatio);
          requestBody.baseImage = blankCanvas;
          requestBody.referenceImages = referenceImages;
          console.log(`🎨 多图自动模式：空白画布(${finalRatio}) + ${referenceImages.length}张参考图`);
        }
        
        promises.push(
          fetch('/api/generate', {
            method: 'POST',
            headers: { 
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${session.access_token}`
            },
            body: JSON.stringify(requestBody)
          }).then(res => res.json())
        );
      }

      const results = await Promise.all(promises);
      
      // ✅ 检查错误响应
      for (const data of results) {
        if (data.error === 'AUTHENTICATION_REQUIRED') {
          console.log('🔐 API返回未登录错误，弹出认证框');
          setShowAuthModal(true);
          setIsGenerating(false);
          return;
        }
        if (data.error === 'QUOTA_EXHAUSTED') {
          console.log('💰 配额已用完');
          setError(language === 'zh' ? '配额已用完，请升级套餐或购买配额包' : 'Quota exhausted');
          setIsGenerating(false);
          return;
        }
      }
      
      const newImages = results
        .filter(data => data.imageUrl)
        .map((data, index) => ({ 
          url: data.imageUrl, 
          prompt, 
          timestamp: Date.now() + index
        }));
      
      if (newImages.length > 0) {
        setGeneratedImages(prev => [...newImages, ...prev]);
        console.log(`✅ 成功生成 ${newImages.length} 张图片，剩余配额=${results[0].quota_remaining}`);
        
        // ✅ 显示配额提示
        if (results[0].quota_remaining !== undefined && results[0].quota_remaining <= 3) {
          setTimeout(() => {
            setError(`⚠️ 您还剩 ${results[0].quota_remaining} 张配额`);
            setTimeout(() => setError(null), 5000);
          }, 2000);
        }
      } else {
        throw new Error(language === 'zh' ? '生成失败' : 'Generation failed');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : (language === 'zh' ? '生成失败' : 'Generation failed'));
    } finally {
      setIsGenerating(false);
    }
  };

  const handleTogglePromptGallery = useCallback(() => {
    setShowPromptGallery(prev => !prev);
  }, []);

  useKeyboardShortcuts({
    onGenerate: handleGenerate,
    onTogglePromptGallery: handleTogglePromptGallery,
    isGenerating
  });

  // 首次访问显示快捷键帮助
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
    <div className="page-container">
      <div className="content-wrapper">
        {/* 页面标题 */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-dark-900 dark:text-dark-50 mb-2">
            {language === 'zh' ? 'AI Studio' : 'AI Studio'}
          </h1>
          <p className="text-dark-600 dark:text-dark-400">
            {language === 'zh' ? '专业图片生成工具' : 'Professional image generation tool'}
          </p>
        </div>

        <div className="grid lg:grid-cols-12 gap-6">
          {/* 第1列：核心输入区（33% = 4/12） */}
          <div className="col-span-12 lg:col-span-4 space-y-4">
            {/* 上传图片 */}
            <div className="card p-5">
              <label className="form-label flex items-center gap-2 mb-3">
                <ImageIcon className="w-4 h-4 text-primary-500" />
                {language === 'zh' ? '参考图（可选）' : 'Reference (Optional)'}
              </label>
              
              {referenceImages.length >= 2 && (
                <div className="mb-3">
                  <span className="text-xs bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 px-2 py-1 rounded-full font-medium">
                    🎭 {language === 'zh' ? '多图融合模式' : 'Multi-Image Fusion'}
                  </span>
                </div>
              )}
              
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                multiple
                onChange={handleReferenceUpload}
                className="hidden"
              />
              
              {/* 多图缩略图预览区域 - 3列布局 */}
              {referenceImages.length > 0 ? (
                <div className="space-y-3">
                  <div className="grid grid-cols-3 gap-2">
                    {referenceImages.map((img, index) => (
                      <div 
                        key={index} 
                        className={`relative group cursor-move ${draggedIndex === index ? 'opacity-50 scale-95' : ''}`}
                        draggable
                        onDragStart={(e) => handleImageDragStart(e, index)}
                        onDragOver={(e) => handleImageDragOver(e, index)}
                        onDragEnd={handleImageDragEnd}
                      >
                        <img 
                          src={img} 
                          alt={`${language === 'zh' ? '参考图' : 'Ref'}${index + 1}`} 
                          className="w-full h-32 object-cover rounded-lg border-2 border-dark-200 dark:border-dark-700 hover:border-primary-400 dark:hover:border-primary-500 transition-all"
                        />
                        <button
                          onClick={() => handleRemoveImage(index)}
                          className="absolute top-1 right-1 w-6 h-6 bg-red-500 hover:bg-red-600 rounded-full flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity shadow-lg z-10"
                          title={language === 'zh' ? '删除' : 'Remove'}
                        >
                          <X className="w-3 h-3" />
                        </button>
                        <span className="absolute bottom-1 left-1 bg-black/70 text-white text-xs px-2 py-1 rounded font-bold">
                          {index + 1}
                        </span>
                        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-lg pointer-events-none"></div>
                      </div>
                    ))}
                  </div>
                  
                  {/* 添加更多按钮 */}
                  {referenceImages.length < 6 && (
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      className="w-full py-2 border-2 border-dashed border-primary-300 dark:border-primary-700 rounded-lg hover:bg-primary-50 dark:hover:bg-primary-900/10 hover:border-primary-400 dark:hover:border-primary-500 transition-all text-sm text-primary-600 dark:text-primary-400 font-medium"
                    >
                      + {language === 'zh' ? '添加更多' : 'Add more'} ({referenceImages.length}/6)
                    </button>
                  )}
                </div>
              ) : (
                <div
                  ref={uploadAreaRef}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  onClick={() => fileInputRef.current?.click()}
                  className={`w-full p-5 border-2 border-dashed rounded-lg transition-all cursor-pointer ${
                    isDragging
                      ? 'border-primary-500 dark:border-primary-400 bg-dark-50 dark:bg-dark-900'
                      : 'border-dark-300 dark:border-dark-700 hover:border-dark-400 dark:hover:border-dark-600'
                  }`}
                >
                  <ImageIcon className={`w-8 h-8 mx-auto mb-2 transition-colors ${
                    isDragging ? 'text-primary-500' : 'text-dark-400'
                  }`} />
                  <p className="text-sm text-dark-600 dark:text-dark-400 text-center">
                    {language === 'zh' ? '点击或拖拽上传' : 'Click or drag'}
                  </p>
                  <p className="text-xs text-dark-500 mt-1 text-center">
                    {language === 'zh' ? '支持多图融合（最多6张）' : 'Multi-image (max 6)'}
                  </p>
                </div>
              )}
            </div>

            {/* 快捷操作 */}
            <div className="card p-3">
              <div className="grid grid-cols-3 gap-2">
                <button
                  onClick={() => setShowPromptGallery(true)}
                  className="p-3 rounded-lg border border-dark-200 dark:border-dark-800 hover:border-primary-400 dark:hover:border-primary-500 hover:bg-dark-50 dark:hover:bg-dark-900 transition-all flex flex-col items-center gap-1"
                >
                  <BookOpen className="w-5 h-5 text-dark-600 dark:text-dark-400" />
                  <span className="text-xs text-dark-700 dark:text-dark-300">{language === 'zh' ? '模板库' : 'Templates'}</span>
                </button>
                <button
                  onClick={() => setShowQuickPlay(true)}
                  className="p-3 rounded-lg border border-dark-200 dark:border-dark-800 hover:border-primary-400 dark:hover:border-primary-500 hover:bg-dark-50 dark:hover:bg-dark-900 transition-all flex flex-col items-center gap-1"
                >
                  <Zap className="w-5 h-5 text-dark-600 dark:text-dark-400" />
                  <span className="text-xs text-dark-700 dark:text-dark-300">{language === 'zh' ? '快速' : 'Quick'}</span>
                </button>
                <button
                  onClick={() => setShowPromptHints(true)}
                  className="p-3 rounded-lg border border-dark-200 dark:border-dark-800 hover:border-primary-400 dark:hover:border-primary-500 hover:bg-dark-50 dark:hover:bg-dark-900 transition-all flex flex-col items-center gap-1"
                >
                  <Lightbulb className="w-5 h-5 text-dark-600 dark:text-dark-400" />
                  <span className="text-xs text-dark-700 dark:text-dark-300">{language === 'zh' ? '提示' : 'Tips'}</span>
                </button>
              </div>
            </div>

            {/* 提示词输入 */}
            <div className="card p-6">
              <label className="form-label flex items-center gap-2 mb-3">
                <Wand2 className="w-4 h-4 text-primary-500" />
                {language === 'zh' ? '提示词' : 'Prompt'}
              </label>
              
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                onKeyDown={(e) => {
                  if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
                    e.preventDefault();
                    if (prompt.trim() && !isGenerating) handleGenerate();
                  }
                }}
                placeholder={language === 'zh' ? '描述你想创作的画面...' : 'Describe what you want to create...'}
                className="textarea h-32 resize-none"
                maxLength={500}
              />
              <div className="flex justify-between items-center mt-2">
                <span className="text-xs text-dark-500">
                  {language === 'zh' ? 'Ctrl+Enter 生成' : 'Ctrl+Enter to generate'}
                </span>
                <span className="text-xs text-dark-500">{prompt.length}/500</span>
              </div>
            </div>

            {/* 多图融合模板（仅多图时显示） */}
            {referenceImages.length >= 2 && (
              <div className="card p-4">
                <FusionTemplates 
                  onSelect={(template) => setPrompt(template)} 
                  imageCount={referenceImages.length}
                />
              </div>
            )}

            {/* 生成按钮 */}
            <button
              onClick={handleGenerate}
              disabled={!prompt.trim() || isGenerating}
              className="btn-primary w-full py-4 text-base font-semibold"
            >
              {isGenerating ? (
                <>
                  <div className="loading-spinner" />
                  {language === 'zh' ? `生成中 (${batchCount}张)...` : `Generating (${batchCount})...`}
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5" />
                  {isLoggedIn 
                    ? (language === 'zh' ? '开始创作' : 'Start Creating')
                    : (language === 'zh' ? '登录后生成' : 'Login to Generate')}
                  {isLoggedIn && referenceImages.length > 1 && ` (${language === 'zh' ? '多图融合' : 'Multi-Fusion'})`}
                </>
              )}
            </button>

            {error && (
              <div className="card p-4 border-2 border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-900/20">
                <p className="text-sm text-red-700 dark:text-red-300">{error}</p>
              </div>
            )}
          </div>

          {/* 第2列：参数配置区（25% = 3/12） */}
          <div className="col-span-12 lg:col-span-3 space-y-4">
            {/* AI模型 */}
            <div className="card p-6">
              <label className="form-label flex items-center gap-2 mb-3">
                <Bot className="w-4 h-4 text-primary-500" />
                {language === 'zh' ? 'AI 模型' : 'AI Model'}
              </label>
              <select
                value={selectedModel}
                onChange={(e) => setSelectedModel(e.target.value)}
                className="select"
              >
                {imageModels.map((model) => (
                  <option key={model.id} value={model.id}>
                    {language === 'zh' ? model.nameZh : model.name}
                  </option>
                ))}
              </select>
              <p className="text-xs text-dark-500 mt-2">
                {language === 'zh' 
                  ? imageModels.find(m => m.id === selectedModel)?.descriptionZh 
                  : imageModels.find(m => m.id === selectedModel)?.description}
              </p>
            </div>

            {/* 图片参数 */}
            <div className="card p-6">
              <label className="form-label flex items-center gap-2 mb-3">
                <Grid3x3 className="w-4 h-4 text-primary-500" />
                {language === 'zh' ? '图片参数' : 'Image Settings'}
              </label>
              
              {/* 比例选择 */}
              <div className="mb-4">
                <span className="text-sm text-dark-700 dark:text-dark-300 font-medium mb-2 block">
                  {language === 'zh' ? '比例' : 'Aspect Ratio'}
                </span>
                <div className="grid grid-cols-3 gap-2">
                  {ratios.map((ratio) => (
                    <button
                      key={ratio.id}
                      onClick={() => setSelectedRatio(ratio.id)}
                      className={`px-2 py-2 rounded-button text-sm font-medium transition-colors ${
                        selectedRatio === ratio.id
                          ? 'bg-primary-500 text-white'
                          : 'bg-dark-100 dark:bg-dark-900 text-dark-600 dark:text-dark-400 hover:bg-dark-200 dark:hover:bg-dark-800'
                      }`}
                    >
                      <div className="font-semibold">{ratio.label}</div>
                      <div className="text-xs opacity-75">{ratio.size}</div>
                    </button>
                  ))}
                </div>
              </div>
              
              {/* 风格选择 - 折叠形式 */}
              <div>
                <button
                  onClick={() => setStyleSectionOpen(!styleSectionOpen)}
                  className="w-full flex items-center justify-between p-3 rounded-lg border border-dark-200 dark:border-dark-800 hover:border-primary-400 dark:hover:border-primary-500 transition-all"
                >
                  <div className="flex items-center gap-2">
                    <Palette className="w-4 h-4 text-primary-500" />
                    <span className="text-sm font-medium text-dark-700 dark:text-dark-300">
                      {language === 'zh' ? '风格' : 'Style'}
                    </span>
                    <span className="text-xs text-dark-500">
                      {styles.find(s => s.id === selectedStyle)?.icon} {styles.find(s => s.id === selectedStyle)?.name}
                    </span>
                  </div>
                  <div className={`transition-transform duration-200 text-dark-400 ${styleSectionOpen ? 'rotate-180' : ''}`}>
                    ▼
                  </div>
                </button>
                
                {styleSectionOpen && (
                  <div className="grid grid-cols-3 gap-2 mt-2 p-2 bg-dark-50 dark:bg-dark-900 rounded-lg animate-fadeIn">
                    {styles.map((style) => (
                      <button
                        key={style.id}
                        onClick={() => {
                          setSelectedStyle(style.id);
                          setStyleSectionOpen(false);
                        }}
                        className={`px-2 py-2 rounded-lg text-sm font-medium transition-all ${
                          selectedStyle === style.id
                            ? 'bg-primary-500 text-white'
                            : 'bg-white dark:bg-dark-800 text-dark-600 dark:text-dark-400 hover:bg-dark-100 dark:hover:bg-dark-700 border border-dark-200 dark:border-dark-700'
                        }`}
                      >
                        <div className="text-lg mb-1">{style.icon}</div>
                        <div className="text-xs">{style.name}</div>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* 批量生成 */}
            <div className="card p-6">
              <label className="form-label flex items-center gap-2 mb-3">
                <Sliders className="w-4 h-4 text-primary-500" />
                {language === 'zh' ? '批量生成' : 'Batch Size'}
              </label>
              <div className="flex gap-2">
                {[1, 2, 4].map((count) => (
                  <button
                    key={count}
                    onClick={() => setBatchCount(count)}
                    className={`flex-1 px-3 py-3 rounded-button text-sm font-semibold transition-colors ${
                      batchCount === count
                        ? 'bg-primary-500 text-white'
                        : 'bg-dark-100 dark:bg-dark-900 text-dark-600 dark:text-dark-400 hover:bg-dark-200 dark:hover:bg-dark-800'
                    }`}
                  >
                    {count}{language === 'zh' ? '张' : ' imgs'}
                  </button>
                ))}
              </div>
            </div>

          </div>

          {/* 第3列：结果展示区（42% = 5/12） */}
          <div className="col-span-12 lg:col-span-5">
            <div className="card p-6 max-h-[calc(100vh-200px)] flex flex-col">
              <div className="flex items-center justify-between mb-6 flex-shrink-0">
                <h2 className="text-xl font-bold text-dark-900 dark:text-dark-50">
                  {language === 'zh' ? '生成结果' : 'Results'}
                </h2>
                {generatedImages.length > 0 && (
                  <div className="flex items-center gap-3">
                    <span className="text-sm text-dark-600 dark:text-dark-400">
                      {generatedImages.length} {language === 'zh' ? '张作品' : 'images'}
                    </span>
                    <button
                      onClick={() => {
                        if (confirm(language === 'zh' ? '确定清空所有作品？' : 'Clear all artworks?')) {
                          setGeneratedImages([]);
                          localStorage.removeItem('imagine-engine-generated-images');
                        }
                      }}
                      className="btn-ghost text-sm"
                    >
                      <Trash2 className="w-4 h-4" />
                      {language === 'zh' ? '清空' : 'Clear'}
                    </button>
                  </div>
                )}
              </div>

              {generatedImages.length === 0 && !isGenerating ? (
                <div className="flex flex-col items-center justify-center flex-1 text-center">
                  <div className="w-20 h-20 bg-dark-100 dark:bg-dark-900 rounded-2xl flex items-center justify-center mb-4">
                    <Sparkles className="w-10 h-10 text-dark-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-dark-900 dark:text-dark-50 mb-2">
                    {language === 'zh' ? '准备开始创作' : 'Ready to Create'}
                  </h3>
                  <p className="text-dark-600 dark:text-dark-400 max-w-md">
                    {language === 'zh' 
                      ? '输入提示词，选择参数，点击生成按钮创作你的第一张图片' 
                      : 'Enter a prompt, select parameters, and click generate to create your first image'}
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 overflow-y-auto flex-1 custom-scrollbar">
                  {isGenerating && (
                    <div className="aspect-square bg-dark-100 dark:bg-dark-900 rounded-lg flex items-center justify-center">
                      <div className="text-center">
                        <div className="loading-spinner mx-auto mb-3" />
                        <p className="text-sm text-dark-600 dark:text-dark-400">
                          {language === 'zh' ? '生成中...' : 'Generating...'}
                        </p>
                      </div>
                    </div>
                  )}

                  {generatedImages.map((item, idx) => (
                    <div key={`${item.timestamp}-${idx}`} className="group relative card-hover">
                      <div className="relative aspect-square bg-dark-50 dark:bg-dark-900 rounded-lg overflow-hidden flex items-center justify-center p-2">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setGeneratedImages(prev => prev.filter((_, i) => i !== idx));
                          }}
                          className="absolute top-2 right-2 w-7 h-7 bg-accent-500/90 hover:bg-accent-600 rounded-full flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity z-10"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                        
                        <img
                          src={item.url}
                          alt={item.prompt}
                          className="max-w-full max-h-full object-contain rounded"
                          loading="lazy"
                        />
                      </div>
                      
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                        <div className="absolute bottom-0 left-0 right-0 p-3">
                          <p className="text-white text-sm line-clamp-2 mb-3">{item.prompt}</p>
                          <div className="flex gap-2">
                            <button 
                              onClick={(e) => {
                                e.stopPropagation();
                                e.preventDefault();
                                handleDownload(item.url, `imagine-${Date.now()}.png`);
                              }}
                              className="flex-1 btn-secondary text-xs py-1.5"
                            >
                              <Download className="w-3 h-3" />
                              {language === 'zh' ? '下载' : 'Download'}
                            </button>
                            <button 
                              onClick={(e) => {
                                e.stopPropagation();
                                sessionStorage.setItem('edit-image', item.url);
                                window.location.href = '/edit';
                              }}
                              className="flex-1 btn-primary text-xs py-1.5"
                            >
                              <Wand2 className="w-3 h-3" />
                              {language === 'zh' ? '编辑' : 'Edit'}
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* 提示词画廊模态框 */}
      {showPromptGallery && (
        <PromptGallery
          isVisible={showPromptGallery}
          onClose={() => setShowPromptGallery(false)}
          onSelectPrompt={(selectedPrompt) => {
            setPrompt(selectedPrompt);
            setShowPromptGallery(false);
          }}
        />
      )}

      {/* 一键玩法模态框 */}
      {showQuickPlay && (
        <div className="modal-overlay" onClick={() => setShowQuickPlay(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <QuickPlayModes onSelectMode={(mode) => {
              setPrompt(mode.prompt);
              setShowQuickPlay(false);
            }} />
          </div>
        </div>
      )}

      {/* 提示词质量提示 */}
      {showPromptHints && (
        <PromptHints
          isVisible={showPromptHints}
          onClose={() => setShowPromptHints(false)}
        />
      )}

      {/* 键盘快捷键帮助 */}
      {showKeyboardHelp && (
        <KeyboardShortcutsHelp
          isVisible={showKeyboardHelp}
          onClose={() => setShowKeyboardHelp(false)}
        />
      )}

      {/* ✅ 认证模态框（延迟注册策略） */}
      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        onSuccess={handleAuthSuccess}
        initialMode="signup"
      />
    </div>
  );
}
