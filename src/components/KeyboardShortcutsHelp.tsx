'use client';

interface Shortcut {
  key: string;
  description: string;
  category: 'navigation' | 'action' | 'panel';
}

const shortcuts: Shortcut[] = [
  // 导航快捷键
  { key: 'G', description: '切换到AI创作', category: 'navigation' },
  { key: 'E', description: '切换到AI编辑', category: 'navigation' },
  { key: 'T', description: '打开创意工坊', category: 'navigation' },
  { key: 'C', description: '打开AI伙伴', category: 'navigation' },
  { key: 'L', description: '查看创意画廊', category: 'navigation' },
  
  // 操作快捷键
  { key: 'Cmd/Ctrl + Enter', description: '执行生成/编辑', category: 'action' },
  { key: 'Shift + R', description: '重新生成', category: 'action' },
  
  // 面板切换
  { key: 'H', description: '显示/隐藏历史记录', category: 'panel' },
  { key: 'P', description: '显示/隐藏提示词画廊', category: 'panel' },
  { key: '?', description: '显示此帮助', category: 'panel' },
];

const categoryNames = {
  navigation: '🧭 导航',
  action: '⚡ 操作',
  panel: '📋 面板',
};

const categoryColors = {
  navigation: 'border-blue-500/30 bg-blue-500/10',
  action: 'border-green-500/30 bg-green-500/10',
  panel: 'border-purple-500/30 bg-purple-500/10',
};

interface KeyboardShortcutsHelpProps {
  isVisible: boolean;
  onClose: () => void;
}

export default function KeyboardShortcutsHelp({ isVisible, onClose }: KeyboardShortcutsHelpProps) {
  if (!isVisible) return null;

  const groupedShortcuts = shortcuts.reduce((acc, shortcut) => {
    if (!acc[shortcut.category]) {
      acc[shortcut.category] = [];
    }
    acc[shortcut.category].push(shortcut);
    return acc;
  }, {} as Record<string, Shortcut[]>);

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4" 
      style={{ background: 'rgba(0, 0, 0, 0.75)' }}
      onClick={onClose}
    >
      <div 
        className="w-full max-w-2xl max-h-[80vh] overflow-hidden rounded-2xl shadow-2xl flex flex-col"
        style={{ background: 'var(--bg-secondary)' }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* 头部 */}
        <div className="px-6 py-4 border-b" style={{ borderColor: 'var(--border-subtle)' }}>
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
                ⌨️ 键盘快捷键
              </h2>
              <p className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>
                使用快捷键提升200%工作效率
              </p>
            </div>
            <button
              onClick={onClose}
              className="w-10 h-10 rounded-full hover:bg-red-500/10 flex items-center justify-center transition-colors"
              style={{ color: 'var(--text-secondary)' }}
            >
              <span className="text-2xl">×</span>
            </button>
          </div>
        </div>

        {/* 内容区域 */}
        <div className="flex-1 overflow-y-auto p-6">
          {(Object.keys(groupedShortcuts) as Array<keyof typeof groupedShortcuts>).map((category) => (
            <div key={category} className="mb-6 last:mb-0">
              <h3 className="text-sm font-semibold mb-3 flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
                {categoryNames[category]}
              </h3>
              <div className="space-y-2">
                {groupedShortcuts[category].map((shortcut, index) => (
                  <div 
                    key={index}
                    className="flex items-center justify-between p-3 rounded-lg border"
                    style={{ 
                      background: 'var(--bg-tertiary)',
                      borderColor: 'var(--border-subtle)'
                    }}
                  >
                    <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                      {shortcut.description}
                    </span>
                    <kbd 
                      className={`px-3 py-1 rounded-lg text-xs font-mono font-semibold border ${categoryColors[category]}`}
                      style={{ color: 'var(--text-primary)' }}
                    >
                      {shortcut.key}
                    </kbd>
                  </div>
                ))}
              </div>
            </div>
          ))}

          {/* 提示 */}
          <div className="mt-6 p-4 rounded-xl" style={{ 
            background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.1) 0%, rgba(147, 51, 234, 0.1) 100%)',
            border: '1px solid rgba(59, 130, 246, 0.2)'
          }}>
            <h4 className="font-bold text-sm mb-2 flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
              <span className="text-lg">💡</span>
              温馨提示
            </h4>
            <ul className="text-sm space-y-1" style={{ color: 'var(--text-secondary)' }}>
              <li>• 快捷键在输入框外使用效果最佳</li>
              <li>• 在输入框内只有 Cmd/Ctrl + Enter 可用</li>
              <li>• 随时按 ? 键查看此帮助</li>
              <li>• Mac 用户使用 Cmd，Windows 用户使用 Ctrl</li>
            </ul>
          </div>
        </div>

        {/* 底部 */}
        <div className="px-6 py-3 border-t" style={{ borderColor: 'var(--border-subtle)' }}>
          <div className="flex items-center justify-center">
            <button
              onClick={onClose}
              className="btn-gradient px-6 py-2"
            >
              开始使用快捷键
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
