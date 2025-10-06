'use client';

import { useState, useEffect } from 'react';
import PromptInput from './PromptInput';
import StyleSelector from './StyleSelector';
import ResultDisplay from './ResultDisplay';
import EnhancedHistory from './EnhancedHistory';
import QuickActions from './QuickActions';
import VersionHistory from './VersionHistory';
import QualityTips from './QualityTips';
import InteractiveCanvas from './InteractiveCanvas';
import KeyboardShortcutsHelp from './KeyboardShortcutsHelp';
import { useKeyboardShortcuts } from '../hooks/useKeyboardShortcuts';

// 历史记录类型定义
interface GenerationHistory {
  id: string;
  prompt: string;
  style: string;
  imageUrl: string;
  timestamp: number;
  type: 'generate' | 'edit';
  tool?: string;
}

export default function GeneratorInterface() {
  const [isGenerating, setIsGenerating] = useState(false);
  const [currentResult, setCurrentResult] = useState<string | null>(null);
  const [selectedStyle, setSelectedStyle] = useState('realistic');
  const [history, setHistory] = useState<GenerationHistory[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [currentPrompt, setCurrentPrompt] = useState('');
  const [showVersionHistory, setShowVersionHistory] = useState(false);
  const [showQualityTips, setShowQualityTips] = useState(false);
  const [showShortcutsHelp, setShowShortcutsHelp] = useState(false);
  const [useInteractiveCanvas, setUseInteractiveCanvas] = useState(false);

  // 示例提示词
  const examplePrompts = [
    '一只可爱的橘猫坐在窗台上，阳光透过窗户洒在它身上',
    '未来科技城市的夜景，霓虹灯闪烁，飞行汽车穿梭其间',
    '梦幻森林中的精灵小屋，周围有发光的蘑菇和蝴蝶',
    '宁静的湖面倒映着雪山，一只天鹅优雅地游过',
  ];

  // 从localStorage加载历史记录
  useEffect(() => {
    const savedHistory = localStorage.getItem('imagine-engine-history');
    if (savedHistory) {
      try {
        setHistory(JSON.parse(savedHistory));
      } catch (e) {
        console.error('Failed to load history:', e);
      }
    }
  }, []);

  // 保存历史记录到localStorage
  const saveHistory = (newHistory: GenerationHistory[]) => {
    setHistory(newHistory);
    localStorage.setItem('imagine-engine-history', JSON.stringify(newHistory));
  };

  // 处理图片生成
  const handleGenerate = async (prompt: string) => {
    if (!prompt.trim()) {
      setError('请输入提示词');
      return;
    }

    setIsGenerating(true);
    setError(null);
    setCurrentResult(null);

    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt: prompt.trim(),
          style: selectedStyle,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || '生成失败');
      }

      if (data.imageUrl) {
        setCurrentResult(data.imageUrl);
        
        // 添加到历史记录
        const newItem: GenerationHistory = {
          id: Date.now().toString(),
          prompt: prompt.trim(),
          style: selectedStyle,
          imageUrl: data.imageUrl,
          timestamp: Date.now(),
          type: 'generate',
        };
        
        const newHistory = [newItem, ...history].slice(0, 50); // 最多保存50条记录
        saveHistory(newHistory);
      }
    } catch (error) {
      console.error('Generation error:', error);
      setError(error instanceof Error ? error.message : '生成图片时发生错误');
    } finally {
      setIsGenerating(false);
    }
  };

  // 清除历史记录
  const clearHistory = () => {
    setHistory([]);
    localStorage.removeItem('imagine-engine-history');
  };

  // 处理图片选择（预览）
  const handleImageSelect = (imageUrl: string) => {
    setCurrentResult(imageUrl);
  };

  // 处理提示词复用
  const handlePromptReuse = (prompt: string) => {
    setCurrentPrompt(prompt);
  };

  // 处理继续编辑（跳转到编辑器）
  const handleContinueEdit = (imageUrl: string) => {
    // 将图片URL保存到sessionStorage，供编辑器页面使用
    sessionStorage.setItem('continue-edit-image', imageUrl);
    window.location.href = '/editor';
  };

  // 下载图片
  const handleDownload = async (imageUrl: string, filename: string) => {
    try {
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      
      const link = document.createElement('a');
      link.href = url;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Download failed:', error);
      // 如果下载失败，尝试直接打开图片
      window.open(imageUrl, '_blank');
    }
  };

  // 处理快速生成
  const handleQuickGenerate = (prompt: string, style: string) => {
    setCurrentPrompt(prompt);
    setSelectedStyle(style);
    handleGenerate(prompt);
  };

  // 处理提示词优化
  const handlePromptImprove = (improvedPrompt: string) => {
    setCurrentPrompt(improvedPrompt);
  };

  // 处理版本选择
  const handleVersionSelect = (version: any) => {
    setCurrentResult(version.imageUrl);
    setCurrentPrompt(version.prompt);
    if (version.metadata?.style) {
      setSelectedStyle(version.metadata.style);
    }
  };

  // 处理版本对比
  const handleCompareVersions = (versions: any[]) => {
    console.log('Comparing versions:', versions);
    // 这里可以实现版本对比的具体逻辑
  };

  // 键盘快捷键配置
  useKeyboardShortcuts({
    onGenerate: () => {
      if (currentPrompt.trim()) {
        handleGenerate(currentPrompt);
      }
    },
    onReset: () => {
      setCurrentResult(null);
      setCurrentPrompt('');
      setError(null);
    },
    onToggleHistory: () => setShowVersionHistory(!showVersionHistory),
    onToggleQualityTips: () => setShowQualityTips(!showQualityTips),
    onSwitchToEditor: () => {
      if (currentResult) {
        sessionStorage.setItem('continue-edit-image', currentResult);
      }
      window.location.href = '/editor';
    },
  });

  return (
    <div className="flex h-screen">
      {/* 左侧控制面板 - 35% */}
      <div className="w-[35%] control-panel p-6 space-y-6">
        {/* 页面标题 */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">魔法画室</h1>
          <p className="text-gray-600 text-sm">用文字描述你的想象，让AI为你创造独一无二的艺术作品</p>
        </div>

        {/* 描述你的想象 */}
        <div className="card-panel">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">描述你的想象</h3>
          <PromptInput
            onGenerate={handleGenerate}
            isGenerating={isGenerating}
            initialPrompt={currentPrompt}
            onPromptChange={setCurrentPrompt}
          />
          {error && (
            <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
              <div className="flex items-center space-x-2">
                <span className="text-red-500">⚠️</span>
                <p className="text-red-700 text-sm">{error}</p>
              </div>
            </div>
          )}
        </div>

        {/* 创意灵感 */}
        <div className="card-panel">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">创意灵感</h3>
          <div className="space-y-2">
            {examplePrompts.map((example, index) => (
              <button
                key={index}
                onClick={() => setCurrentPrompt(example)}
                disabled={isGenerating}
                className="w-full text-left p-3 text-sm bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50"
              >
                {example}
              </button>
            ))}
          </div>
        </div>

        {/* 选择艺术风格 */}
        <div className="card-panel">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">选择艺术风格</h3>
          <StyleSelector
            selectedStyle={selectedStyle}
            onStyleChange={setSelectedStyle}
          />
        </div>
      </div>

      {/* 右侧结果展示区域 - 65% */}
       <div className="flex-1 p-6 overflow-y-auto">
         <div className="mb-6">
           <h2 className="text-2xl font-semibold text-gray-900 mb-2">创作结果</h2>
           <p className="text-gray-600 text-sm">您的AI艺术作品将在这里展示</p>
         </div>
         
         {currentResult || isGenerating || history.length > 0 ? (
           <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
             {/* 当前生成的图片 */}
             {isGenerating && (
               <div className="card aspect-square flex items-center justify-center">
                  <div className="text-center">
                    <div className="w-8 h-8 border-3 border-purple-500/30 border-t-purple-500 rounded-full animate-spin mx-auto mb-3"></div>
                    <p className="text-gray-600 text-sm">AI正在创作中...</p>
                  </div>
                </div>
             )}
             
             {currentResult && (
               <div className="card group cursor-pointer hover:shadow-lg transition-all duration-200">
                 <div className="aspect-square rounded-lg overflow-hidden mb-3">
                   <img 
                     src={currentResult} 
                     alt="Generated artwork" 
                     className="w-full h-full object-cover"
                   />
                 </div>
                 <div className="flex space-x-2">
                   <button
                     onClick={() => handleDownload(currentResult, `generated-${Date.now()}.png`)}
                     className="btn-secondary flex-1 text-xs py-1.5"
                   >
                     💾 下载
                   </button>
                   <button
                     onClick={() => {
                       sessionStorage.setItem('continue-edit-image', currentResult);
                       window.location.href = '/editor';
                     }}
                     className="btn-secondary flex-1 text-xs py-1.5"
                   >
                     ✨ 编辑
                   </button>
                 </div>
               </div>
             )}
             
             {/* 历史记录网格 */}
             {history.slice(0, 15).map((item) => (
               <div key={item.id} className="card group cursor-pointer hover:shadow-lg transition-all duration-200">
                 <div className="aspect-square rounded-lg overflow-hidden mb-3">
                   <img 
                     src={item.imageUrl} 
                     alt="Historical artwork" 
                     className="w-full h-full object-cover"
                     onClick={() => handleImageSelect(item.imageUrl)}
                   />
                 </div>
                 <div className="flex space-x-2">
                   <button
                     onClick={() => handlePromptReuse(item.prompt)}
                     className="btn-ghost flex-1 text-xs py-1"
                   >
                     🔄 复用
                   </button>
                   <button
                     onClick={() => handleContinueEdit(item.imageUrl)}
                     className="btn-ghost flex-1 text-xs py-1"
                   >
                     ✏️ 编辑
                   </button>
                 </div>
               </div>
             ))}
           </div>
         ) : (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <div className="w-24 h-24 bg-gradient-to-br from-purple-500/10 to-pink-500/10 rounded-2xl mx-auto mb-6 flex items-center justify-center">
                  <span className="text-4xl">🎨</span>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">开始你的创作之旅</h3>
                <p className="text-gray-600">输入您的创意描述，让AI为您创造独一无二的艺术作品</p>
              </div>
            </div>
          )}
       </div>

      {/* 版本历史模态框 */}
      <VersionHistory
        currentImageUrl={currentResult || undefined}
        onVersionSelect={handleVersionSelect}
        onCompareVersions={handleCompareVersions}
        isVisible={showVersionHistory}
        onClose={() => setShowVersionHistory(false)}
      />

      {/* 快捷键帮助模态框 */}
      <KeyboardShortcutsHelp
        isVisible={showShortcutsHelp}
        onClose={() => setShowShortcutsHelp(false)}
      />
    </div>
  );
}