'use client';

import { useState, useEffect } from 'react';
import ImageUploader from './ImageUploader';
import Toolbox from './Toolbox';
import MaskCanvas from './MaskCanvas';
import ClickEditCanvas from './ClickEditCanvas';
import AISuggestions from './AISuggestions';
import FiltersAndTextures from './FiltersAndTextures';

export default function EditorInterface() {
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [editedImage, setEditedImage] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedTool, setSelectedTool] = useState<'inpaint' | 'remove_bg' | 'click_edit' | null>(null);
  const [brushSize, setBrushSize] = useState(20);
  const [maskData, setMaskData] = useState<string | null>(null);
  const [showAISuggestions, setShowAISuggestions] = useState(false);

  // 检查是否有继续编辑的图片
  useEffect(() => {
    const continueEditImage = sessionStorage.getItem('continue-edit-image');
    if (continueEditImage) {
      setUploadedImage(continueEditImage);
      sessionStorage.removeItem('continue-edit-image');
      // 显示提示
      setTimeout(() => {
        alert('已加载图片，可以开始编辑了！');
      }, 500);
    }
  }, []);

  // 处理图片上传
  const handleImageUpload = (imageDataUrl: string) => {
    setUploadedImage(imageDataUrl);
    setEditedImage(null);
    setError(null);
    setSelectedTool(null);
    setMaskData(null);
  };

  // 处理图片编辑
  const handleEdit = async (
    tool: 'inpaint' | 'remove_bg' | 'click_edit', 
    mask?: string, 
    x?: number, 
    y?: number, 
    instruction?: string
  ) => {
    if (!uploadedImage) {
      setError('请先上传图片');
      return;
    }

    setIsEditing(true);
    setError(null);

    try {
      // 提取base64数据（移除data:image/...;base64,前缀）
      const base64Data = uploadedImage.split(',')[1];
      const maskData = mask ? mask.split(',')[1] : undefined;

      console.log('开始图片编辑:', { tool, imageSize: base64Data.length, x, y, instruction });

      const response = await fetch('/api/edit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          tool,
          image: base64Data,
          mask: maskData,
          x,
          y,
          instruction,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || '编辑失败');
      }

      if (data.imageUrl) {
        setEditedImage(data.imageUrl);
        setShowAISuggestions(true); // 编辑完成后显示AI建议
        console.log('图片编辑成功:', {
          needsResize: data.needsResize,
          backendResized: data.backendResized
        });
      } else {
        throw new Error('API未返回有效的图片URL');
      }
    } catch (error) {
      console.error('Edit error:', error);
      setError(error instanceof Error ? error.message : '编辑图片时发生错误');
    } finally {
      setIsEditing(false);
    }
  };

  // 处理点击编辑
  const handleClickEdit = (x: number, y: number, instruction: string) => {
    handleEdit('click_edit', undefined, x, y, instruction);
  };

  // 处理AI建议选择
  const handleSuggestionSelect = (suggestion: any) => {
    // 将AI建议转换为编辑操作
    handleEdit('click_edit', undefined, undefined, undefined, suggestion.prompt);
  };

  // 处理滤镜和纹理应用
  const handleFilterTextureApply = (type: 'filter' | 'texture', effect: string, prompt: string) => {
    handleEdit('click_edit', undefined, undefined, undefined, prompt);
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
      console.error('下载失败:', error);
      alert('下载失败，请重试');
    }
  };

  // 重置编辑器
  const handleReset = () => {
    setUploadedImage(null);
    setEditedImage(null);
    setError(null);
    setSelectedTool(null);
    setMaskData(null);
    setShowAISuggestions(false);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* 左侧：图片上传和工具 */}
      <div className="space-y-6">
        {/* 图片上传 */}
        <div className="card">
          <h2 className="text-xl font-semibold mb-4">上传图片</h2>
          <ImageUploader onImageUpload={handleImageUpload} />
          {error && (
            <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-700 text-sm">{error}</p>
            </div>
          )}
        </div>

        {/* 工具箱 */}
        {uploadedImage && (
          <div className="card">
            <h2 className="text-xl font-semibold mb-4">编辑工具</h2>
            <Toolbox
              onEdit={handleEdit}
              isEditing={isEditing}
              hasImage={!!uploadedImage}
              onToolSelect={setSelectedTool}
              selectedTool={selectedTool}
              brushSize={brushSize}
              onBrushSizeChange={setBrushSize}
              onMaskChange={setMaskData}
            />
          </div>
        )}

        {/* AI灵感建议 */}
        {uploadedImage && (
          <AISuggestions
            imageUrl={editedImage || uploadedImage}
            onSuggestionSelect={handleSuggestionSelect}
            isVisible={showAISuggestions || !!editedImage}
          />
        )}

        {/* 创意滤镜和纹理 */}
        {uploadedImage && (
          <FiltersAndTextures
            onApply={handleFilterTextureApply}
            isProcessing={isEditing}
            hasImage={!!uploadedImage}
          />
        )}

        {/* 重置按钮 */}
        {uploadedImage && (
          <button
            onClick={handleReset}
            className="btn-secondary w-full"
          >
            🔄 重新开始
          </button>
        )}
      </div>

      {/* 右侧：图片预览和结果 */}
      <div className="space-y-6">
        {/* 原图预览 */}
        {uploadedImage && (
          <div className="card">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">
                {selectedTool === 'inpaint' ? '绘制遮罩区域' : '原图'}
              </h3>
              <button
                onClick={() => handleDownload(uploadedImage, `original-${Date.now()}.png`)}
                className="text-sm text-gray-500 hover:text-primary-600 transition-colors"
              >
                下载原图
              </button>
            </div>
            
            {selectedTool === 'inpaint' ? (
              // 橡皮擦模式：显示遮罩画布
              <MaskCanvas
                imageUrl={uploadedImage}
                onMaskChange={setMaskData}
                brushSize={brushSize}
                isActive={selectedTool === 'inpaint' && !isEditing}
              />
            ) : selectedTool === 'click_edit' ? (
              // 点击编辑模式：显示点击编辑画布
              <ClickEditCanvas
                imageUrl={uploadedImage}
                onEdit={handleClickEdit}
                isEditing={isEditing}
                isActive={selectedTool === 'click_edit' && !isEditing}
              />
            ) : (
              // 普通模式：显示原图
              <div className="image-container aspect-square">
                <img
                  src={uploadedImage}
                  alt="上传的图片"
                  className="w-full h-full object-cover"
                />
              </div>
            )}
          </div>
        )}

        {/* 编辑结果 */}
        {(editedImage || isEditing) && (
          <div className="card">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">编辑结果</h3>
              {editedImage && (
                <button
                  onClick={() => handleDownload(editedImage, `edited-${Date.now()}.png`)}
                  className="text-sm text-gray-500 hover:text-primary-600 transition-colors"
                >
                  下载结果
                </button>
              )}
            </div>
            
            <div className="image-container aspect-square">
              {isEditing ? (
                <div className="flex flex-col items-center justify-center h-full space-y-4">
                  <div className="loading-spinner w-12 h-12"></div>
                  <div className="text-center">
                    <p className="text-lg font-medium text-gray-700">AI正在处理中...</p>
                    <p className="text-sm text-gray-500 mt-1">请稍候，这可能需要一些时间</p>
                  </div>
                </div>
              ) : editedImage ? (
                <img
                  src={editedImage}
                  alt="编辑后的图片"
                  className="w-full h-full object-cover"
                />
              ) : null}
            </div>
          </div>
        )}

        {/* 使用提示 */}
        {!uploadedImage && (
          <div className="card text-center">
            <div className="text-6xl mb-4">📸</div>
            <h3 className="text-lg font-semibold mb-2">开始编辑</h3>
            <p className="text-gray-600 mb-4">
              上传一张图片，使用AI工具进行智能编辑
            </p>
            <div className="text-sm text-gray-500 space-y-1">
              <p>🎯 支持橡皮擦工具，精确移除不需要的内容</p>
              <p>🌟 支持背景替换，一键更换图片背景</p>
              <p>📱 支持多种图片格式：JPG、PNG、WebP</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}