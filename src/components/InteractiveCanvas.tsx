'use client';

import { useRef, useState, useCallback, useEffect } from 'react';

interface InteractiveCanvasProps {
  imageUrl: string;
  onImageClick?: (x: number, y: number) => void;
  showControls?: boolean;
  className?: string;
}

export default function InteractiveCanvas({ 
  imageUrl, 
  onImageClick, 
  showControls = true,
  className = '' 
}: InteractiveCanvasProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [imageLoaded, setImageLoaded] = useState(false);

  // 重置视图
  const resetView = useCallback(() => {
    setScale(1);
    setPosition({ x: 0, y: 0 });
  }, []);

  // 缩放功能
  const handleZoom = useCallback((delta: number, centerX?: number, centerY?: number) => {
    const container = containerRef.current;
    if (!container) return;

    const rect = container.getBoundingClientRect();
    const zoomCenterX = centerX ?? rect.width / 2;
    const zoomCenterY = centerY ?? rect.height / 2;

    setScale(prevScale => {
      const newScale = Math.max(0.1, Math.min(5, prevScale + delta));
      
      // 计算缩放后的位置调整
      const scaleDiff = newScale - prevScale;
      const newX = position.x - (zoomCenterX - position.x) * (scaleDiff / prevScale);
      const newY = position.y - (zoomCenterY - position.y) * (scaleDiff / prevScale);
      
      setPosition({ x: newX, y: newY });
      return newScale;
    });
  }, [position]);

  // 鼠标滚轮缩放
  const handleWheel = useCallback((e: React.WheelEvent) => {
    e.preventDefault();
    const delta = e.deltaY > 0 ? -0.1 : 0.1;
    const rect = containerRef.current?.getBoundingClientRect();
    if (rect) {
      handleZoom(delta, e.clientX - rect.left, e.clientY - rect.top);
    }
  }, [handleZoom]);

  // 鼠标拖拽开始
  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if (e.button === 0) { // 左键
      setIsDragging(true);
      setDragStart({ x: e.clientX - position.x, y: e.clientY - position.y });
    }
  }, [position]);

  // 鼠标拖拽
  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (isDragging) {
      setPosition({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y
      });
    }
  }, [isDragging, dragStart]);

  // 鼠标拖拽结束
  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  // 图片点击处理
  const handleImageClick = useCallback((e: React.MouseEvent) => {
    if (!onImageClick || isDragging) return;
    
    const image = imageRef.current;
    if (!image) return;

    const rect = image.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;
    
    onImageClick(x, y);
  }, [onImageClick, isDragging]);

  // 适应窗口
  const fitToWindow = useCallback(() => {
    const container = containerRef.current;
    const image = imageRef.current;
    if (!container || !image) return;

    const containerRect = container.getBoundingClientRect();
    const imageRect = image.getBoundingClientRect();
    
    const scaleX = containerRect.width / image.naturalWidth;
    const scaleY = containerRect.height / image.naturalHeight;
    const newScale = Math.min(scaleX, scaleY, 1);
    
    setScale(newScale);
    setPosition({ x: 0, y: 0 });
  }, []);

  // 图片加载完成
  const handleImageLoad = () => {
    setImageLoaded(true);
    fitToWindow();
  };

  // 键盘快捷键
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target !== document.body) return;
      
      switch (e.key) {
        case '=':
        case '+':
          e.preventDefault();
          handleZoom(0.2);
          break;
        case '-':
          e.preventDefault();
          handleZoom(-0.2);
          break;
        case '0':
          e.preventDefault();
          resetView();
          break;
        case 'f':
          e.preventDefault();
          fitToWindow();
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleZoom, resetView, fitToWindow]);

  return (
    <div className={`relative bg-gray-100 rounded-lg overflow-hidden ${className}`}>
      {/* 画布容器 */}
      <div
        ref={containerRef}
        className="relative w-full h-96 cursor-grab active:cursor-grabbing overflow-hidden"
        onWheel={handleWheel}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      >
        {/* 图片 */}
        <img
          ref={imageRef}
          src={imageUrl}
          alt="Interactive Canvas"
          className="absolute select-none"
          style={{
            transform: `translate(${position.x}px, ${position.y}px) scale(${scale})`,
            transformOrigin: '0 0',
            transition: isDragging ? 'none' : 'transform 0.1s ease-out',
          }}
          onLoad={handleImageLoad}
          onClick={handleImageClick}
          draggable={false}
        />

        {/* 加载状态 */}
        {!imageLoaded && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-200">
            <div className="loading-spinner"></div>
          </div>
        )}
      </div>

      {/* 控制面板 */}
      {showControls && (
        <div className="absolute top-4 right-4 flex flex-col space-y-2">
          {/* 缩放控制 */}
          <div className="bg-white rounded-lg shadow-lg p-2 flex flex-col space-y-1">
            <button
              onClick={() => handleZoom(0.2)}
              className="w-8 h-8 flex items-center justify-center text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded transition-colors"
              title="放大 (+)"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
            </button>
            
            <div className="text-xs text-center text-gray-500 py-1">
              {Math.round(scale * 100)}%
            </div>
            
            <button
              onClick={() => handleZoom(-0.2)}
              className="w-8 h-8 flex items-center justify-center text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded transition-colors"
              title="缩小 (-)"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 12H6" />
              </svg>
            </button>
          </div>

          {/* 视图控制 */}
          <div className="bg-white rounded-lg shadow-lg p-2 flex flex-col space-y-1">
            <button
              onClick={fitToWindow}
              className="w-8 h-8 flex items-center justify-center text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded transition-colors"
              title="适应窗口 (F)"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
              </svg>
            </button>
            
            <button
              onClick={resetView}
              className="w-8 h-8 flex items-center justify-center text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded transition-colors"
              title="重置视图 (0)"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            </button>
          </div>
        </div>
      )}

      {/* 快捷键提示 */}
      {showControls && (
        <div className="absolute bottom-4 left-4 bg-black bg-opacity-75 text-white text-xs rounded px-2 py-1">
          <div>滚轮: 缩放 | 拖拽: 平移</div>
          <div>+/-: 缩放 | 0: 重置 | F: 适应</div>
        </div>
      )}
    </div>
  );
}