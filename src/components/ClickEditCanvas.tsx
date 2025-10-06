'use client';

import { useRef, useState, useCallback } from 'react';

interface ClickEditCanvasProps {
  imageUrl: string;
  onEdit: (x: number, y: number, instruction: string) => void;
  isEditing: boolean;
  isActive: boolean;
}

interface ClickPoint {
  x: number;
  y: number;
  id: string;
}

export default function ClickEditCanvas({ 
  imageUrl, 
  onEdit, 
  isEditing, 
  isActive 
}: ClickEditCanvasProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const [clickPoints, setClickPoints] = useState<ClickPoint[]>([]);
  const [showInstructionModal, setShowInstructionModal] = useState(false);
  const [selectedPoint, setSelectedPoint] = useState<ClickPoint | null>(null);
  const [instruction, setInstruction] = useState('');

  // 处理图片点击
  const handleImageClick = useCallback((e: React.MouseEvent<HTMLImageElement>) => {
    if (!isActive || isEditing) return;

    const image = imageRef.current;
    const container = containerRef.current;
    if (!image || !container) return;

    const rect = image.getBoundingClientRect();
    const containerRect = container.getBoundingClientRect();
    
    // 计算相对于图片的点击位置
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;

    const newPoint: ClickPoint = {
      x,
      y,
      id: Date.now().toString(),
    };

    setClickPoints([newPoint]); // 只保留最新的点击点
    setSelectedPoint(newPoint);
    setShowInstructionModal(true);
  }, [isActive, isEditing]);

  // 处理编辑指令提交
  const handleInstructionSubmit = () => {
    if (!selectedPoint || !instruction.trim()) return;

    // 将百分比坐标转换为实际像素坐标
    const image = imageRef.current;
    if (!image) return;

    const actualX = (selectedPoint.x / 100) * image.naturalWidth;
    const actualY = (selectedPoint.y / 100) * image.naturalHeight;

    onEdit(actualX, actualY, instruction.trim());
    
    // 清理状态
    setShowInstructionModal(false);
    setSelectedPoint(null);
    setInstruction('');
    setClickPoints([]);
  };

  // 取消编辑
  const handleCancel = () => {
    setShowInstructionModal(false);
    setSelectedPoint(null);
    setInstruction('');
    setClickPoints([]);
  };

  // 预设指令
  const presetInstructions = [
    '移除这个物体',
    '更换这个物体的颜色为红色',
    '给这件衣服添加条纹',
    '移除这个人',
    '更改这个背景',
    '修复这个区域',
    '添加阴影效果',
    '增强这个区域的细节',
  ];

  return (
    <div className="space-y-4">
      {/* 图片容器 */}
      <div 
        ref={containerRef}
        className="relative border-2 border-gray-300 rounded-lg overflow-hidden bg-gray-100"
      >
        <img
          ref={imageRef}
          src={imageUrl}
          alt="点击编辑图片"
          className={`w-full h-auto block ${isActive ? 'cursor-crosshair' : 'cursor-not-allowed'}`}
          style={{ maxWidth: '500px' }}
          onClick={handleImageClick}
        />

        {/* 点击点标记 */}
        {clickPoints.map((point) => (
          <div
            key={point.id}
            className="absolute w-4 h-4 bg-red-500 border-2 border-white rounded-full transform -translate-x-1/2 -translate-y-1/2 animate-pulse"
            style={{
              left: `${point.x}%`,
              top: `${point.y}%`,
            }}
          >
            <div className="absolute inset-0 bg-red-500 rounded-full animate-ping opacity-75"></div>
          </div>
        ))}

        {/* 状态覆盖层 */}
        {!isActive && (
          <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="text-white text-center">
              <p className="font-medium">选择点击编辑工具开始</p>
              <p className="text-sm opacity-75">点击图片上的任意位置进行精确编辑</p>
            </div>
          </div>
        )}

        {isEditing && (
          <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="text-white text-center">
              <div className="loading-spinner mb-2"></div>
              <p className="font-medium">AI正在处理中...</p>
            </div>
          </div>
        )}
      </div>

      {/* 使用说明 */}
      {isActive && !isEditing && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
          <div className="flex items-start space-x-2">
            <div className="text-blue-500 text-lg">🎯</div>
            <div className="text-sm text-blue-700">
              <p className="font-medium mb-1">点击编辑说明：</p>
              <ul className="space-y-1 text-xs">
                <li>• 在图片上点击需要编辑的具体位置</li>
                <li>• 输入编辑指令，如"移除这个物体"</li>
                <li>• AI将对指定位置进行精确编辑</li>
                <li>• 支持移除、更换、修复等多种操作</li>
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* 编辑指令模态框 */}
      {showInstructionModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full">
            <div className="p-6">
              <h3 className="text-lg font-semibold mb-4">编辑指令</h3>
              
              {/* 自定义指令输入 */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  描述您想要的编辑效果：
                </label>
                <textarea
                  value={instruction}
                  onChange={(e) => setInstruction(e.target.value)}
                  placeholder="例如：移除这个物体、更换颜色为红色、添加阴影等..."
                  className="input-field resize-none h-20"
                  autoFocus
                />
              </div>

              {/* 预设指令 */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  或选择常用指令：
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {presetInstructions.map((preset, index) => (
                    <button
                      key={index}
                      onClick={() => setInstruction(preset)}
                      className="text-left p-2 text-xs bg-gray-50 hover:bg-gray-100 rounded border transition-colors"
                    >
                      {preset}
                    </button>
                  ))}
                </div>
              </div>

              {/* 操作按钮 */}
              <div className="flex space-x-3">
                <button
                  onClick={handleCancel}
                  className="btn-secondary flex-1"
                >
                  取消
                </button>
                <button
                  onClick={handleInstructionSubmit}
                  disabled={!instruction.trim()}
                  className="btn-primary flex-1 disabled:opacity-50"
                >
                  开始编辑
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}