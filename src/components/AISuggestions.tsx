'use client';

import { useState, useEffect } from 'react';

interface AISuggestionsProps {
  imageUrl?: string;
  onSuggestionSelect: (suggestion: Suggestion) => void;
  isVisible: boolean;
}

interface Suggestion {
  id: string;
  title: string;
  description: string;
  prompt: string;
  category: 'filter' | 'edit' | 'style' | 'enhance';
  emoji: string;
  confidence: number;
}

export default function AISuggestions({ imageUrl, onSuggestionSelect, isVisible }: AISuggestionsProps) {
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  // 模拟AI分析图片并生成建议
  const analyzeImage = async (url: string) => {
    setIsAnalyzing(true);
    
    // 模拟分析延迟
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // 基于图片类型生成智能建议
    const intelligentSuggestions: Suggestion[] = [
      {
        id: '1',
        title: '动漫风格转换',
        description: '将图片转换为日式动漫风格，色彩鲜艳',
        prompt: '将这张图片转换为日式动漫风格，色彩鲜艳，二次元画风',
        category: 'style',
        emoji: '🎨',
        confidence: 0.92
      },
      {
        id: '2',
        title: '背景虚化',
        description: '模糊背景突出主体，营造景深效果',
        prompt: '对背景进行虚化处理，突出主体，营造景深效果',
        category: 'enhance',
        emoji: '📸',
        confidence: 0.88
      },
      {
        id: '3',
        title: '复古滤镜',
        description: '添加复古胶片效果，怀旧色调',
        prompt: '添加复古胶片滤镜效果，怀旧色调，颗粒质感',
        category: 'filter',
        emoji: '📷',
        confidence: 0.85
      },
      {
        id: '4',
        title: '光影增强',
        description: '增强光影对比，提升立体感',
        prompt: '增强图片的光影对比度，提升立体感和层次感',
        category: 'enhance',
        emoji: '✨',
        confidence: 0.90
      },
      {
        id: '5',
        title: '水彩画风格',
        description: '转换为水彩画风格，柔和朦胧',
        prompt: '将图片转换为水彩画风格，柔和朦胧，艺术感强',
        category: 'style',
        emoji: '🎭',
        confidence: 0.83
      },
      {
        id: '6',
        title: '移除背景',
        description: '智能移除背景，生成透明图片',
        prompt: '智能识别并移除图片背景，生成透明背景图片',
        category: 'edit',
        emoji: '✂️',
        confidence: 0.95
      },
      {
        id: '7',
        title: '赛博朋克风格',
        description: '添加未来科技感，霓虹色彩',
        prompt: '转换为赛博朋克风格，未来科技感，霓虹色彩，电子元素',
        category: 'style',
        emoji: '🌃',
        confidence: 0.78
      },
      {
        id: '8',
        title: '细节增强',
        description: '提升图片清晰度和细节表现',
        prompt: '增强图片细节，提升清晰度和锐度，保持自然效果',
        category: 'enhance',
        emoji: '🔍',
        confidence: 0.87
      }
    ];

    // 随机选择4-6个建议，模拟AI智能分析
    const selectedSuggestions = intelligentSuggestions
      .sort(() => Math.random() - 0.5)
      .slice(0, Math.floor(Math.random() * 3) + 4)
      .sort((a, b) => b.confidence - a.confidence);

    setSuggestions(selectedSuggestions);
    setIsAnalyzing(false);
  };

  // 当图片URL变化时重新分析
  useEffect(() => {
    if (imageUrl && isVisible) {
      analyzeImage(imageUrl);
    }
  }, [imageUrl, isVisible]);

  // 获取分类颜色
  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'filter': return 'from-purple-400 to-pink-500';
      case 'edit': return 'from-green-400 to-blue-500';
      case 'style': return 'from-orange-400 to-red-500';
      case 'enhance': return 'from-blue-400 to-indigo-500';
      default: return 'from-gray-400 to-gray-500';
    }
  };

  // 获取分类名称
  const getCategoryName = (category: string) => {
    switch (category) {
      case 'filter': return '滤镜';
      case 'edit': return '编辑';
      case 'style': return '风格';
      case 'enhance': return '增强';
      default: return '其他';
    }
  };

  if (!isVisible) return null;

  return (
    <div className="card">
      <div className="flex items-center space-x-2 mb-4">
        <div className="text-2xl">🤖</div>
        <div>
          <h3 className="text-lg font-semibold">AI灵感建议</h3>
          <p className="text-sm text-gray-600">
            {isAnalyzing ? '正在分析图片...' : `为您推荐 ${suggestions.length} 个编辑建议`}
          </p>
        </div>
      </div>

      {isAnalyzing ? (
        <div className="space-y-3">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="animate-pulse">
              <div className="flex items-center space-x-3 p-3 bg-gray-100 rounded-lg">
                <div className="w-8 h-8 bg-gray-300 rounded"></div>
                <div className="flex-1">
                  <div className="h-4 bg-gray-300 rounded w-3/4 mb-2"></div>
                  <div className="h-3 bg-gray-300 rounded w-1/2"></div>
                </div>
                <div className="w-16 h-6 bg-gray-300 rounded"></div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="space-y-3 max-h-80 overflow-y-auto scrollbar-thin">
          {suggestions.map((suggestion) => (
            <div
              key={suggestion.id}
              className="group cursor-pointer p-3 border border-gray-200 rounded-lg hover:border-gray-300 hover:shadow-md transition-all duration-200"
              onClick={() => onSuggestionSelect(suggestion)}
            >
              <div className="flex items-start space-x-3">
                {/* 图标和置信度 */}
                <div className="flex-shrink-0">
                  <div className={`
                    w-10 h-10 rounded-lg bg-gradient-to-br ${getCategoryColor(suggestion.category)}
                    flex items-center justify-center text-white text-lg
                  `}>
                    {suggestion.emoji}
                  </div>
                </div>

                {/* 内容 */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-2 mb-1">
                    <h4 className="font-medium text-gray-900 group-hover:text-primary-600 transition-colors">
                      {suggestion.title}
                    </h4>
                    <span className={`
                      text-xs px-2 py-1 rounded-full
                      ${suggestion.category === 'filter' ? 'bg-purple-100 text-purple-700' :
                        suggestion.category === 'edit' ? 'bg-green-100 text-green-700' :
                        suggestion.category === 'style' ? 'bg-orange-100 text-orange-700' :
                        'bg-blue-100 text-blue-700'}
                    `}>
                      {getCategoryName(suggestion.category)}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mb-2">
                    {suggestion.description}
                  </p>
                  
                  {/* 置信度条 */}
                  <div className="flex items-center space-x-2">
                    <span className="text-xs text-gray-500">推荐度:</span>
                    <div className="flex-1 bg-gray-200 rounded-full h-1.5">
                      <div 
                        className="bg-gradient-to-r from-green-400 to-blue-500 h-1.5 rounded-full transition-all duration-300"
                        style={{ width: `${suggestion.confidence * 100}%` }}
                      ></div>
                    </div>
                    <span className="text-xs font-medium text-gray-700">
                      {Math.round(suggestion.confidence * 100)}%
                    </span>
                  </div>
                </div>

                {/* 箭头 */}
                <div className="flex-shrink-0 text-gray-400 group-hover:text-primary-500 transition-colors">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* 底部说明 */}
      {!isAnalyzing && suggestions.length > 0 && (
        <div className="mt-4 pt-4 border-t border-gray-200">
          <p className="text-xs text-gray-500 text-center">
            💡 AI根据图片内容智能推荐，点击应用建议
          </p>
        </div>
      )}
    </div>
  );
}