'use client';

import { useState, useRef, useEffect } from 'react';
import WorkspaceLayout from '@/components/WorkspaceLayout';
import { 
  getImageDimensions, 
  resizeImageToOriginal, 
  downloadWithOriginalResolution,
  type ImageDimensions 
} from '@/lib/resolutionKeeper';

type Tool = 'none' | 'inpaint' | 'remove_bg' | 'id_photo';
type BGColor = 'red' | 'blue' | 'white';

export default function EditPage() {
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [editedImage, setEditedImage] = useState<string | null>(null);
  const [selectedTool, setSelectedTool] = useState<Tool>('none');
  const [brushSize, setBrushSize] = useState(20);
  const [isDrawing, setIsDrawing] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [instruction, setInstruction] = useState('');
  const [idPhotoBG, setIdPhotoBG] = useState<BGColor>('red');
  const [originalDimensions, setOriginalDimensions] = useState<ImageDimensions | null>(null);
  const [needsResizing, setNeedsResizing] = useState(false);
  const [progress, setProgress] = useState(0);
  
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const maskCanvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // 上传图片
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = async (e) => {
        const dataUrl = e.target?.result as string;
        
        try {
          const dimensions = await getImageDimensions(dataUrl);
          setOriginalDimensions(dimensions);
          setUploadedImage(dataUrl);
          setEditedImage(null);
          setError(null);
          setNeedsResizing(false);
          setProgress(25);
        } catch (err) {
          setError('无法读取图片尺寸');
        }
      };
      reader.readAsDataURL(file);
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

        if (maskCanvasRef.current) {
          const maskCanvas = maskCanvasRef.current;
          maskCanvas.width = img.width;
          maskCanvas.height = img.height;
          const maskCtx = maskCanvas.getContext('2d');
          if (maskCtx) {
            maskCtx.clearRect(0, 0, maskCanvas.width, maskCanvas.height);
          }
        }
      };
      img.src = uploadedImage;
    }
  }, [uploadedImage]);

  // 画笔绘制
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

    ctx.fillStyle = 'rgba(138, 43, 226, 0.5)';
    ctx.beginPath();
    ctx.arc(x, y, brushSize, 0, Math.PI * 2);
    ctx.fill();
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const clearMask = () => {
    if (maskCanvasRef.current) {
      const canvas = maskCanvasRef.current;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
      }
    }
  };

  // 处理编辑
  const handleEdit = async () => {
    if (!uploadedImage) {
      setError('请先上传图片');
      return;
    }

    if (selectedTool === 'none') {
      setError('请选择编辑工具');
      return;
    }

    if (selectedTool === 'inpaint' && !instruction.trim()) {
      setError('请输入修复描述');
      return;
    }

    // 获取用户配置
    const apiKey = localStorage.getItem('imagine-engine-api-key') || '';
    const baseUrl = localStorage.getItem('imagine-engine-base-url') || 'https://newapi.aicohere.org/v1/chat/completions';
    const model = localStorage.getItem('imagine-engine-model') || 'gemini-2.5-flash-image-preview';

    if (!apiKey) {
      setError('请先在设置中配置API密钥（点击左侧导航栏"⚙️ 设置"按钮）');
      return;
    }

    setIsProcessing(true);
    setError(null);
    setProgress(50);

    try {
      const imageBase64 = uploadedImage.split(',')[1];
      let maskBase64 = '';

      if (selectedTool === 'inpaint' && maskCanvasRef.current) {
        const maskDataUrl = maskCanvasRef.current.toDataURL('image/png');
        maskBase64 = maskDataUrl.split(',')[1];
      }

      setProgress(75);

      const response = await fetch('/api/edit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tool: selectedTool,
          image: imageBase64,
          mask: maskBase64 || undefined,
          instruction: instruction || undefined,
          bgColor: selectedTool === 'id_photo' ? idPhotoBG : undefined,
          originalDimensions,
          apiKey,
          baseUrl,
          model
        })
      });

      const data = await response.json();

      if (!response.ok) throw new Error(data.error || '编辑失败');

      if (data.imageUrl) {
        if (originalDimensions) {
          try {
            const editedDimensions = await getImageDimensions(data.imageUrl);
            
            if (
              editedDimensions.width !== originalDimensions.width ||
              editedDimensions.height !== originalDimensions.height
            ) {
              setNeedsResizing(true);
              
              const resizedImageUrl = await resizeImageToOriginal(
                data.imageUrl,
                originalDimensions.width,
                originalDimensions.height
              );
              
              setEditedImage(resizedImageUrl);
              setNeedsResizing(false);
            } else {
              setEditedImage(data.imageUrl);
            }
          } catch (err) {
            setEditedImage(data.imageUrl);
          }
        } else {
          setEditedImage(data.imageUrl);
        }
        
        setProgress(100);
        clearMask();
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : '编辑失败');
      setProgress(0);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDownload = async (imageUrl: string) => {
    try {
      await downloadWithOriginalResolution(
        imageUrl,
        originalDimensions || undefined,
        `edited-${Date.now()}.png`
      );
    } catch (error) {
      window.open(imageUrl, '_blank');
    }
  };

  return (
    <WorkspaceLayout>
      <div className="min-h-screen p-6">
        {/* 页面标题 */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold mb-2" style={{ color: 'var(--text-primary)' }}>🔧 AI 编辑</h1>
          <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>智能图片编辑，保持原图分辨率</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-6 items-start">
          {/* 左侧 - 控制面板 */}
          <div className="space-y-4 flex flex-col" style={{ minHeight: '800px' }}>
            {/* 上传图片 */}
            <div className="glass-card p-4">
              <label className="block font-semibold mb-3" style={{ color: 'var(--text-primary)' }}>📤 上传图片</label>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                className="hidden"
              />
              <button
                onClick={() => fileInputRef.current?.click()}
                className="w-full p-6 border-2 border-dashed rounded-xl hover:border-purple-500 transition-colors"
                style={{ borderColor: 'var(--border-medium)' }}
              >
                <div className="text-center">
                  <span className="text-4xl">📁</span>
                  <p className="text-sm mt-2" style={{ color: 'var(--text-secondary)' }}>点击上传图片</p>
                  <p className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>支持 JPG、PNG、WEBP</p>
                </div>
              </button>

              {/* 缩略图预览 */}
              {uploadedImage && (
                <div className="mt-4 p-3 rounded-lg" style={{ background: 'var(--bg-tertiary)' }}>
                  <div className="flex items-center gap-3">
                    <img
                      src={uploadedImage}
                      alt="预览"
                      className="w-16 h-16 object-cover rounded-lg"
                    />
                    <div className="flex-1">
                      <div className="text-xs font-semibold mb-1" style={{ color: 'var(--text-primary)' }}>
                        已上传
                      </div>
                      {originalDimensions && (
                        <div className="text-xs font-mono" style={{ color: 'var(--text-secondary)' }}>
                          📐 {originalDimensions.width} × {originalDimensions.height} px
                        </div>
                      )}
                    </div>
                    <button
                      onClick={() => {
                        setUploadedImage(null);
                        setEditedImage(null);
                        setOriginalDimensions(null);
                        setSelectedTool('none');
                        setProgress(0);
                      }}
                      className="text-red-500 hover:text-red-600"
                    >
                      ✕
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* 编辑工具 */}
            <div className="glass-card p-4">
              <label className="block font-semibold mb-3" style={{ color: 'var(--text-primary)' }}>🛠️ 选择工具</label>
              <div className="space-y-2">
                <button
                  onClick={() => setSelectedTool('inpaint')}
                  disabled={!uploadedImage}
                  className={`w-full tool-btn ${selectedTool === 'inpaint' ? 'active' : ''} ${!uploadedImage ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  <div className="flex items-center space-x-3">
                    <span className="text-2xl">🎨</span>
                    <div className="text-left">
                      <div className="font-semibold" style={{ color: 'var(--text-primary)' }}>智能修复</div>
                      <div className="text-xs" style={{ color: 'var(--text-secondary)' }}>涂抹区域并描述修改</div>
                    </div>
                  </div>
                </button>

                <button
                  onClick={() => setSelectedTool('remove_bg')}
                  disabled={!uploadedImage}
                  className={`w-full tool-btn ${selectedTool === 'remove_bg' ? 'active' : ''} ${!uploadedImage ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  <div className="flex items-center space-x-3">
                    <span className="text-2xl">✂️</span>
                    <div className="text-left">
                      <div className="font-semibold" style={{ color: 'var(--text-primary)' }}>背景移除</div>
                      <div className="text-xs" style={{ color: 'var(--text-secondary)' }}>一键生成透明背景</div>
                    </div>
                  </div>
                </button>

                <button
                  onClick={() => setSelectedTool('id_photo')}
                  disabled={!uploadedImage}
                  className={`w-full tool-btn ${selectedTool === 'id_photo' ? 'active' : ''} ${!uploadedImage ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  <div className="flex items-center space-x-3">
                    <span className="text-2xl">📸</span>
                    <div className="text-left">
                      <div className="font-semibold" style={{ color: 'var(--text-primary)' }}>证件照换背景</div>
                      <div className="text-xs" style={{ color: 'var(--text-secondary)' }}>红蓝白三色背景</div>
                    </div>
                  </div>
                </button>
              </div>
            </div>

            {/* 工具设置 */}
            {selectedTool === 'inpaint' && (
              <div className="glass-card p-4">
                <label className="block font-semibold mb-3" style={{ color: 'var(--text-primary)' }}>⚙️ 修复设置</label>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm mb-2" style={{ color: 'var(--text-secondary)' }}>
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
                  </div>
                  <div>
                    <label className="block text-sm mb-2" style={{ color: 'var(--text-secondary)' }}>修复描述</label>
                    <textarea
                      value={instruction}
                      onChange={(e) => setInstruction(e.target.value)}
                      onKeyDown={(e) => {
                        if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
                          e.preventDefault();
                          if (uploadedImage && selectedTool !== 'none' && !isProcessing) {
                            handleEdit();
                          }
                        }
                      }}
                      placeholder="描述你想要的修改效果...（Ctrl+Enter快速执行）"
                      className="textarea-glass h-20 text-sm"
                    />
                  </div>
                  <button
                    onClick={clearMask}
                    className="w-full btn-secondary py-2 text-sm"
                  >
                    🔄 清除遮罩
                  </button>
                </div>
              </div>
            )}

            {selectedTool === 'id_photo' && (
              <div className="glass-card p-4">
                <label className="block font-semibold mb-3" style={{ color: 'var(--text-primary)' }}>🎨 背景颜色</label>
                <div className="grid grid-cols-3 gap-2">
                  {(['red', 'blue', 'white'] as BGColor[]).map((color) => (
                    <button
                      key={color}
                      onClick={() => setIdPhotoBG(color)}
                      className={`p-3 rounded-xl border-2 transition-all ${
                        idPhotoBG === color ? 'border-purple-500 ring-2 ring-purple-500/50' : ''
                      }`}
                      style={idPhotoBG !== color ? { borderColor: 'var(--border-medium)' } : undefined}
                    >
                      <div
                        className={`w-full h-12 rounded-lg mb-2 ${
                          color === 'red' ? 'bg-red-500' :
                          color === 'blue' ? 'bg-blue-500' :
                          'bg-white border border-gray-300'
                        }`}
                      />
                      <div className="text-xs capitalize" style={{ color: 'var(--text-primary)' }}>{color}</div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* 生成按钮 */}
            <button
              onClick={handleEdit}
              disabled={!uploadedImage || selectedTool === 'none' || isProcessing}
              className="w-full btn-gradient py-4"
            >
              {isProcessing ? (
                <span className="flex items-center justify-center">
                  <div className="loading-spinner mr-3" />
                  AI 正在处理中...
                </span>
              ) : (
                '✨ 开始编辑'
              )}
            </button>

            {error && (
              <div className="glass-card p-4 border-2 border-red-500/50">
                <p className="text-red-400 text-sm">⚠️ {error}</p>
              </div>
            )}

            {/* 占位区域 - 确保左列和其他列等高 */}
            <div className="flex-1"></div>
          </div>

          {/* 中间 - 编辑画布 */}
          <div className="flex flex-col">
            <div className="glass-card p-4 flex flex-col" style={{ minHeight: '800px' }}>
              {/* 进度条 */}
              {progress > 0 && (
                <div className="mb-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-semibold" style={{ color: 'var(--text-primary)' }}>
                      处理进度
                    </span>
                    <span className="text-xs font-mono" style={{ color: 'var(--text-secondary)' }}>
                      {progress}%
                    </span>
                  </div>
                  <div className="w-full h-2 rounded-full overflow-hidden" style={{ background: 'var(--bg-tertiary)' }}>
                    <div 
                      className="h-full bg-gradient-primary transition-all duration-300"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                  <div className="flex justify-between text-xs mt-2" style={{ color: 'var(--text-muted)' }}>
                    <span>📤 上传</span>
                    <span>⚙️ 处理</span>
                    <span>🎨 生成</span>
                    <span>✅ 完成</span>
                  </div>
                </div>
              )}

              {/* 原图显示 */}
              <div className="flex-1 flex flex-col">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
                    📷 原图
                  </span>
                  {originalDimensions && (
                    <span className="text-xs font-mono px-2 py-1 rounded" style={{
                      background: 'rgba(59, 130, 246, 0.1)',
                      color: '#3b82f6'
                    }}>
                      {originalDimensions.width} × {originalDimensions.height}
                    </span>
                  )}
                </div>
                
                {uploadedImage ? (
                  <div className="relative rounded-xl overflow-hidden flex-1 flex items-center justify-center" style={{ background: 'var(--bg-tertiary)' }}>
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
                ) : (
                  <div className="flex items-center justify-center flex-1 rounded-xl border-2 border-dashed" style={{ borderColor: 'var(--border-subtle)', minHeight: '400px' }}>
                    <div className="text-center">
                      <span className="text-4xl">📸</span>
                      <p className="text-sm mt-2" style={{ color: 'var(--text-secondary)' }}>上传图片后显示</p>
                    </div>
                  </div>
                )}
                
                {selectedTool === 'inpaint' && uploadedImage && (
                  <div className="mt-2 text-xs text-center" style={{ color: 'var(--text-secondary)' }}>
                    💡 在需要修复的区域涂抹紫色遮罩
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* 右侧 - 编辑结果 */}
          <div className="flex flex-col">
            <div className="glass-card p-4 flex flex-col" style={{ minHeight: '800px' }}>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
                    ✨ 编辑结果
                  </span>
                  {needsResizing && (
                    <span className="text-xs px-2 py-0.5 rounded bg-yellow-500/20 text-yellow-600">
                      ⏳ 调整中
                    </span>
                  )}
                  {originalDimensions && !needsResizing && editedImage && (
                    <span className="text-xs px-2 py-0.5 rounded bg-green-500/20 text-green-600">
                      ✅ 无损
                    </span>
                  )}
                </div>
                {editedImage && (
                  <button
                    onClick={() => handleDownload(editedImage)}
                    className="btn-gradient px-4 py-2 text-sm"
                  >
                    💾 下载
                  </button>
                )}
              </div>

              <div className="flex-1 flex flex-col">
                {editedImage ? (
                  <div className="rounded-xl overflow-hidden flex-1 flex items-center justify-center" style={{ background: 'var(--bg-tertiary)' }}>
                    <img
                      src={editedImage}
                      alt="编辑结果"
                      className="w-full h-auto"
                    />
                  </div>
                ) : (
                  <div className="flex items-center justify-center flex-1 rounded-xl border-2 border-dashed" style={{ borderColor: 'var(--border-subtle)', minHeight: '400px' }}>
                    <div className="text-center">
                      <span className="text-5xl">✨</span>
                      <p className="text-sm mt-4" style={{ color: 'var(--text-primary)' }}>
                        编辑结果将在这里显示
                      </p>
                      <p className="text-xs mt-2" style={{ color: 'var(--text-secondary)' }}>
                        选择工具并点击"开始编辑"
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </WorkspaceLayout>
  );
}
