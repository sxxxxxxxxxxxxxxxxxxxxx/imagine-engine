'use client';

import { useState, useRef, DragEvent, ChangeEvent } from 'react';

interface ImageUploaderProps {
  onImageUpload: (imageDataUrl: string) => void;
}

export default function ImageUploader({ onImageUpload }: ImageUploaderProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // 验证文件类型
  const isValidImageFile = (file: File): boolean => {
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    return validTypes.includes(file.type);
  };

  // 验证文件大小（最大10MB）
  const isValidFileSize = (file: File): boolean => {
    const maxSize = 10 * 1024 * 1024; // 10MB
    return file.size <= maxSize;
  };

  // 处理文件上传
  const handleFile = (file: File) => {
    if (!isValidImageFile(file)) {
      alert('请上传有效的图片文件（JPG、PNG、WebP）');
      return;
    }

    if (!isValidFileSize(file)) {
      alert('文件大小不能超过10MB');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      setPreview(result);
      onImageUpload(result);
    };
    reader.readAsDataURL(file);
  };

  // 拖拽事件处理
  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);

    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      handleFile(files[0]);
    }
  };

  // 文件选择事件处理
  const handleFileSelect = (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFile(files[0]);
    }
  };

  // 点击上传区域
  const handleClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="space-y-4">
      {/* 上传区域 */}
      <div
        className={`drag-area ${isDragging ? 'drag-over' : ''}`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={handleClick}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/jpg,image/png,image/webp"
          onChange={handleFileSelect}
          className="hidden"
        />
        
        {preview ? (
          <div className="space-y-4">
            <img
              src={preview}
              alt="预览图片"
              className="max-w-full max-h-64 mx-auto rounded-lg"
            />
            <p className="text-sm text-gray-600">
              点击重新选择图片，或拖拽新图片到此区域
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="text-6xl">📸</div>
            <div>
              <p className="text-lg font-medium text-gray-700 mb-2">
                上传图片开始编辑
              </p>
              <p className="text-sm text-gray-500">
                点击选择文件或拖拽图片到此区域
              </p>
            </div>
            <div className="text-xs text-gray-400 space-y-1">
              <p>支持格式：JPG、PNG、WebP</p>
              <p>文件大小：最大10MB</p>
            </div>
          </div>
        )}
      </div>

      {/* 上传提示 */}
      {!preview && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-start space-x-3">
            <div className="text-blue-500 text-xl">💡</div>
            <div className="text-sm text-blue-700">
              <p className="font-medium mb-1">编辑提示：</p>
              <ul className="space-y-1 text-xs">
                <li>• 选择清晰、高质量的图片效果更佳</li>
                <li>• 橡皮擦工具可以精确移除不需要的内容</li>
                <li>• 背景替换功能可以一键更换图片背景</li>
                <li>• 处理时间根据图片复杂度而定，通常需要几秒钟</li>
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}