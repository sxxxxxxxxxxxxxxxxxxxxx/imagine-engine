'use client';

import { useState, KeyboardEvent, useEffect } from 'react';
import PromptLibrary from './PromptLibrary';

interface PromptInputProps {
  onGenerate: (prompt: string) => void;
  isGenerating: boolean;
  initialPrompt?: string;
  onPromptChange?: (prompt: string) => void;
}

export default function PromptInput({ onGenerate, isGenerating, initialPrompt, onPromptChange }: PromptInputProps) {
  const [prompt, setPrompt] = useState(initialPrompt || '');
  const [showPromptLibrary, setShowPromptLibrary] = useState(false);

  // 同步外部提示词变化
  useEffect(() => {
    if (initialPrompt !== undefined && initialPrompt !== prompt) {
      setPrompt(initialPrompt);
    }
  }, [initialPrompt]);

  // 处理提示词变化
  const handlePromptChange = (newPrompt: string) => {
    setPrompt(newPrompt);
    onPromptChange?.(newPrompt);
  };

  const handleSubmit = () => {
    if (prompt.trim() && !isGenerating) {
      onGenerate(prompt);
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  // 处理提示词库选择
  const handlePromptLibrarySelect = (selectedPrompt: string) => {
    handlePromptChange(selectedPrompt);
    setShowPromptLibrary(false);
  };



  return (
    <div className="space-y-4">
      {/* 紧凑的提示词输入框 */}
      <div className="relative">
        <textarea
          value={prompt}
          onChange={(e) => handlePromptChange(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="描述你的创意想法..."
          className="w-full px-4 py-3 border border-gray-200 rounded-lg resize-none h-24 text-sm
                   focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500 
                   transition-all duration-200 placeholder-gray-500"
          disabled={isGenerating}
        />
        
        {/* 状态指示器 */}
        <div className="absolute bottom-2 right-2">
          <div className={`text-xs px-2 py-1 rounded transition-colors ${
            prompt.length > 400 ? 'bg-red-100 text-red-600' :
            prompt.length > 200 ? 'bg-yellow-100 text-yellow-600' :
            'bg-gray-100 text-gray-600'
          }`}>
            {prompt.length}/500
          </div>
        </div>
      </div>

      {/* 操作按钮 */}
      <div className="flex gap-2">
        <button
          onClick={() => setShowPromptLibrary(true)}
          disabled={isGenerating}
          className="btn-secondary flex-1 text-sm py-2"
        >
          📚 提示词库
        </button>
        
        <button
          onClick={handleSubmit}
          disabled={!prompt.trim() || isGenerating}
          className="btn-primary flex-1 text-sm py-3"
        >
          {isGenerating ? (
            <div className="flex items-center justify-center space-x-2">
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              <span>创作中...</span>
            </div>
          ) : (
            <div className="flex items-center justify-center space-x-2">
              <span>🎨</span>
              <span className="font-semibold">开始创作</span>
            </div>
          )}
        </button>
      </div>



      {/* 提示词库模态框 */}
      {showPromptLibrary && (
        <PromptLibrary
          onPromptSelect={handlePromptLibrarySelect}
          onClose={() => setShowPromptLibrary(false)}
        />
      )}
    </div>
  );
}