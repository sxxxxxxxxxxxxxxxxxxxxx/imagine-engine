'use client';

import { useState, useRef, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useLanguage } from '@/contexts/LanguageContext';
import { GitBranch, Download, Upload, Trash2, Plus, Save, Loader2, CheckCircle2, X, Circle, Square, Triangle, ArrowRight, Minus } from 'lucide-react';
import Link from 'next/link';
import AuthModal from '@/components/AuthModal';
import { downloadImage } from '@/lib/downloadUtils';
import { toastManager } from '@/components/Toast';

interface Node {
  id: string;
  type: 'rectangle' | 'circle' | 'diamond' | 'rounded';
  x: number;
  y: number;
  width: number;
  height: number;
  text: string;
  color: string;
  borderColor: string;
}

interface Connection {
  id: string;
  from: string;
  to: string;
  label?: string;
}

export default function SVGEditorPage() {
  const { isLoggedIn } = useAuth();
  const { language } = useLanguage();
  const [nodes, setNodes] = useState<Node[]>([]);
  const [connections, setConnections] = useState<Connection[]>([]);
  const [selectedNode, setSelectedNode] = useState<string | null>(null);
  const [selectedConnection, setSelectedConnection] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [svgCode, setSvgCode] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const svgRef = useRef<SVGSVGElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const nodeTypes = [
    { id: 'rectangle', icon: Square, labelZh: '矩形', labelEn: 'Rectangle' },
    { id: 'circle', icon: Circle, labelZh: '圆形', labelEn: 'Circle' },
    { id: 'diamond', icon: Triangle, labelZh: '菱形', labelEn: 'Diamond' },
    { id: 'rounded', icon: Square, labelZh: '圆角矩形', labelEn: 'Rounded' },
  ];

  const colors = [
    { name: 'primary', value: '#14b8a6', labelZh: '主色', labelEn: 'Primary' },
    { name: 'blue', value: '#3b82f6', labelZh: '蓝色', labelEn: 'Blue' },
    { name: 'green', value: '#10b981', labelZh: '绿色', labelEn: 'Green' },
    { name: 'orange', value: '#f59e0b', labelZh: '橙色', labelEn: 'Orange' },
    { name: 'purple', value: '#8b5cf6', labelZh: '紫色', labelEn: 'Purple' },
  ];

  // 添加节点
  const addNode = (type: Node['type']) => {
    const newNode: Node = {
      id: `node-${Date.now()}`,
      type,
      x: 200 + nodes.length * 50,
      y: 150 + nodes.length * 50,
      width: 120,
      height: 60,
      text: language === 'zh' ? '新节点' : 'New Node',
      color: '#14b8a6',
      borderColor: '#0d9488',
    };
    setNodes([...nodes, newNode]);
    setSelectedNode(newNode.id);
  };

  // 删除节点
  const deleteNode = (nodeId: string) => {
    setNodes(nodes.filter(n => n.id !== nodeId));
    setConnections(connections.filter(c => c.from !== nodeId && c.to !== nodeId));
    if (selectedNode === nodeId) setSelectedNode(null);
  };

  // 更新节点
  const updateNode = (nodeId: string, updates: Partial<Node>) => {
    setNodes(nodes.map(n => n.id === nodeId ? { ...n, ...updates } : n));
  };

  // 开始拖拽
  const handleMouseDown = (nodeId: string, e: React.MouseEvent) => {
    const node = nodes.find(n => n.id === nodeId);
    if (!node) return;
    
    setIsDragging(true);
    setSelectedNode(nodeId);
    const rect = svgRef.current?.getBoundingClientRect();
    if (rect) {
      setDragOffset({
        x: e.clientX - rect.left - node.x,
        y: e.clientY - rect.top - node.y,
      });
    }
  };

  // 拖拽中
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging || !selectedNode) return;
      
      const rect = svgRef.current?.getBoundingClientRect();
      if (rect) {
        const x = e.clientX - rect.left - dragOffset.x;
        const y = e.clientY - rect.top - dragOffset.y;
        updateNode(selectedNode, { x: Math.max(0, x), y: Math.max(0, y) });
      }
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
      return () => {
        window.removeEventListener('mousemove', handleMouseMove);
        window.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDragging, selectedNode, dragOffset, nodes]);

  // 生成SVG代码
  const generateSVG = () => {
    if (nodes.length === 0) {
      toastManager.warning(language === 'zh' ? '请先添加节点' : 'Please add nodes first');
      return;
    }

    setIsGenerating(true);
    
    let svg = `<svg width="800" height="600" xmlns="http://www.w3.org/2000/svg">\n`;
    svg += `  <defs>\n`;
    svg += `    <style>\n`;
    svg += `      .node-text { font-family: Arial, sans-serif; font-size: 14px; fill: #1f2937; text-anchor: middle; dominant-baseline: middle; }\n`;
    svg += `      .connection-line { stroke: #6b7280; stroke-width: 2; fill: none; marker-end: url(#arrowhead); }\n`;
    svg += `    </style>\n`;
    svg += `    <marker id="arrowhead" markerWidth="10" markerHeight="10" refX="9" refY="3" orient="auto">\n`;
    svg += `      <polygon points="0 0, 10 3, 0 6" fill="#6b7280" />\n`;
    svg += `    </marker>\n`;
    svg += `  </defs>\n\n`;

    // 绘制连接线
    connections.forEach(conn => {
      const fromNode = nodes.find(n => n.id === conn.from);
      const toNode = nodes.find(n => n.id === conn.to);
      if (fromNode && toNode) {
        const x1 = fromNode.x + fromNode.width / 2;
        const y1 = fromNode.y + fromNode.height / 2;
        const x2 = toNode.x + toNode.width / 2;
        const y2 = toNode.y + toNode.height / 2;
        svg += `  <line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" class="connection-line" />\n`;
      }
    });

    // 绘制节点
    nodes.forEach(node => {
      const cx = node.x + node.width / 2;
      const cy = node.y + node.height / 2;
      
      if (node.type === 'circle') {
        svg += `  <circle cx="${cx}" cy="${cy}" r="${node.width / 2}" fill="${node.color}" stroke="${node.borderColor}" stroke-width="2" />\n`;
      } else if (node.type === 'diamond') {
        const points = `${cx},${node.y} ${node.x + node.width},${cy} ${cx},${node.y + node.height} ${node.x},${cy}`;
        svg += `  <polygon points="${points}" fill="${node.color}" stroke="${node.borderColor}" stroke-width="2" />\n`;
      } else if (node.type === 'rounded') {
        svg += `  <rect x="${node.x}" y="${node.y}" width="${node.width}" height="${node.height}" rx="8" ry="8" fill="${node.color}" stroke="${node.borderColor}" stroke-width="2" />\n`;
      } else {
        svg += `  <rect x="${node.x}" y="${node.y}" width="${node.width}" height="${node.height}" fill="${node.color}" stroke="${node.borderColor}" stroke-width="2" />\n`;
      }
      
      svg += `  <text x="${cx}" y="${cy}" class="node-text">${node.text}</text>\n`;
    });

    svg += `</svg>`;
    
    setSvgCode(svg);
    setIsGenerating(false);
    toastManager.success(language === 'zh' ? 'SVG代码已生成' : 'SVG code generated');
  };

  // 下载SVG
  const downloadSVG = () => {
    if (!svgCode) {
      generateSVG();
      setTimeout(() => {
        if (svgCode) {
          const blob = new Blob([svgCode], { type: 'image/svg+xml' });
          const url = URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = 'flowchart.svg';
          a.click();
          URL.revokeObjectURL(url);
        }
      }, 500);
      return;
    }
    
    const blob = new Blob([svgCode], { type: 'image/svg+xml' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'flowchart.svg';
    a.click();
    URL.revokeObjectURL(url);
    toastManager.success(language === 'zh' ? 'SVG已下载' : 'SVG downloaded');
  };

  // 清空画布
  const clearCanvas = () => {
    if (confirm(language === 'zh' ? '确定要清空画布吗？' : 'Are you sure you want to clear the canvas?')) {
      setNodes([]);
      setConnections([]);
      setSvgCode('');
      setSelectedNode(null);
    }
  };

  const selectedNodeData = nodes.find(n => n.id === selectedNode);

  return (
    <div className="page-container">
      <div className="content-wrapper max-w-7xl mx-auto">
        {/* 页面标题 */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-500/20 rounded-2xl mb-4">
            <GitBranch className="w-8 h-8 text-primary-500" />
          </div>
          <h1 className="text-4xl font-bold text-dark-900 dark:text-dark-50 mb-3">
            {language === 'zh' ? 'SVG流程图编辑器' : 'SVG Flowchart Editor'}
          </h1>
          <p className="text-lg text-dark-600 dark:text-dark-400 max-w-2xl mx-auto">
            {language === 'zh' 
              ? '可视化创建流程图、架构图、思维导图，导出SVG格式' 
              : 'Create flowcharts, diagrams, and mind maps visually, export as SVG'}
          </p>
        </div>

        {/* 工具栏 */}
        <div className="card p-4 mb-6">
          <div className="flex flex-wrap items-center gap-4">
            {/* 添加节点 */}
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-dark-700 dark:text-dark-300">
                {language === 'zh' ? '添加节点：' : 'Add Node:'}
              </span>
              {nodeTypes.map(type => {
                const Icon = type.icon;
                return (
                  <button
                    key={type.id}
                    onClick={() => addNode(type.id as Node['type'])}
                    className="p-2 rounded-lg bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400 hover:bg-primary-100 dark:hover:bg-primary-900/30 transition-colors"
                    title={language === 'zh' ? type.labelZh : type.labelEn}
                  >
                    <Icon className="w-5 h-5" />
                  </button>
                );
              })}
            </div>

            <div className="h-6 w-px bg-dark-200 dark:bg-dark-700" />

            {/* 操作按钮 */}
            <button
              onClick={generateSVG}
              disabled={isGenerating || nodes.length === 0}
              className="btn-primary px-4 py-2 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  {language === 'zh' ? '生成中...' : 'Generating...'}
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  {language === 'zh' ? '生成SVG' : 'Generate SVG'}
                </>
              )}
            </button>

            <button
              onClick={downloadSVG}
              disabled={!svgCode && nodes.length === 0}
              className="btn-outline px-4 py-2 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Download className="w-4 h-4 mr-2" />
              {language === 'zh' ? '下载SVG' : 'Download SVG'}
            </button>

            <button
              onClick={clearCanvas}
              className="btn-outline px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20"
            >
              <Trash2 className="w-4 h-4 mr-2" />
              {language === 'zh' ? '清空' : 'Clear'}
            </button>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* 画布区域 */}
          <div className="lg:col-span-2">
            <div 
              ref={containerRef}
              className="card p-6 bg-dark-50 dark:bg-dark-900/50 relative overflow-hidden"
              style={{ minHeight: '600px' }}
            >
              <svg
                ref={svgRef}
                width="100%"
                height="600"
                className="border border-dark-200 dark:border-dark-700 rounded-lg bg-white dark:bg-dark-800"
                style={{ cursor: isDragging ? 'grabbing' : 'default' }}
              >
                {/* 连接线 */}
                {connections.map(conn => {
                  const fromNode = nodes.find(n => n.id === conn.from);
                  const toNode = nodes.find(n => n.id === conn.to);
                  if (!fromNode || !toNode) return null;
                  
                  const x1 = fromNode.x + fromNode.width / 2;
                  const y1 = fromNode.y + fromNode.height / 2;
                  const x2 = toNode.x + toNode.width / 2;
                  const y2 = toNode.y + toNode.height / 2;
                  
                  return (
                    <line
                      key={conn.id}
                      x1={x1}
                      y1={y1}
                      x2={x2}
                      y2={y2}
                      stroke="#6b7280"
                      strokeWidth="2"
                      markerEnd="url(#arrowhead)"
                      className="cursor-pointer"
                      onClick={() => setSelectedConnection(conn.id)}
                      style={{
                        stroke: selectedConnection === conn.id ? '#14b8a6' : '#6b7280',
                        strokeWidth: selectedConnection === conn.id ? '3' : '2',
                      }}
                    />
                  );
                })}

                {/* 箭头标记 */}
                <defs>
                  <marker id="arrowhead" markerWidth="10" markerHeight="10" refX="9" refY="3" orient="auto">
                    <polygon points="0 0, 10 3, 0 6" fill="#6b7280" />
                  </marker>
                </defs>

                {/* 节点 */}
                {nodes.map(node => {
                  const isSelected = selectedNode === node.id;
                  const cx = node.x + node.width / 2;
                  const cy = node.y + node.height / 2;
                  
                  return (
                    <g key={node.id}>
                      {node.type === 'circle' ? (
                        <circle
                          cx={cx}
                          cy={cy}
                          r={node.width / 2}
                          fill={node.color}
                          stroke={isSelected ? '#14b8a6' : node.borderColor}
                          strokeWidth={isSelected ? '3' : '2'}
                          className="cursor-move"
                          onMouseDown={(e) => handleMouseDown(node.id, e)}
                        />
                      ) : node.type === 'diamond' ? (
                        <polygon
                          points={`${cx},${node.y} ${node.x + node.width},${cy} ${cx},${node.y + node.height} ${node.x},${cy}`}
                          fill={node.color}
                          stroke={isSelected ? '#14b8a6' : node.borderColor}
                          strokeWidth={isSelected ? '3' : '2'}
                          className="cursor-move"
                          onMouseDown={(e) => handleMouseDown(node.id, e)}
                        />
                      ) : node.type === 'rounded' ? (
                        <rect
                          x={node.x}
                          y={node.y}
                          width={node.width}
                          height={node.height}
                          rx="8"
                          ry="8"
                          fill={node.color}
                          stroke={isSelected ? '#14b8a6' : node.borderColor}
                          strokeWidth={isSelected ? '3' : '2'}
                          className="cursor-move"
                          onMouseDown={(e) => handleMouseDown(node.id, e)}
                        />
                      ) : (
                        <rect
                          x={node.x}
                          y={node.y}
                          width={node.width}
                          height={node.height}
                          fill={node.color}
                          stroke={isSelected ? '#14b8a6' : node.borderColor}
                          strokeWidth={isSelected ? '3' : '2'}
                          className="cursor-move"
                          onMouseDown={(e) => handleMouseDown(node.id, e)}
                        />
                      )}
                      <text
                        x={cx}
                        y={cy}
                        textAnchor="middle"
                        dominantBaseline="middle"
                        fill="#1f2937"
                        className="dark:fill-dark-50 pointer-events-none select-none"
                        style={{ fontSize: '14px', fontFamily: 'Arial, sans-serif' }}
                      >
                        {node.text}
                      </text>
                    </g>
                  );
                })}
              </svg>
            </div>
          </div>

          {/* 属性面板 */}
          <div className="space-y-6">
            {selectedNodeData ? (
              <div className="card p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-bold text-dark-900 dark:text-dark-50">
                    {language === 'zh' ? '节点属性' : 'Node Properties'}
                  </h3>
                  <button
                    onClick={() => setSelectedNode(null)}
                    className="p-1 rounded hover:bg-dark-100 dark:hover:bg-dark-800"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                {/* 文本 */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-dark-700 dark:text-dark-300 mb-2">
                    {language === 'zh' ? '文本' : 'Text'}
                  </label>
                  <input
                    type="text"
                    value={selectedNodeData.text}
                    onChange={(e) => updateNode(selectedNodeData.id, { text: e.target.value })}
                    className="w-full px-3 py-2 border border-dark-200 dark:border-dark-700 rounded-lg bg-white dark:bg-dark-800"
                  />
                </div>

                {/* 颜色 */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-dark-700 dark:text-dark-300 mb-2">
                    {language === 'zh' ? '填充颜色' : 'Fill Color'}
                  </label>
                  <div className="flex gap-2">
                    {colors.map(color => (
                      <button
                        key={color.name}
                        onClick={() => updateNode(selectedNodeData.id, { color: color.value })}
                        className={`w-10 h-10 rounded-lg border-2 ${
                          selectedNodeData.color === color.value
                            ? 'border-primary-500 ring-2 ring-primary-500/50'
                            : 'border-dark-200 dark:border-dark-700'
                        }`}
                        style={{ backgroundColor: color.value }}
                        title={language === 'zh' ? color.labelZh : color.labelEn}
                      />
                    ))}
                  </div>
                </div>

                {/* 尺寸 */}
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-medium text-dark-700 dark:text-dark-300 mb-2">
                      {language === 'zh' ? '宽度' : 'Width'}
                    </label>
                    <input
                      type="number"
                      value={selectedNodeData.width}
                      onChange={(e) => updateNode(selectedNodeData.id, { width: parseInt(e.target.value) || 120 })}
                      className="w-full px-3 py-2 border border-dark-200 dark:border-dark-700 rounded-lg bg-white dark:bg-dark-800"
                      min="50"
                      max="300"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-dark-700 dark:text-dark-300 mb-2">
                      {language === 'zh' ? '高度' : 'Height'}
                    </label>
                    <input
                      type="number"
                      value={selectedNodeData.height}
                      onChange={(e) => updateNode(selectedNodeData.id, { height: parseInt(e.target.value) || 60 })}
                      className="w-full px-3 py-2 border border-dark-200 dark:border-dark-700 rounded-lg bg-white dark:bg-dark-800"
                      min="30"
                      max="200"
                    />
                  </div>
                </div>

                {/* 删除按钮 */}
                <button
                  onClick={() => deleteNode(selectedNodeData.id)}
                  className="w-full py-2 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors"
                >
                  <Trash2 className="w-4 h-4 inline mr-2" />
                  {language === 'zh' ? '删除节点' : 'Delete Node'}
                </button>
              </div>
            ) : (
              <div className="card p-6 text-center text-dark-500 dark:text-dark-400">
                {language === 'zh' ? '选择一个节点来编辑属性' : 'Select a node to edit properties'}
              </div>
            )}

            {/* 使用提示 */}
            <div className="card p-6 bg-primary-50 dark:bg-primary-900/20">
              <h4 className="font-semibold text-dark-900 dark:text-dark-50 mb-3">
                {language === 'zh' ? '使用提示' : 'Tips'}
              </h4>
              <ul className="space-y-2 text-sm text-dark-600 dark:text-dark-400">
                <li className="flex items-start gap-2">
                  <Plus className="w-4 h-4 mt-0.5 flex-shrink-0" />
                  <span>{language === 'zh' ? '点击工具栏按钮添加节点' : 'Click toolbar buttons to add nodes'}</span>
                </li>
                <li className="flex items-start gap-2">
                  <ArrowRight className="w-4 h-4 mt-0.5 flex-shrink-0" />
                  <span>{language === 'zh' ? '拖拽节点移动位置' : 'Drag nodes to move them'}</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 mt-0.5 flex-shrink-0" />
                  <span>{language === 'zh' ? '点击节点编辑属性' : 'Click nodes to edit properties'}</span>
                </li>
                <li className="flex items-start gap-2">
                  <Download className="w-4 h-4 mt-0.5 flex-shrink-0" />
                  <span>{language === 'zh' ? '生成并下载SVG文件' : 'Generate and download SVG file'}</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* SVG代码预览 */}
        {svgCode && (
          <div className="card p-6 mt-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-dark-900 dark:text-dark-50">
                {language === 'zh' ? 'SVG代码' : 'SVG Code'}
              </h3>
              <button
                onClick={() => {
                  navigator.clipboard.writeText(svgCode);
                  toastManager.success(language === 'zh' ? '代码已复制' : 'Code copied');
                }}
                className="btn-outline px-4 py-2 text-sm"
              >
                {language === 'zh' ? '复制代码' : 'Copy Code'}
              </button>
            </div>
            <pre className="bg-dark-900 dark:bg-dark-950 text-green-400 p-4 rounded-lg overflow-x-auto text-xs">
              <code>{svgCode}</code>
            </pre>
          </div>
        )}

        <AuthModal isOpen={showAuthModal} onClose={() => setShowAuthModal(false)} />
      </div>
    </div>
  );
}

