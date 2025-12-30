'use client';

interface GridBackgroundProps {
  opacity?: number;
  gridSize?: number;
}

/**
 * GridBackground 组件
 * 科技感网格背景
 * 适用于页面背景增强
 */
export default function GridBackground({ 
  opacity = 0.08,
  gridSize = 40 
}: GridBackgroundProps) {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {/* 网格层 */}
      <div 
        className="absolute inset-0"
        style={{
          opacity,
          backgroundImage: `linear-gradient(to right, #cbd5e1 1px, transparent 1px), linear-gradient(to bottom, #cbd5e1 1px, transparent 1px)`,
          backgroundSize: `${gridSize}px ${gridSize}px`,
          maskImage: 'radial-gradient(ellipse 60% 50% at 50% 0%, #000 70%, transparent 100%)',
        }}
      />
      
      {/* 噪点纹理 */}
      <div 
        className="absolute inset-0 opacity-[0.02] mix-blend-overlay"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`
        }}
      />
    </div>
  );
}

