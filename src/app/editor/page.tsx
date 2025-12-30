'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';

export default function EditorPage() {
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [editedImage, setEditedImage] = useState<string | null>(null);
  const [selectedTool, setSelectedTool] = useState<'remove_bg' | 'inpaint' | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [brushSize, setBrushSize] = useState(20);
  const [isDrawing, setIsDrawing] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const maskCanvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // 从 sessionStorage 加载图片（从创作页面跳转过来）
  useEffect(() => {
    const savedImage = sessionStorage.getItem('edit-image');
    if (savedImage) {
      setUploadedImage(savedImage);
      sessionStorage.removeItem('edit-image');
    }
  }, []);

  // 上传图片
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processImageFile(file);
    }
  };

  // 处理图片文件
  const processImageFile = (file: File) => {
    if (!file.type.startsWith('image/')) {
      setError('请上传有效的图片文件');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      setUploadedImage(e.target?.result as string);
      setEditedImage(null);
      setError(null);
    };
    reader.readAsDataURL(file);
  };

  // 拖拽上传
  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const files = e.dataTransfer.files;
    if (files && files[0]) {
      processImageFile(files[0]);
    }
  };

  // 加载图片到画布
  useEffect(() => {
    if (uploadedImage && canvasRef.current) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      const img = new Image();
      img.onload = () => {
        canvas.width = img.width;
        canvas.height = img.height;
        ctx.drawImage(img, 0, 0);

        // 初始化遮罩画布
        if (maskCanvasRef.current) {
          const maskCanvas = maskCanvasRef.current;
          maskCanvas.width = img.width;
          maskCanvas.height = img.height;
        }
      };
      img.src = uploadedImage;
    }
  }, [uploadedImage]);

  // 画布绘制
  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (selectedTool !== 'inpaint' || !maskCanvasRef.current) return;
    setIsDrawing(true);
    draw(e);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing || selectedTool !== 'inpaint' || !maskCanvasRef.current) return;

    const canvas = maskCanvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const x = (e.clientX - rect.left) * (canvas.width / rect.width);
    const y = (e.clientY - rect.top) * (canvas.height / rect.height);

    ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
    ctx.beginPath();
    ctx.arc(x, y, brushSize, 0, Math.PI * 2);
    ctx.fill();
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  // 清除遮罩
  const clearMask = () => {
    if (maskCanvasRef.current) {
      const canvas = maskCanvasRef.current;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
      }
    }
  };

  // 处理图片编辑
  const handleEdit = async () => {
    if (!uploadedImage) {
      setError('请先上传图片');
      return;
    }

    if (!selectedTool) {
      setError('请选择编辑工具');
      return;
    }

    setIsProcessing(true);
    setError(null);

    try {
      // 获取图片的 base64 数据（去掉 data URL 前缀）
      const imageBase64 = uploadedImage.split(',')[1];

      // 获取遮罩数据（如果是 inpaint 工具）
      let maskBase64 = '';
      if (selectedTool === 'inpaint' && maskCanvasRef.current) {
        const maskDataUrl = maskCanvasRef.current.toDataURL('image/png');
        maskBase64 = maskDataUrl.split(',')[1];
      }

      const response = await fetch('/api/edit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tool: selectedTool,
          image: imageBase64,
          mask: maskBase64 || undefined
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || '编辑失败');
      }

      if (data.imageUrl) {
        setEditedImage(data.imageUrl);
        clearMask();
      } else {
        throw new Error('未返回编辑后的图片');
      }
    } catch (err) {
      console.error('Edit error:', err);
      setError(err instanceof Error ? err.message : '编辑失败，请重试');
    } finally {
      setIsProcessing(false);
    }
  };

  // 下载图片
  const handleDownload = async (imageUrl: string) => {
    try {
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `edited-${Date.now()}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Download failed:', error);
      window.open(imageUrl, '_blank');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-cyan-50 to-purple-50">
      {/* 导航栏 */}
      <nav className="bg-white/80 backdrop-blur-md border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="flex items-center space-x-2 hover:opacity-80 transition-opacity">
              <span className="text-2xl">🎨</span>
              <h1 className="text-xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                创想引擎
              </h1>
            </Link>
            <div className="flex space-x-4">
              <Link href="/create" className="px-4 py-2 text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors">
                AI 创作
              </Link>
              <Link href="/editor" className="px-4 py-2 text-blue-600 font-medium rounded-lg bg-blue-50">
                图片编辑
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* 主内容 */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <div className="grid md:grid-cols-3 gap-4">
            <div className="md:col-span-2">
              <div className="bg-white rounded-2xl p-4 shadow-lg flex items-center justify-between">
                <div>
                  <div className="text-lg font-bold text-gray-900">不用学 PS，也能 60 秒高质量修图</div>
                  <div className="text-sm text-gray-600">证件照、去背景、局部擦除，一键出图｜每月 20 张免费</div>
                </div>
                <div className="flex items-center space-x-3">
                  <Link href="/create" className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg">现在试用</Link>
                  <Link href="/pricing" className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-900 font-semibold rounded-lg">按次购买</Link>
                  <Link href="/pricing" className="text-sm text-blue-600 hover:underline">查看订阅对比</Link>
                </div>
              </div>
            </div>
            <div className="hidden md:block">
              <div className="bg-white rounded-2xl p-4 shadow-lg text-center">
                <div className="text-2xl font-bold text-gray-900">20</div>
                <div className="text-xs text-gray-600">每月免费张数</div>
              </div>
            </div>
          </div>
        </div>
        <div className="grid lg:grid-cols-3 gap-8">
          {/* 左侧控制面板 */}
          <div className="lg:col-span-1 space-y-6">
            {/* 标题 */}
            <div className="bg-white rounded-2xl p-6 shadow-lg">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">🎭 图片编辑</h2>
              <p className="text-gray-600 text-sm">智能抠图、背景移除、精确橡皮擦</p>
            </div>

          {/* 上传图片 */}
            <div className="bg-white rounded-2xl p-6 shadow-lg">
              <label className="block text-sm font-semibold text-gray-900 mb-3">上传图片</label>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                className="hidden"
              />
              <div
                onDragEnter={handleDragEnter}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`w-full py-6 px-4 border-2 border-dashed rounded-xl transition-all cursor-pointer ${
                  isDragging
                    ? 'border-blue-500 bg-blue-50 scale-105'
                    : 'border-gray-300 hover:border-blue-500 hover:bg-blue-50'
                }`}
              >
                <div className="text-center">
                  <div className="text-4xl mb-3">{isDragging ? '📥' : '📁'}</div>
                  <div className="text-sm font-medium text-gray-700 mb-1">
                    {isDragging ? '松开鼠标上传图片' : '点击或拖拽图片到这里'}
                  </div>
                  <div className="text-xs text-gray-500">支持 JPG、PNG、WEBP 格式</div>
                </div>
              </div>
          </div>

          {/* 编辑工具 */}
            <div className="bg-white rounded-2xl p-6 shadow-lg">
              <label className="block text-sm font-semibold text-gray-900 mb-3">选择编辑工具</label>
              <div className="space-y-3">
                <button
                  onClick={() => setSelectedTool('remove_bg')}
                  disabled={!uploadedImage || isProcessing}
                  className={`w-full p-4 rounded-xl border-2 transition-all text-left ${
                    selectedTool === 'remove_bg'
                      ? 'border-blue-500 bg-blue-50 shadow-md'
                      : 'border-gray-200 hover:border-blue-300'
                  } disabled:opacity-50 disabled:cursor-not-allowed`}
                >
                  <div className="flex items-center">
                    <span className="text-2xl mr-3">🌟</span>
                    <div>
                      <div className="font-semibold text-gray-900">智能背景移除</div>
                      <div className="text-xs text-gray-600">AI 自动识别主体</div>
                    </div>
                  </div>
              </button>

                <button
                  onClick={() => setSelectedTool('inpaint')}
                  disabled={!uploadedImage || isProcessing}
                  className={`w-full p-4 rounded-xl border-2 transition-all text-left ${
                    selectedTool === 'inpaint'
                      ? 'border-blue-500 bg-blue-50 shadow-md'
                      : 'border-gray-200 hover:border-blue-300'
                  } disabled:opacity-50 disabled:cursor-not-allowed`}
                >
                  <div className="flex items-center">
                    <span className="text-2xl mr-3">🧽</span>
                    <div>
                      <div className="font-semibold text-gray-900">精确橡皮擦</div>
                      <div className="text-xs text-gray-600">手动绘制遮罩区域</div>
                    </div>
                  </div>
              </button>
              </div>
            </div>

            {/* 画笔大小 */}
            {selectedTool === 'inpaint' && (
              <div className="bg-white rounded-2xl p-6 shadow-lg">
                <label className="block text-sm font-semibold text-gray-900 mb-3">
                  画笔大小: {brushSize}px
                </label>
                <input
                  type="range"
                  min="5"
                  max="50"
                  value={brushSize}
                  onChange={(e) => setBrushSize(Number(e.target.value))}
                  className="w-full"
                />
                <button
                  onClick={clearMask}
                  className="w-full mt-4 py-2 px-4 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm font-medium transition-colors"
                >
                  清除遮罩
                </button>
              </div>
            )}

            {/* 开始编辑按钮 */}
            <button
              onClick={handleEdit}
              disabled={!uploadedImage || !selectedTool || isProcessing}
              className="w-full py-4 bg-gradient-to-r from-blue-600 to-cyan-600 text-white font-bold rounded-xl hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isProcessing ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  AI 正在处理中...
                </span>
              ) : (
                '✨ 开始编辑'
              )}
            </button>

            {error && (
              <div className="bg-red-50 border-2 border-red-200 rounded-xl p-4">
                <p className="text-red-700 text-sm flex items-center">
                  <span className="mr-2">⚠️</span>
                  {error}
                </p>
              </div>
            )}
          </div>

          {/* 右侧画布区域 */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl p-6 shadow-lg">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-gray-900">编辑画布</h3>
                {editedImage && (
                  <button
                    onClick={() => handleDownload(editedImage)}
                    className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg transition-colors"
                  >
                    💾 下载图片
                  </button>
                )}
              </div>

              {!uploadedImage ? (
                <div className="flex flex-col items-center justify-center py-20 border-2 border-dashed border-gray-300 rounded-xl">
                  <div className="w-24 h-24 bg-gradient-to-br from-blue-100 to-cyan-100 rounded-3xl flex items-center justify-center mb-6">
                    <span className="text-5xl">🖼️</span>
                  </div>
                  <h4 className="text-xl font-semibold text-gray-900 mb-2">上传图片开始编辑</h4>
                  <p className="text-gray-600">支持 JPG、PNG、WEBP 格式</p>
                </div>
              ) : (
                <div className="grid md:grid-cols-2 gap-6">
                  {/* 原图 */}
                  <div>
                    <div className="text-sm font-semibold text-gray-700 mb-2">原图</div>
                    <div className="relative bg-gray-100 rounded-xl overflow-hidden">
                      <canvas
                        ref={canvasRef}
                        className="w-full h-auto"
                        style={{ display: 'block' }}
                      />
                      {selectedTool === 'inpaint' && (
                        <canvas
                          ref={maskCanvasRef}
                          onMouseDown={startDrawing}
                          onMouseMove={draw}
                          onMouseUp={stopDrawing}
                          onMouseLeave={stopDrawing}
                          className="absolute inset-0 w-full h-full cursor-crosshair"
                          style={{ display: 'block' }}
                        />
                      )}
                    </div>
                  </div>

                  {/* 编辑后 */}
                  <div>
                    <div className="text-sm font-semibold text-gray-700 mb-2">编辑结果</div>
                    <div className="bg-gray-100 rounded-xl overflow-hidden flex items-center justify-center min-h-[200px]">
                      {editedImage ? (
                        <img src={editedImage} alt="编辑结果" className="w-full h-auto" />
                      ) : (
                        <div className="text-center p-8">
                          <span className="text-4xl">✨</span>
                          <p className="text-gray-500 text-sm mt-2">编辑结果将在这里显示</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
           </div>
         </div>
      </div>
    </div>
  );
}
