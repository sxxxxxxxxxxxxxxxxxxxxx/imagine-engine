'use client';

import { useState, KeyboardEvent, useEffect, useRef } from 'react';
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
  const [isFocused, setIsFocused] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

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
    if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
      e.preventDefault();
      handleSubmit();
    }
  };

  // 处理提示词库选择
  const handlePromptLibrarySelect = (selectedPrompt: string) => {
    handlePromptChange(selectedPrompt);
    setShowPromptLibrary(false);
    textareaRef.current?.focus();
  };



  return (
    <div className="space-y-3">
      {/* 优化的提示词输入框 */}
      <div className="relative group">
        <textarea
          ref={textareaRef}
          value={prompt}
          onChange={(e) => handlePromptChange(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder="描述你的创意想法... (Ctrl+Enter 快速生成)"
          className={`w-full px-4 py-3 border-2 rounded-xl resize-none h-28 text-sm
                   transition-all duration-200 placeholder-gray-400
                   focus:outline-none
                   ${isFocused 
                     ? 'border-purple-500 bg-purple-50/30 shadow-lg' 
                     : 'border-gray-200 bg-white hover:border-gray-300'
                   }
                   ${isGenerating ? 'opacity-60 cursor-wait' : ''}`}
          disabled={isGenerating}
          maxLength={500}
        />
        
        {/* 智能字数统计 */}
        <div className="absolute bottom-3 right-3">
          <div className={`text-xs px-2.5 py-1 rounded-full font-medium transition-all ${
            prompt.length > 450 ? 'bg-red-100 text-red-600 animate-pulse' :
            prompt.length > 300 ? 'bg-yellow-100 text-yellow-700' :
            prompt.length > 100 ? 'bg-blue-100 text-blue-600' :
            'bg-gray-100 text-gray-500'
          }`}>
            {prompt.length}/500
          </div>
        </div>

        {/* Focus 指示器 */}
        {isFocused && (
          <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-20 h-1 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full" />
        )}
      </div>

      {/* 快捷操作按钮组 */}
      <div className="flex gap-2">
        <button
          onClick={() => setShowPromptLibrary(true)}
          disabled={isGenerating}
          className="flex-1 px-4 py-2.5 rounded-lg text-sm font-medium
                   bg-white border-2 border-gray-200 hover:border-purple-400 hover:bg-purple-50
                   transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed
                   flex items-center justify-center gap-2"
        >
          <span>📚</span>
          <span>提示词库</span>
        </button>
        
        <button
          onClick={handleSubmit}
          disabled={!prompt.trim() || isGenerating}
          className="flex-[2] px-4 py-2.5 rounded-lg text-sm font-semibold
                   bg-gradient-to-r from-purple-500 to-pink-500 text-white
                   hover:from-purple-600 hover:to-pink-600 
                   shadow-md hover:shadow-lg active:scale-95
                   transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed
                   flex items-center justify-center gap-2"
        >
          {isGenerating ? (
            <>
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              <span>AI 创作中...</span>
            </>
          ) : (
            <>
              <span>✨</span>
              <span>开始创作</span>
            </>
          )}
        </button>
      </div>

      {/* 快捷键提示 */}
      {!isGenerating && prompt.length > 10 && (
        <div className="flex items-center justify-center gap-2 text-xs text-gray-400">
          <kbd className="px-2 py-1 bg-gray-100 rounded border border-gray-200">Ctrl</kbd>
          <span>+</span>
          <kbd className="px-2 py-1 bg-gray-100 rounded border border-gray-200">Enter</kbd>
          <span>快速生成</span>
        </div>
      )}

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