'use client';

interface AspectRatio {
  id: string;
  label: string;
  icon: string;
  size: string;
  width: number;
  height: number;
  description: string;
  popular?: boolean;
}

const aspectRatios: AspectRatio[] = [
  { 
    id: '1:1', 
    label: '方形', 
    icon: '⬜', 
    size: '1024×1024', 
    width: 1024, 
    height: 1024,
    description: '社交媒体标准',
    popular: true
  },
  { 
    id: '16:9', 
    label: '宽屏', 
    icon: '🖥️', 
    size: '1920×1080', 
    width: 1920, 
    height: 1080,
    description: '视频标准'
  },
  { 
    id: '9:16', 
    label: '竖屏', 
    icon: '📱', 
    size: '1080×1920', 
    width: 1080, 
    height: 1920,
    description: '手机竖屏',
    popular: true
  },
  { 
    id: '4:3', 
    label: '标准', 
    icon: '📺', 
    size: '1024×768', 
    width: 1024, 
    height: 768,
    description: '经典比例'
  },
  { 
    id: '3:4', 
    label: '肖像', 
    icon: '🖼️', 
    size: '768×1024', 
    width: 768, 
    height: 1024,
    description: '人物肖像'
  },
  { 
    id: '21:9', 
    label: '超宽', 
    icon: '🎬', 
    size: '2560×1080', 
    width: 2560, 
    height: 1080,
    description: '电影屏幕'
  },
  { 
    id: '2:3', 
    label: '照片', 
    icon: '📷', 
    size: '1365×2048', 
    width: 1365, 
    height: 2048,
    description: '摄影标准'
  },
  { 
    id: '3:2', 
    label: '横照', 
    icon: '🌄', 
    size: '2048×1365', 
    width: 2048, 
    height: 1365,
    description: '横向摄影'
  },
  { 
    id: '4:5', 
    label: '竖海报', 
    icon: '📋', 
    size: '1024×1280', 
    width: 1024, 
    height: 1280,
    description: '竖屏海报',
    popular: false
  },
  { 
    id: '5:4', 
    label: '横海报', 
    icon: '🎨', 
    size: '1280×1024', 
    width: 1280, 
    height: 1024,
    description: '横屏海报',
    popular: false
  },
];

interface AspectRatioSelectorProps {
  selected: string;
  onChange: (ratioId: string, dimensions: { width: number; height: number }) => void;
  showSizes?: boolean;
}

export default function AspectRatioSelector({ 
  selected, 
  onChange,
  showSizes = true
}: AspectRatioSelectorProps) {
  const selectedRatio = aspectRatios.find(r => r.id === selected);

  return (
    <div className="space-y-4">
      {/* 当前选择 */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-semibold mb-1" style={{ color: 'var(--text-primary)' }}>
            📐 图片尺寸
          </h3>
          <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>
            {selectedRatio && (
              <>
                <span className="font-mono font-semibold">{selectedRatio.size}</span>
                <span className="mx-2">•</span>
                <span>{selectedRatio.description}</span>
              </>
            )}
          </p>
        </div>
        {selectedRatio && (
          <div className="text-3xl">{selectedRatio.icon}</div>
        )}
      </div>

      {/* 快速选择 - 热门 */}
      <div>
        <div className="flex items-center gap-2 mb-2">
          <span className="text-xs font-semibold" style={{ color: 'var(--text-secondary)' }}>
            🔥 热门
          </span>
        </div>
        <div className="grid grid-cols-2 gap-2">
          {aspectRatios.filter(r => r.popular).map((ratio) => (
            <button
              key={ratio.id}
              onClick={() => onChange(ratio.id, { width: ratio.width, height: ratio.height })}
              className={`p-3 rounded-lg border-2 transition-all ${
                selected === ratio.id
                  ? 'border-purple-500 bg-purple-500/10'
                  : 'border-transparent hover:border-purple-500/30'
              }`}
              style={{ 
                background: selected === ratio.id ? undefined : 'var(--bg-tertiary)',
              }}
            >
              <div className="flex items-center gap-3">
                <span className="text-2xl">{ratio.icon}</span>
                <div className="text-left flex-1">
                  <div className="font-semibold text-sm" style={{ color: 'var(--text-primary)' }}>
                    {ratio.label}
                  </div>
                  {showSizes && (
                    <div className="text-xs font-mono" style={{ color: 'var(--text-secondary)' }}>
                      {ratio.size}
                    </div>
                  )}
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* 全部选择 */}
      <div>
        <div className="flex items-center gap-2 mb-2">
          <span className="text-xs font-semibold" style={{ color: 'var(--text-secondary)' }}>
            📋 全部比例
          </span>
        </div>
        <div className="grid grid-cols-4 gap-2">
          {aspectRatios.map((ratio) => (
            <button
              key={ratio.id}
              onClick={() => onChange(ratio.id, { width: ratio.width, height: ratio.height })}
              className={`group relative p-3 rounded-lg border-2 transition-all ${
                selected === ratio.id
                  ? 'border-purple-500 bg-purple-500/10 scale-105'
                  : 'border-transparent hover:border-purple-500/30 hover:scale-105'
              }`}
              style={{ 
                background: selected === ratio.id ? undefined : 'var(--bg-tertiary)',
              }}
              title={`${ratio.description} - ${ratio.size}`}
            >
              <div className="flex flex-col items-center gap-1">
                <span className="text-xl">{ratio.icon}</span>
                <span className="text-xs font-semibold" style={{ color: 'var(--text-primary)' }}>
                  {ratio.id}
                </span>
              </div>
              
              {/* 悬停提示 */}
              <div className="absolute left-1/2 -translate-x-1/2 -top-12 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
                <div className="bg-black/90 text-white text-xs px-2 py-1 rounded whitespace-nowrap">
                  {ratio.description}
                  <div className="absolute left-1/2 -translate-x-1/2 top-full w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-black/90"></div>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* 预览框 */}
      <div className="p-4 rounded-lg" style={{ background: 'var(--bg-tertiary)' }}>
        <div className="flex items-center justify-center h-24">
          {selectedRatio && (
            <div 
              className="border-2 border-dashed border-purple-500/50 flex items-center justify-center"
              style={{
                width: `${Math.min(selectedRatio.width / 20, 120)}px`,
                height: `${Math.min(selectedRatio.height / 20, 80)}px`,
              }}
            >
              <div className="text-center">
                <div className="text-xs font-mono font-semibold" style={{ color: 'var(--text-primary)' }}>
                  {selectedRatio.id}
                </div>
                <div className="text-xs" style={{ color: 'var(--text-secondary)' }}>
                  {selectedRatio.width}×{selectedRatio.height}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export { aspectRatios, type AspectRatio };

