'use client';

import { useState } from 'react';

export interface HistoryItem {
  id: string;
  type: 'generate' | 'edit' | 'fusion';
  imageUrl: string;
  prompt: string;
  timestamp: number;
  parentId?: string;
  variants?: HistoryItem[];
  metadata?: {
    style?: string;
    aspectRatio?: string;
    seed?: number;
    originalSize?: { width: number; height: number };
  };
}

interface EnhancedHistoryProps {
  isVisible: boolean;
  onClose: () => void;
  items: HistoryItem[];
  onSelectItem: (item: HistoryItem) => void;
  onDeleteItem: (id: string) => void;
  onCreateVariant?: (item: HistoryItem) => void;
}

export default function EnhancedHistory({ 
  isVisible, 
  onClose, 
  items,
  onSelectItem,
  onDeleteItem,
  onCreateVariant
}: EnhancedHistoryProps) {
  const [selectedItemId, setSelectedItemId] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'tree'>('grid');
  const [filterType, setFilterType] = useState<'all' | 'generate' | 'edit' | 'fusion'>('all');
  const [compareMode, setCompareMode] = useState(false);
  const [compareItems, setCompareItems] = useState<string[]>([]);

  if (!isVisible) return null;

  const filteredItems = items.filter(item => 
    filterType === 'all' || item.type === filterType
  );

  const sortedItems = [...filteredItems].sort((a, b) => b.timestamp - a.timestamp);

  const typeLabels = {
    generate: '生成',
    edit: '编辑',
    fusion: '融合'
  };

  const typeColors = {
    generate: 'bg-blue-500/20 text-blue-600',
    edit: 'bg-green-500/20 text-green-600',
    fusion: 'bg-purple-500/20 text-purple-600'
  };

  const toggleCompareItem = (id: string) => {
    if (compareItems.includes(id)) {
      setCompareItems(compareItems.filter(i => i !== id));
    } else if (compareItems.length < 4) {
      setCompareItems([...compareItems, id]);
    }
  };

  const getCompareImages = () => {
    return sortedItems.filter(item => compareItems.includes(item.id));
  };

  return (
    <div 
      className="fixed inset-y-0 right-0 w-full md:w-96 z-40 shadow-2xl flex flex-col"
      style={{ background: 'var(--bg-secondary)', borderLeft: '1px solid var(--border-subtle)' }}
    >
      {/* 头部 */}
      <div className="px-4 py-4 border-b" style={{ borderColor: 'var(--border-subtle)' }}>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-lg font-bold flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
            <span className="text-xl">📚</span>
            创作历史
          </h3>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full hover:bg-red-500/10 flex items-center justify-center transition-colors"
          >
            <span className="text-xl">×</span>
          </button>
        </div>

        {/* 筛选和模式切换 */}
        <div className="flex items-center gap-2 mb-2">
          <button
            onClick={() => setViewMode(viewMode === 'grid' ? 'tree' : 'grid')}
            className="text-xs px-3 py-1 rounded-lg btn-secondary"
            title="切换视图模式"
          >
            {viewMode === 'grid' ? '🔲 网格' : '🌳 树状'}
          </button>
          <button
            onClick={() => setCompareMode(!compareMode)}
            className={`text-xs px-3 py-1 rounded-lg ${
              compareMode ? 'btn-gradient' : 'btn-secondary'
            }`}
            title="对比模式"
          >
            {compareMode ? '✅ 对比中' : '⚖️ 对比'}
          </button>
        </div>

        {/* 类型筛选 */}
        <div className="flex gap-2">
          {(['all', 'generate', 'edit', 'fusion'] as const).map((type) => (
            <button
              key={type}
              onClick={() => setFilterType(type)}
              className={`text-xs px-3 py-1 rounded-full transition-all ${
                filterType === type
                  ? 'bg-gradient-primary text-white'
                  : 'btn-secondary'
              }`}
            >
              {type === 'all' ? '全部' : typeLabels[type]}
            </button>
          ))}
        </div>

        {/* 统计信息 */}
        <div className="mt-3 text-xs" style={{ color: 'var(--text-muted)' }}>
          共 {sortedItems.length} 个历史记录
          {compareMode && ` · 已选择 ${compareItems.length}/4`}
        </div>
      </div>

      {/* 对比视图 */}
      {compareMode && compareItems.length > 0 && (
        <div className="px-4 py-3 border-b" style={{ borderColor: 'var(--border-subtle)', background: 'var(--bg-tertiary)' }}>
          <div className={`grid ${compareItems.length === 2 ? 'grid-cols-2' : 'grid-cols-2'} gap-2`}>
            {getCompareImages().map((item) => (
              <div key={item.id} className="relative">
                <img 
                  src={item.imageUrl} 
                  alt="" 
                  className="w-full aspect-square object-cover rounded"
                />
                <button
                  onClick={() => toggleCompareItem(item.id)}
                  className="absolute top-1 right-1 w-5 h-5 bg-red-500 rounded-full text-white text-xs flex items-center justify-center"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
          {compareItems.length >= 2 && (
            <button
              onClick={() => setCompareItems([])}
              className="w-full mt-2 btn-secondary py-1 text-xs"
            >
              清空对比
            </button>
          )}
        </div>
      )}

      {/* 历史列表 */}
      <div className="flex-1 overflow-y-auto p-4">
        {sortedItems.length === 0 ? (
          <div className="text-center py-20">
            <span className="text-5xl">📭</span>
            <p className="mt-4 text-sm" style={{ color: 'var(--text-secondary)' }}>
              还没有历史记录
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {sortedItems.map((item) => (
              <div
                key={item.id}
                className={`group relative glass-card p-0 overflow-hidden cursor-pointer transition-all ${
                  selectedItemId === item.id ? 'ring-2 ring-purple-500' : ''
                } ${
                  compareMode && compareItems.includes(item.id) ? 'ring-2 ring-blue-500' : ''
                }`}
                onClick={() => {
                  if (compareMode) {
                    toggleCompareItem(item.id);
                  } else {
                    setSelectedItemId(item.id);
                    onSelectItem(item);
                  }
                }}
              >
                {/* 缩略图 */}
                <div className="relative aspect-square">
                  <img
                    src={item.imageUrl}
                    alt={item.prompt}
                    className="w-full h-full object-cover"
                  />
                  
                  {/* 类型标签 */}
                  <div className={`absolute top-2 left-2 px-2 py-0.5 rounded text-xs font-semibold ${typeColors[item.type]}`}>
                    {typeLabels[item.type]}
                  </div>

                  {/* 悬停操作 */}
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelectItem(item);
                      }}
                      className="btn-secondary px-3 py-1 text-xs"
                    >
                      📂 打开
                    </button>
                    {onCreateVariant && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onCreateVariant(item);
                        }}
                        className="btn-gradient px-3 py-1 text-xs"
                      >
                        🔄 变体
                      </button>
                    )}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        if (confirm('确定删除此记录？')) {
                          onDeleteItem(item.id);
                        }
                      }}
                      className="btn-secondary px-3 py-1 text-xs hover:bg-red-500/20"
                    >
                      🗑️
                    </button>
                  </div>

                  {/* 对比模式选择标识 */}
                  {compareMode && (
                    <div className={`absolute top-2 right-2 w-6 h-6 rounded-full flex items-center justify-center ${
                      compareItems.includes(item.id)
                        ? 'bg-blue-500 text-white'
                        : 'bg-white/20 text-white'
                    }`}>
                      {compareItems.includes(item.id) ? '✓' : ''}
                    </div>
                  )}
                </div>

                {/* 信息 */}
                <div className="p-3">
                  <p className="text-xs line-clamp-2 mb-2" style={{ color: 'var(--text-secondary)' }}>
                    {item.prompt}
                  </p>
                  <div className="flex items-center justify-between text-xs" style={{ color: 'var(--text-muted)' }}>
                    <span>{new Date(item.timestamp).toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' })}</span>
                    {item.metadata?.aspectRatio && (
                      <span className="font-mono">{item.metadata.aspectRatio}</span>
                    )}
                  </div>

                  {/* 变体数量 */}
                  {item.variants && item.variants.length > 0 && (
                    <div className="mt-2 text-xs px-2 py-1 rounded" style={{ 
                      background: 'var(--bg-tertiary)',
                      color: 'var(--text-secondary)'
                    }}>
                      {item.variants.length} 个变体
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 底部操作 */}
      <div className="px-4 py-3 border-t" style={{ borderColor: 'var(--border-subtle)' }}>
        <div className="flex gap-2">
          <button
            onClick={() => {
              if (confirm('确定清空所有历史记录？')) {
                items.forEach(item => onDeleteItem(item.id));
              }
            }}
            className="flex-1 btn-secondary py-2 text-xs"
            disabled={items.length === 0}
          >
            🗑️ 清空历史
          </button>
          <button
            onClick={() => {
              const data = JSON.stringify(items, null, 2);
              const blob = new Blob([data], { type: 'application/json' });
              const url = URL.createObjectURL(blob);
              const a = document.createElement('a');
              a.href = url;
              a.download = `history-${Date.now()}.json`;
              a.click();
            }}
            className="flex-1 btn-gradient py-2 text-xs"
            disabled={items.length === 0}
          >
            💾 导出历史
          </button>
        </div>
      </div>
    </div>
  );
}
