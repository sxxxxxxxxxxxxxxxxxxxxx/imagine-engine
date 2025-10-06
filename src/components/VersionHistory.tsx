'use client';

import { useState, useEffect } from 'react';

interface VersionNode {
  id: string;
  imageUrl: string;
  prompt: string;
  timestamp: number;
  type: 'generate' | 'edit';
  tool?: string;
  parentId?: string;
  children: string[];
  metadata?: {
    style?: string;
    seed?: number;
    model?: string;
  };
}

interface VersionHistoryProps {
  currentImageUrl?: string;
  onVersionSelect: (version: VersionNode) => void;
  onCompareVersions: (versions: VersionNode[]) => void;
  isVisible: boolean;
  onClose: () => void;
}

export default function VersionHistory({ 
  currentImageUrl, 
  onVersionSelect, 
  onCompareVersions,
  isVisible, 
  onClose 
}: VersionHistoryProps) {
  const [versions, setVersions] = useState<VersionNode[]>([]);
  const [selectedVersions, setSelectedVersions] = useState<string[]>([]);
  const [viewMode, setViewMode] = useState<'tree' | 'list' | 'compare'>('list');
  const [expandedNodes, setExpandedNodes] = useState<Set<string>>(new Set());

  // 从localStorage加载版本历史
  useEffect(() => {
    const savedVersions = localStorage.getItem('imagine-engine-versions');
    if (savedVersions) {
      try {
        const parsed = JSON.parse(savedVersions);
        setVersions(parsed);
      } catch (error) {
        console.error('Failed to load version history:', error);
      }
    }
  }, []);

  // 保存版本历史到localStorage
  const saveVersions = (newVersions: VersionNode[]) => {
    setVersions(newVersions);
    localStorage.setItem('imagine-engine-versions', JSON.stringify(newVersions));
  };

  // 添加新版本
  const addVersion = (imageUrl: string, prompt: string, type: 'generate' | 'edit', tool?: string, parentId?: string) => {
    const newVersion: VersionNode = {
      id: Date.now().toString(),
      imageUrl,
      prompt,
      timestamp: Date.now(),
      type,
      tool,
      parentId,
      children: [],
      metadata: {
        style: 'realistic',
        seed: Math.floor(Math.random() * 1000000),
        model: 'gemini-2.5-flash-image-preview'
      }
    };

    const updatedVersions = [...versions, newVersion];
    
    // 更新父节点的children
    if (parentId) {
      const parentIndex = updatedVersions.findIndex(v => v.id === parentId);
      if (parentIndex !== -1) {
        updatedVersions[parentIndex].children.push(newVersion.id);
      }
    }

    saveVersions(updatedVersions);
  };

  // 切换节点展开状态
  const toggleNodeExpansion = (nodeId: string) => {
    const newExpanded = new Set(expandedNodes);
    if (newExpanded.has(nodeId)) {
      newExpanded.delete(nodeId);
    } else {
      newExpanded.add(nodeId);
    }
    setExpandedNodes(newExpanded);
  };

  // 选择版本进行对比
  const toggleVersionSelection = (versionId: string) => {
    setSelectedVersions(prev => {
      if (prev.includes(versionId)) {
        return prev.filter(id => id !== versionId);
      } else if (prev.length < 4) { // 最多选择4个版本对比
        return [...prev, versionId];
      }
      return prev;
    });
  };

  // 开始对比
  const startComparison = () => {
    const selectedVersionObjects = versions.filter(v => selectedVersions.includes(v.id));
    onCompareVersions(selectedVersionObjects);
    setViewMode('compare');
  };

  // 清除历史
  const clearHistory = () => {
    if (confirm('确定要清除所有版本历史吗？此操作不可撤销。')) {
      setVersions([]);
      setSelectedVersions([]);
      localStorage.removeItem('imagine-engine-versions');
    }
  };

  // 构建树形结构
  const buildTree = () => {
    const rootNodes = versions.filter(v => !v.parentId);
    const nodeMap = new Map(versions.map(v => [v.id, v]));
    
    const buildNode = (node: VersionNode): any => ({
      ...node,
      children: node.children.map(childId => {
        const child = nodeMap.get(childId);
        return child ? buildNode(child) : null;
      }).filter(Boolean)
    });

    return rootNodes.map(buildNode);
  };

  // 渲染树形节点
  const renderTreeNode = (node: any, level = 0) => {
    const hasChildren = node.children && node.children.length > 0;
    const isExpanded = expandedNodes.has(node.id);
    const isSelected = selectedVersions.includes(node.id);

    return (
      <div key={node.id} className="select-none">
        <div 
          className={`
            flex items-center p-2 rounded cursor-pointer transition-colors
            ${isSelected ? 'bg-blue-100 border border-blue-300' : 'hover:bg-gray-50'}
          `}
          style={{ marginLeft: `${level * 20}px` }}
          onClick={() => onVersionSelect(node)}
        >
          {/* 展开/收起按钮 */}
          {hasChildren && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                toggleNodeExpansion(node.id);
              }}
              className="mr-2 w-4 h-4 flex items-center justify-center text-gray-500 hover:text-gray-700"
            >
              {isExpanded ? '▼' : '▶'}
            </button>
          )}
          
          {/* 缩略图 */}
          <img
            src={node.imageUrl}
            alt={node.prompt}
            className="w-12 h-12 object-cover rounded mr-3"
          />
          
          {/* 信息 */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center space-x-2 mb-1">
              <span className={`
                text-xs px-2 py-1 rounded
                ${node.type === 'generate' ? 'bg-blue-100 text-blue-700' : 'bg-green-100 text-green-700'}
              `}>
                {node.type === 'generate' ? '生成' : '编辑'}
              </span>
              {node.tool && (
                <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                  {node.tool}
                </span>
              )}
            </div>
            <p className="text-sm font-medium text-gray-900 truncate">
              {node.prompt}
            </p>
            <p className="text-xs text-gray-500">
              {new Date(node.timestamp).toLocaleString()}
            </p>
          </div>
          
          {/* 选择框 */}
          <input
            type="checkbox"
            checked={isSelected}
            onChange={(e) => {
              e.stopPropagation();
              toggleVersionSelection(node.id);
            }}
            className="ml-2"
          />
        </div>
        
        {/* 子节点 */}
        {hasChildren && isExpanded && (
          <div>
            {node.children.map((child: any) => renderTreeNode(child, level + 1))}
          </div>
        )}
      </div>
    );
  };

  // 渲染列表视图
  const renderListView = () => (
    <div className="space-y-2 max-h-96 overflow-y-auto">
      {versions.slice().reverse().map(version => {
        const isSelected = selectedVersions.includes(version.id);
        return (
          <div
            key={version.id}
            className={`
              flex items-center p-3 rounded-lg cursor-pointer transition-colors
              ${isSelected ? 'bg-blue-100 border border-blue-300' : 'bg-gray-50 hover:bg-gray-100'}
            `}
            onClick={() => onVersionSelect(version)}
          >
            <img
              src={version.imageUrl}
              alt={version.prompt}
              className="w-16 h-16 object-cover rounded mr-4"
            />
            
            <div className="flex-1 min-w-0">
              <div className="flex items-center space-x-2 mb-2">
                <span className={`
                  text-xs px-2 py-1 rounded
                  ${version.type === 'generate' ? 'bg-blue-100 text-blue-700' : 'bg-green-100 text-green-700'}
                `}>
                  {version.type === 'generate' ? '🎨 生成' : '✂️ 编辑'}
                </span>
                {version.tool && (
                  <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                    {version.tool}
                  </span>
                )}
              </div>
              <p className="text-sm font-medium text-gray-900 line-clamp-2 mb-1">
                {version.prompt}
              </p>
              <p className="text-xs text-gray-500">
                {new Date(version.timestamp).toLocaleString()}
              </p>
            </div>
            
            <input
              type="checkbox"
              checked={isSelected}
              onChange={(e) => {
                e.stopPropagation();
                toggleVersionSelection(version.id);
              }}
              className="ml-4"
            />
          </div>
        );
      })}
    </div>
  );

  // 渲染对比视图
  const renderCompareView = () => {
    const selectedVersionObjects = versions.filter(v => selectedVersions.includes(v.id));
    
    return (
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="font-semibold">版本对比 ({selectedVersionObjects.length})</h3>
          <button
            onClick={() => setViewMode('list')}
            className="text-sm text-blue-600 hover:text-blue-800"
          >
            返回列表
          </button>
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          {selectedVersionObjects.map(version => (
            <div key={version.id} className="border rounded-lg p-3">
              <img
                src={version.imageUrl}
                alt={version.prompt}
                className="w-full h-32 object-cover rounded mb-2"
              />
              <p className="text-sm font-medium mb-1">{version.prompt}</p>
              <p className="text-xs text-gray-500">
                {new Date(version.timestamp).toLocaleString()}
              </p>
            </div>
          ))}
        </div>
      </div>
    );
  };

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[80vh] overflow-hidden">
        {/* 头部 */}
        <div className="flex justify-between items-center p-6 border-b">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">📚 版本历史</h2>
            <p className="text-gray-600 mt-1">
              {versions.length} 个版本 | {selectedVersions.length} 个已选择
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-2xl"
          >
            ✕
          </button>
        </div>

        {/* 工具栏 */}
        <div className="p-4 border-b bg-gray-50">
          <div className="flex justify-between items-center">
            {/* 视图切换 */}
            <div className="flex space-x-2">
              <button
                onClick={() => setViewMode('list')}
                className={`px-3 py-1 rounded text-sm ${viewMode === 'list' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'}`}
              >
                📋 列表
              </button>
              <button
                onClick={() => setViewMode('tree')}
                className={`px-3 py-1 rounded text-sm ${viewMode === 'tree' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'}`}
              >
                🌳 树形
              </button>
            </div>

            {/* 操作按钮 */}
            <div className="flex space-x-2">
              {selectedVersions.length >= 2 && (
                <button
                  onClick={startComparison}
                  className="px-3 py-1 bg-green-600 text-white rounded text-sm hover:bg-green-700"
                >
                  🔍 对比 ({selectedVersions.length})
                </button>
              )}
              <button
                onClick={() => setSelectedVersions([])}
                className="px-3 py-1 bg-gray-600 text-white rounded text-sm hover:bg-gray-700"
              >
                清除选择
              </button>
              <button
                onClick={clearHistory}
                className="px-3 py-1 bg-red-600 text-white rounded text-sm hover:bg-red-700"
              >
                清空历史
              </button>
            </div>
          </div>
        </div>

        {/* 内容区域 */}
        <div className="p-6 overflow-y-auto max-h-96">
          {versions.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <div className="text-4xl mb-2">📚</div>
              <p>暂无版本历史</p>
              <p className="text-sm">开始创作后，版本将在这里显示</p>
            </div>
          ) : viewMode === 'compare' ? (
            renderCompareView()
          ) : viewMode === 'tree' ? (
            <div className="space-y-1">
              {buildTree().map(node => renderTreeNode(node))}
            </div>
          ) : (
            renderListView()
          )}
        </div>

        {/* 底部说明 */}
        <div className="px-6 py-4 bg-gray-50 border-t">
          <div className="text-xs text-gray-500">
            <p className="font-medium mb-1">💡 使用说明：</p>
            <ul className="space-y-1">
              <li>• 点击版本可以切换到该版本</li>
              <li>• 勾选多个版本可以进行对比</li>
              <li>• 树形视图显示版本之间的关系</li>
              <li>• 所有版本都会自动保存到本地</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}