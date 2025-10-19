'use client';

import { useState, useRef, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useLanguage } from '@/contexts/LanguageContext';
import { 
  getImageDimensions, 
  resizeImageToOriginal, 
  downloadWithOriginalResolution,
  type ImageDimensions 
} from '@/lib/resolutionKeeper';
import { useKeyboardShortcuts } from '@/hooks/useKeyboardShortcuts';
import { 
  Upload, 
  Wand2, 
  Scissors, 
  Image as ImageIcon,
  Download,
  Eraser,
  Palette,
  RefreshCw
} from 'lucide-react';

type Tool = 'none' | 'inpaint' | 'remove_bg' | 'id_photo';
type BGColor = 'red' | 'blue' | 'white';

export default function EditPage() {
  const { language, t } = useLanguage();
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

  // 页面加载时检查是否有从创作页面传递过来的图片
  useEffect(() => {
    const imageFromSession = sessionStorage.getItem('edit-image');
    if (imageFromSession) {
      console.log('📎 从创作页面加载图片');
      getImageDimensions(imageFromSession)
        .then(dimensions => {
          setOriginalDimensions(dimensions);
          setUploadedImage(imageFromSession);
          setProgress(25);
          setSelectedTool('remove_bg');
          console.log(`✅ 图片加载成功: ${dimensions.width}×${dimensions.height}`);
          
          setTimeout(() => {
            setError('✅ ' + (language === 'zh' 
              ? '图片已加载！已自动选择"移除背景"工具，可直接开始编辑。' 
              : 'Image loaded! "Remove Background" tool auto-selected.'));
            setTimeout(() => setError(null), 5000);
          }, 500);
        })
        .catch(err => {
          console.error('❌ 加载图片失败:', err);
          setError(language === 'zh' ? '无法加载图片' : 'Failed to load image');
        });
      sessionStorage.removeItem('edit-image');
    }
  }, [language]);

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
          setError(language === 'zh' ? '无法读取图片尺寸' : 'Cannot read image dimensions');
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

    ctx.fillStyle = 'rgba(45, 212, 191, 0.5)'; // 青绿色遮罩
    ctx.beginPath();
    ctx.arc(x, y, brushSize, 0, Math.PI * 2);
    ctx.fill();
  };

  const stopDrawing = () => setIsDrawing(false);

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
      setError(language === 'zh' ? '请先上传图片' : 'Please upload an image first');
      return;
    }

    if (selectedTool === 'none') {
      setError(language === 'zh' ? '请选择编辑工具' : 'Please select an editing tool');
      return;
    }

    if (selectedTool === 'inpaint' && !instruction.trim()) {
      setError(language === 'zh' ? '请输入编辑描述' : 'Please enter edit description');
      return;
    }

    const apiKey = localStorage.getItem('imagine-engine-api-key') || '';
    const baseUrl = localStorage.getItem('imagine-engine-base-url') || 'https://newapi.aicohere.org/v1/chat/completions';
    const model = localStorage.getItem('imagine-engine-model') || 'gemini-2.5-flash-image-preview';

    if (!apiKey) {
      setError(language === 'zh' ? '请先配置 API 密钥' : 'Please configure API key in settings');
      return;
    }

    setIsProcessing(true);
    setError(null);
    setProgress(50);

    try {
      let imageBase64 = '';
      
      if (uploadedImage.startsWith('data:')) {
        imageBase64 = uploadedImage.split(',')[1];
        console.log('📷 使用 Data URL 格式');
      } else if (uploadedImage.startsWith('http')) {
        console.log('🌐 转换 HTTP URL...');
        const response = await fetch(uploadedImage);
        const blob = await response.blob();
        const dataUrl = await new Promise<string>((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => resolve(reader.result as string);
          reader.onerror = reject;
          reader.readAsDataURL(blob);
        });
        imageBase64 = dataUrl.split(',')[1];
        console.log('✅ 转换完成');
      } else {
        throw new Error(language === 'zh' ? '不支持的图片格式' : 'Unsupported image format');
      }
      
      if (!imageBase64) {
        throw new Error(language === 'zh' ? '图片数据为空' : 'Image data is empty');
      }
      
      let maskBase64 = '';
      if (selectedTool === 'inpaint' && maskCanvasRef.current) {
        const maskDataUrl = maskCanvasRef.current.toDataURL('image/png');
        maskBase64 = maskDataUrl.split(',')[1];
      }

      setProgress(75);

      // 获取认证token
      const { data: { session } } = await supabase.auth.getSession();

      const response = await fetch('/api/edit', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': session ? `Bearer ${session.access_token}` : ''
        },
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
      if (!response.ok) throw new Error(data.error || 'Edit failed');

      if (data.imageUrl) {
        if (originalDimensions) {
          try {
            const editedDimensions = await getImageDimensions(data.imageUrl);
            
            if (editedDimensions.width !== originalDimensions.width || editedDimensions.height !== originalDimensions.height) {
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
      setError(err instanceof Error ? err.message : (language === 'zh' ? '编辑失败' : 'Edit failed'));
      setProgress(0);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDownload = async (imageUrl: string) => {
    try {
      await downloadWithOriginalResolution(imageUrl, originalDimensions || undefined, `edited-${Date.now()}.png`);
      console.log('✅ 下载成功');
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : (language === 'zh' ? '下载失败' : 'Download failed');
      setError(errorMessage);
      console.error('❌ 下载失败:', errorMessage);
    }
  };

  useKeyboardShortcuts({
    onGenerate: handleEdit,
    isGenerating: isProcessing
  });

  const tools = [
    { 
      id: 'inpaint' as Tool, 
      icon: Wand2,
      name: language === 'zh' ? '智能修复' : 'Inpaint',
      desc: language === 'zh' ? '涂抹区域并描述修改' : 'Paint area and describe'
    },
    { 
      id: 'remove_bg' as Tool, 
      icon: Scissors,
      name: language === 'zh' ? '移除背景' : 'Remove BG',
      desc: language === 'zh' ? '一键生成透明背景' : 'One-click transparent'
    },
    { 
      id: 'id_photo' as Tool, 
      icon: ImageIcon,
      name: language === 'zh' ? '证件照' : 'ID Photo',
      desc: language === 'zh' ? '更换背景颜色' : 'Change background'
    },
  ];

  return (
    <div className="page-container">
      <div className="content-wrapper">
        {/* 页面标题与提示 */}
        <div className="mb-6 flex items-center justify-between flex-wrap gap-4">
          <div>
            <h1 className="text-3xl font-bold text-dark-900 dark:text-dark-50">
              Editor
            </h1>
            <p className="text-sm text-dark-600 dark:text-dark-400 mt-1">
              {language === 'zh' ? '专业图片编辑工具' : 'Professional image editing tool'}
            </p>
          </div>
          
          {/* 右侧提示信息 */}
          <div className="hidden lg:flex items-center gap-6 text-sm text-dark-600 dark:text-dark-400">
            <div className="flex items-center gap-2">
              <span>💡</span>
              <span>{language === 'zh' ? '上传图片后选择工具' : 'Upload then select tool'}</span>
            </div>
            <div className="flex items-center gap-2">
              <span>⌨️</span>
              <span>{language === 'zh' ? 'Ctrl+Enter 快速执行' : 'Ctrl+Enter to execute'}</span>
            </div>
            <div className="flex items-center gap-2">
              <span>📐</span>
              <span>{language === 'zh' ? '保持原始分辨率' : 'Original resolution'}</span>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-24 gap-4">
          {/* 左侧：工具栏（6/24 = 25%） */}
          <div className="col-span-24 lg:col-span-6 space-y-4">
            {/* 上传图片 */}
            <div className="card p-6">
              <label className="form-label flex items-center gap-2 mb-3">
                <Upload className="w-4 h-4 text-primary-500" />
                {language === 'zh' ? '上传图片' : 'Upload Image'}
              </label>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                className="hidden"
              />
              <button
                onClick={() => fileInputRef.current?.click()}
                className="w-full p-6 border-2 border-dashed border-dark-300 dark:border-dark-700 rounded-lg hover:border-primary-400 dark:hover:border-primary-500 transition-colors text-center"
              >
                <Upload className="w-8 h-8 text-dark-400 mx-auto mb-2" />
                <p className="text-sm text-dark-600 dark:text-dark-400">
                  {language === 'zh' ? '点击上传' : 'Click to upload'}
                </p>
                <p className="text-xs text-dark-500 mt-1">
                  JPG, PNG, WEBP
                </p>
              </button>

              {uploadedImage && originalDimensions && (
                <div className="mt-3 p-3 bg-dark-50 dark:bg-dark-900 rounded-lg">
                  <div className="flex justify-between text-xs text-dark-600 dark:text-dark-400">
                    <span>{language === 'zh' ? '尺寸' : 'Size'}:</span>
                    <span className="font-mono">{originalDimensions.width}×{originalDimensions.height}</span>
                  </div>
                </div>
              )}
            </div>

            {/* 选择工具 */}
            <div className="card p-6">
              <label className="form-label mb-3">
                {language === 'zh' ? '选择工具' : 'Select Tool'}
              </label>
              <div className="space-y-2">
                {tools.map((tool) => {
                  const Icon = tool.icon;
                  const isActive = selectedTool === tool.id;
                  return (
                    <button
                      key={tool.id}
                      onClick={() => setSelectedTool(tool.id)}
                      disabled={!uploadedImage}
                      className={`w-full p-3 rounded-lg text-left transition-all ${
                        isActive
                          ? 'bg-primary-50 dark:bg-primary-900/20 border-2 border-primary-400 dark:border-primary-500'
                          : 'bg-dark-50 dark:bg-dark-900 border-2 border-transparent hover:border-dark-300 dark:hover:border-dark-700'
                      } ${!uploadedImage ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                      <div className="flex items-center gap-3">
                        <Icon className={`w-5 h-5 ${isActive ? 'text-primary-600 dark:text-primary-400' : 'text-dark-600 dark:text-dark-400'}`} />
                        <div>
                          <div className={`font-medium ${isActive ? 'text-primary-700 dark:text-primary-300' : 'text-dark-900 dark:text-dark-100'}`}>
                            {tool.name}
                          </div>
                          <div className="text-xs text-dark-500">{tool.desc}</div>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 工具参数 */}
            {selectedTool === 'inpaint' && (
              <div className="card p-6">
                <label className="form-label mb-3">{language === 'zh' ? '修复设置' : 'Inpaint Settings'}</label>
                <div className="space-y-4">
                  <div>
                    <label className="form-label mb-2">
                      {language === 'zh' ? '画笔大小' : 'Brush Size'}: {brushSize}px
                    </label>
                    <input
                      type="range"
                      min="5"
                      max="50"
                      value={brushSize}
                      onChange={(e) => setBrushSize(Number(e.target.value))}
                      className="w-full accent-primary-500"
                    />
                  </div>
                  <div>
                    <label className="form-label mb-2">
                      {language === 'zh' ? '编辑描述' : 'Description'}
                    </label>
                    <textarea
                      value={instruction}
                      onChange={(e) => setInstruction(e.target.value)}
                      placeholder={language === 'zh' ? '描述你想要的修改效果...' : 'Describe the changes...'}
                      className="textarea h-20"
                    />
                  </div>
                  <button onClick={clearMask} className="btn-secondary w-full text-sm">
                    <Eraser className="w-4 h-4" />
                    {language === 'zh' ? '清除遮罩' : 'Clear Mask'}
                  </button>
                </div>
              </div>
            )}

            {selectedTool === 'id_photo' && (
              <div className="card p-6">
                <label className="form-label mb-3">
                  <Palette className="w-4 h-4 inline mr-1" />
                  {language === 'zh' ? '背景颜色' : 'Background Color'}
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {(['red', 'blue', 'white'] as BGColor[]).map((color) => (
                    <button
                      key={color}
                      onClick={() => setIdPhotoBG(color)}
                      className={`p-3 rounded-lg border-2 transition-all ${
                        idPhotoBG === color 
                          ? 'border-primary-400 dark:border-primary-500 ring-2 ring-primary-400/50' 
                          : 'border-dark-200 dark:border-dark-800'
                      }`}
                    >
                      <div className={`w-full h-12 rounded ${
                        color === 'red' ? 'bg-red-500' :
                        color === 'blue' ? 'bg-blue-500' :
                        'bg-white border border-dark-300'
                      }`} />
                      <div className="text-xs text-center mt-2 capitalize text-dark-700 dark:text-dark-300">
                        {color}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* 开始编辑按钮 */}
            <button
              onClick={handleEdit}
              disabled={!uploadedImage || selectedTool === 'none' || isProcessing}
              className="btn-primary w-full py-3"
            >
              {isProcessing ? (
                <>
                  <div className="loading-spinner" />
                  {language === 'zh' ? '处理中...' : 'Processing...'}
                </>
              ) : (
                <>
                  <Wand2 className="w-5 h-5" />
                  {language === 'zh' ? '开始编辑' : 'Start Editing'}
                </>
              )}
            </button>

            {/* 提示信息 */}
            {uploadedImage && selectedTool === 'none' && !isProcessing && (
              <div className="card p-3 border-2 border-accent-200 dark:border-accent-800 bg-accent-50 dark:bg-accent-900/20">
                <p className="text-sm text-accent-700 dark:text-accent-300">
                  💡 {language === 'zh' ? '请先选择编辑工具' : 'Please select a tool first'}
                </p>
              </div>
            )}

            {error && (
              <div className={`card p-3 border-2 ${
                error.startsWith('✅') 
                  ? 'border-green-200 dark:border-green-800 bg-green-50 dark:bg-green-900/20' 
                  : 'border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-900/20'
              }`}>
                <p className={`text-sm ${
                  error.startsWith('✅') 
                    ? 'text-green-700 dark:text-green-300' 
                    : 'text-red-700 dark:text-red-300'
                }`}>
                  {error}
                </p>
              </div>
            )}
          </div>

          {/* 中间：原图区域（9/24 = 37.5%） */}
          <div className="col-span-24 lg:col-span-9">
            <div className="card p-6">
              <div className="flex items-center justify-between mb-4">
                <label className="form-label mb-0">
                  {language === 'zh' ? '原图' : 'Original'}
                </label>
                {progress > 0 && (
                  <span className="text-xs text-dark-500">{progress}%</span>
                )}
              </div>

              {progress > 0 && (
                <div className="progress-bar mb-4">
                  <div className="progress-fill" style={{ width: `${progress}%` }} />
                </div>
              )}

              {uploadedImage ? (
                <div className="relative bg-dark-50 dark:bg-dark-900 rounded-lg overflow-hidden min-h-[400px] max-h-[70vh] flex items-center justify-center">
                  <canvas
                    ref={canvasRef}
                    className="max-w-full max-h-full object-contain"
                  />
                  {selectedTool === 'inpaint' && (
                    <canvas
                      ref={maskCanvasRef}
                      onMouseDown={startDrawing}
                      onMouseMove={draw}
                      onMouseUp={stopDrawing}
                      onMouseLeave={stopDrawing}
                      className="absolute inset-0 w-full h-full cursor-crosshair"
                    />
                  )}
                </div>
              ) : (
                <div className="bg-dark-50 dark:bg-dark-900 rounded-lg min-h-[400px] max-h-[70vh] flex items-center justify-center">
                  <div className="text-center">
                    <ImageIcon className="w-12 h-12 text-dark-400 mx-auto mb-2" />
                    <p className="text-sm text-dark-600 dark:text-dark-400">
                      {language === 'zh' ? '上传图片后显示' : 'Upload to preview'}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* 右侧：编辑结果区域（9/24 = 37.5%） */}
          <div className="col-span-24 lg:col-span-9">
            <div className="card p-6">
              <div className="flex items-center justify-between mb-4">
                <label className="form-label mb-0">
                  {language === 'zh' ? '编辑结果' : 'Edited Result'}
                </label>
                {editedImage && (
                  <button onClick={() => handleDownload(editedImage)} className="btn-primary text-sm">
                    <Download className="w-4 h-4" />
                    {language === 'zh' ? '下载' : 'Download'}
                  </button>
                )}
              </div>

              {editedImage ? (
                <div className="bg-dark-50 dark:bg-dark-900 rounded-lg overflow-hidden min-h-[400px] max-h-[70vh] flex items-center justify-center">
                  <img src={editedImage} alt="Result" className="max-w-full max-h-full object-contain" />
                </div>
              ) : (
                <div className="bg-dark-50 dark:bg-dark-900 rounded-lg min-h-[400px] max-h-[70vh] flex items-center justify-center">
                  <div className="text-center">
                    <Wand2 className="w-12 h-12 text-dark-400 mx-auto mb-2" />
                    <p className="text-sm text-dark-600 dark:text-dark-400">
                      {language === 'zh' ? '编辑结果将在这里显示' : 'Result will appear here'}
                    </p>
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
