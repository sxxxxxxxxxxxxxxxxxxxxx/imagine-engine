'use client';

import { useRef, useEffect, useState } from 'react';

interface MaskCanvasProps {
  imageUrl: string;
  onMaskComplete: (maskData: string) => void;
  brushSize?: number;
  onBrushSizeChange?: (size: number) => void;
}

export default function MaskCanvas({ 
  imageUrl, 
  onMaskComplete,
  brushSize: externalBrushSize,
  onBrushSizeChange
}: MaskCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imageRef = useRef<HTMLImageElement | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [brushSize, setBrushSize] = useState(externalBrushSize || 30);
  const [canvasSize, setCanvasSize] = useState({ width: 0, height: 0 });
  const [tool, setTool] = useState<'brush' | 'eraser'>('brush');

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      imageRef.current = img;
      
      // 计算画布尺寸
      const maxWidth = 800;
      const maxHeight = 600;
      const scale = Math.min(maxWidth / img.width, maxHeight / img.height, 1);
      const width = img.width * scale;
      const height = img.height * scale;

      setCanvasSize({ width, height });
      canvas.width = width;
      canvas.height = height;

      // 绘制图像
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(img, 0, 0, width, height);
      }
    };
    img.src = imageUrl;
  }, [imageUrl]);

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
    setIsDrawing(true);
    draw(e);
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing && e.type !== 'mousedown') return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    ctx.globalCompositeOperation = tool === 'brush' ? 'source-over' : 'destination-out';
    ctx.fillStyle = 'rgba(255, 255, 0, 0.5)'; // 黄色半透明
    ctx.beginPath();
    ctx.arc(x, y, brushSize / 2, 0, Math.PI * 2);
    ctx.fill();
  };

  const clearMask = () => {
    const canvas = canvasRef.current;
    const img = imageRef.current;
    if (!canvas || !img) return;

    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0, canvasSize.width, canvasSize.height);
    }
  };

  const exportMask = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const maskData = canvas.toDataURL('image/png');
    onMaskComplete(maskData);
  };

  const handleBrushSizeChange = (size: number) => {
    setBrushSize(size);
    if (onBrushSizeChange) {
      onBrushSizeChange(size);
    }
  };

  return (
    <div className="space-y-4">
      {/* 工具栏 */}
      <div className="glass-card p-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
            🎨 遮罩工具
          </h3>
          <div className="flex gap-2">
            <button
              onClick={() => setTool('brush')}
              className={`text-xs px-3 py-1 rounded-lg ${
                tool === 'brush' ? 'btn-gradient' : 'btn-secondary'
              }`}
            >
              🖌️ 画笔
            </button>
            <button
              onClick={() => setTool('eraser')}
              className={`text-xs px-3 py-1 rounded-lg ${
                tool === 'eraser' ? 'btn-gradient' : 'btn-secondary'
              }`}
            >
              🧹 橡皮擦
            </button>
          </div>
        </div>

        {/* 画笔大小 */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-xs font-semibold" style={{ color: 'var(--text-secondary)' }}>
              画笔大小
            </label>
            <span className="text-xs font-mono" style={{ color: 'var(--text-primary)' }}>
              {brushSize}px
            </span>
          </div>
          <input
            type="range"
            min="5"
            max="100"
            value={brushSize}
            onChange={(e) => handleBrushSizeChange(parseInt(e.target.value))}
            className="w-full"
          />
          <div className="flex justify-between text-xs mt-1" style={{ color: 'var(--text-muted)' }}>
            <span>细</span>
            <span>粗</span>
          </div>
        </div>

        {/* 操作按钮 */}
        <div className="flex gap-2 mt-4">
          <button
            onClick={clearMask}
            className="flex-1 btn-secondary py-2 text-xs"
          >
            🔄 重置
          </button>
          <button
            onClick={exportMask}
            className="flex-1 btn-gradient py-2 text-xs"
          >
            ✅ 完成
          </button>
        </div>
      </div>

      {/* 画布 */}
      <div className="glass-card p-4">
        <div className="flex items-center justify-center" style={{ background: 'var(--bg-tertiary)' }}>
          <canvas
            ref={canvasRef}
            onMouseDown={startDrawing}
            onMouseMove={draw}
            onMouseUp={stopDrawing}
            onMouseLeave={stopDrawing}
            className="border-2 cursor-crosshair"
            style={{ borderColor: 'var(--border-medium)' }}
          />
        </div>
        <p className="text-xs text-center mt-2" style={{ color: 'var(--text-muted)' }}>
          💡 在需要编辑的区域涂抹黄色遮罩
        </p>
      </div>

      {/* 快捷键提示 */}
      <div className="text-xs p-3 rounded-lg" style={{ background: 'var(--bg-tertiary)', color: 'var(--text-secondary)' }}>
        <div className="font-semibold mb-1">快捷操作：</div>
        <div>• 左键拖动：绘制遮罩</div>
        <div>• 切换到橡皮擦：擦除遮罩</div>
        <div>• 滚轮：调整画笔大小</div>
      </div>
    </div>
  );
}
