'use client';

import { useState } from 'react';

interface ToolboxProps {
  onEdit: (tool: 'inpaint' | 'remove_bg' | 'click_edit', mask?: string, x?: number, y?: number, instruction?: string) => void;
  isEditing: boolean;
  hasImage: boolean;
  onToolSelect?: (tool: 'inpaint' | 'remove_bg' | 'click_edit' | null) => void;
  selectedTool?: 'inpaint' | 'remove_bg' | 'click_edit' | null;
  brushSize?: number;
  onBrushSizeChange?: (size: number) => void;
  onMaskChange?: (mask: string | null) => void;
}

export default function Toolbox({ 
  onEdit, 
  isEditing, 
  hasImage, 
  onToolSelect,
  selectedTool: externalSelectedTool,
  brushSize: externalBrushSize,
  onBrushSizeChange,
  onMaskChange: externalOnMaskChange
}: ToolboxProps) {
  const [internalSelectedTool, setInternalSelectedTool] = useState<'inpaint' | 'remove_bg' | null>(null);
  const [internalBrushSize, setInternalBrushSize] = useState(20);
  const [maskData, setMaskData] = useState<string | null>(null);

  // 使用外部状态或内部状态
  const selectedTool = externalSelectedTool !== undefined ? externalSelectedTool : internalSelectedTool;
  const brushSize = externalBrushSize !== undefined ? externalBrushSize : internalBrushSize;

  const tools = [
    {
      id: 'remove_bg' as const,
      name: '移除背景',
      description: '智能识别并移除图片背景',
      emoji: '🌟',
      color: 'from-green-500 to-emerald-600',
      disabled: false,
      needsMask: false,
    },
    {
      id: 'inpaint' as const,
      name: '橡皮擦',
      description: '精确移除图片中的特定内容',
      emoji: '🧽',
      color: 'from-red-500 to-pink-600',
      disabled: false,
      needsMask: true,
    },
    {
      id: 'click_edit' as const,
      name: '点击编辑',
      description: '点击图片任意位置进行精确编辑',
      emoji: '🎯',
      color: 'from-blue-500 to-purple-600',
      disabled: false,
      needsMask: false,
    },
  ];

  const handleToolClick = (toolId: 'inpaint' | 'remove_bg' | 'click_edit') => {
    if (!hasImage || isEditing) return;

    const tool = tools.find(t => t.id === toolId);
    if (!tool) return;

    if (selectedTool === toolId) {
      // 如果点击的是已选中的工具，取消选择
      if (externalSelectedTool !== undefined) {
        onToolSelect?.(null);
      } else {
        setInternalSelectedTool(null);
      }
    } else {
      // 选择新工具
      if (externalSelectedTool !== undefined) {
        onToolSelect?.(toolId);
      } else {
        setInternalSelectedTool(toolId);
      }
      
      if (toolId === 'remove_bg') {
        // 背景移除不需要遮罩，直接执行
        onEdit(toolId);
        // 执行后取消选择
        if (externalSelectedTool !== undefined) {
          onToolSelect?.(null);
        } else {
          setInternalSelectedTool(null);
        }
      }
      // 橡皮擦工具和点击编辑工具需要等待用户操作
    }
  };

  // 执行橡皮擦操作
  const handleInpaintExecute = () => {
    if (selectedTool === 'inpaint' && maskData) {
      onEdit('inpaint', maskData);
      // 执行后取消选择
      if (externalSelectedTool !== undefined) {
        onToolSelect?.(null);
      } else {
        setInternalSelectedTool(null);
      }
      setMaskData(null);
    }
  };

  // 处理遮罩变化
  const handleMaskChange = (mask: string | null) => {
    setMaskData(mask);
    externalOnMaskChange?.(mask);
  };

  // 处理画笔大小变化
  const handleBrushSizeChange = (size: number) => {
    if (onBrushSizeChange) {
      onBrushSizeChange(size);
    } else {
      setInternalBrushSize(size);
    }
  };

  return (
    <div className="space-y-4">
      {/* 工具列表 */}
      <div className="grid grid-cols-1 gap-3">
        {tools.map((tool) => (
          <button
            key={tool.id}
            onClick={() => handleToolClick(tool.id)}
            disabled={!hasImage || isEditing}
            className={`
              relative p-4 rounded-lg border-2 transition-all duration-200 text-left
              ${selectedTool === tool.id && !isEditing
                ? 'border-primary-500 bg-primary-50 shadow-glow'
                : selectedTool === tool.id && isEditing
                ? 'border-primary-500 bg-primary-50'
                : !hasImage || isEditing
                ? 'border-gray-200 bg-gray-50 opacity-50 cursor-not-allowed'
                : 'border-gray-200 bg-white hover:border-gray-300 hover:shadow-md cursor-pointer'
              }
            `}
          >
            {/* 背景渐变 */}
            <div className={`
              absolute inset-0 bg-gradient-to-br ${tool.color} opacity-10 rounded-lg
              ${selectedTool === tool.id && isEditing ? 'opacity-20' : ''}
            `} />
            
            {/* 内容 */}
            <div className="relative z-10">
              <div className="flex items-center space-x-3 mb-2">
                <span className="text-2xl">{tool.emoji}</span>
                <div>
                  <span className="font-medium text-gray-900">{tool.name}</span>
                  {selectedTool === tool.id && !isEditing && (
                    <span className="ml-2 text-xs bg-primary-100 text-primary-700 px-2 py-1 rounded">
                      已选中
                    </span>
                  )}
                </div>
              </div>
              <p className="text-sm text-gray-600">{tool.description}</p>
            </div>

            {/* 处理中指示器 */}
            {selectedTool === tool.id && isEditing && (
              <div className="absolute top-2 right-2">
                <div className="loading-spinner w-4 h-4"></div>
              </div>
            )}
          </button>
        ))}
      </div>

      {/* 橡皮擦工具控制 */}
      {selectedTool === 'inpaint' && !isEditing && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 space-y-4">
          <h4 className="font-medium text-blue-900">橡皮擦设置</h4>
          
          {/* 画笔大小控制 */}
          <div>
            <label className="block text-sm font-medium text-blue-800 mb-2">
              画笔大小: {brushSize}px
            </label>
            <input
               type="range"
               min="5"
               max="50"
               value={brushSize}
               onChange={(e) => handleBrushSizeChange(Number(e.target.value))}
               className="w-full h-2 bg-blue-200 rounded-lg appearance-none cursor-pointer"
             />
            <div className="flex justify-between text-xs text-blue-600 mt-1">
              <span>精细 (5px)</span>
              <span>粗糙 (50px)</span>
            </div>
          </div>

          {/* 执行按钮 */}
          <button
            onClick={handleInpaintExecute}
            disabled={!maskData}
            className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {maskData ? '🚀 开始处理' : '请先绘制遮罩区域'}
          </button>
        </div>
      )}

      {/* 工具说明 */}
      <div className="bg-gray-50 rounded-lg p-4">
        <h4 className="font-medium text-gray-900 mb-2">使用说明</h4>
        <div className="text-sm text-gray-600 space-y-1">
          <p>🌟 <strong>移除背景</strong>：自动识别主体，移除背景，生成透明背景图片</p>
          <p>🧽 <strong>橡皮擦</strong>：手动绘制遮罩，精确移除指定区域的内容</p>
          <p>🎯 <strong>点击编辑</strong>：点击图片任意位置，通过文字指令进行精确编辑</p>
        </div>
      </div>

      {/* 处理状态 */}
      {isEditing && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-center space-x-3">
            <div className="loading-spinner w-5 h-5"></div>
            <div>
              <p className="font-medium text-blue-900">AI正在处理图片...</p>
              <p className="text-sm text-blue-700">请耐心等待，处理时间根据图片复杂度而定</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}