import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';

interface KeyboardShortcutsConfig {
  onGenerate?: () => void;
  onEdit?: () => void;
  onToggleHistory?: () => void;
  onTogglePromptGallery?: () => void;
  isGenerating?: boolean;
}

export function useKeyboardShortcuts(config: KeyboardShortcutsConfig = {}) {
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // 忽略在输入框中的按键（除了 Cmd/Ctrl + Enter）
      const isInputElement = 
        event.target instanceof HTMLInputElement ||
        event.target instanceof HTMLTextAreaElement;

      // Cmd/Ctrl + Enter: 生成/编辑
      if ((event.metaKey || event.ctrlKey) && event.key === 'Enter') {
        event.preventDefault();
        console.log('⌨️ 快捷键触发: Ctrl+Enter');
        if (!config.isGenerating && config.onGenerate) {
          console.log('✅ 执行生成/编辑操作');
          config.onGenerate();
        } else {
          console.log('⚠️ 正在生成中或无回调函数');
        }
        return;
      }

      // 如果在输入框中，只处理上面的 Cmd+Enter，其他按键忽略
      if (isInputElement) {
        return;
      }

      // 导航快捷键
      switch (event.key.toLowerCase()) {
        case 'g':
          event.preventDefault();
          console.log('⌨️ 快捷键触发: G - 跳转到AI创作');
          router.push('/create');
          break;

        case 'e':
          event.preventDefault();
          console.log('⌨️ 快捷键触发: E - 跳转到AI编辑');
          router.push('/edit');
          break;

        case 't':
          event.preventDefault();
          console.log('⌨️ 快捷键触发: T - 打开创意工坊');
          router.push('/tools');
          break;

        case 'c':
          event.preventDefault();
          console.log('⌨️ 快捷键触发: C - 打开AI伙伴');
          router.push('/chat');
          break;

        case 'l':
          event.preventDefault();
          console.log('⌨️ 快捷键触发: L - 查看创意画廊');
          router.push('/gallery');
          break;

        case 'h':
          event.preventDefault();
          console.log('⌨️ 快捷键触发: H - 切换历史');
          if (config.onToggleHistory) {
            config.onToggleHistory();
          }
          break;

        case 'p':
          event.preventDefault();
          console.log('⌨️ 快捷键触发: P - 打开提示词画廊');
          if (config.onTogglePromptGallery) {
            config.onTogglePromptGallery();
          }
          break;

        case '?':
          // 显示快捷键帮助
          event.preventDefault();
          console.log('⌨️ 快捷键触发: ? - 显示帮助');
          showKeyboardHelp();
          break;
      }
    };

    console.log('🎯 快捷键系统已初始化');
    window.addEventListener('keydown', handleKeyDown);
    
    return () => {
      console.log('🎯 快捷键系统已卸载');
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [router, pathname, config.onGenerate, config.onToggleHistory, config.onTogglePromptGallery, config.isGenerating]);
}

// 显示快捷键帮助弹窗
function showKeyboardHelp() {
  const helpText = `
⌨️ 键盘快捷键

导航:
  G - AI创作
  E - AI编辑
  T - 创意工坊
  C - AI伙伴
  L - 创意画廊

操作:
  Cmd/Ctrl + Enter - 生成/编辑
  H - 显示/隐藏历史
  P - 显示/隐藏提示词画廊
  ? - 显示此帮助

提示: 在输入框外按这些键可以快速导航！
  `;
  alert(helpText);
}

export const KEYBOARD_SHORTCUTS = {
  GENERATE: { key: 'G', description: '切换到AI创作' },
  EDIT: { key: 'E', description: '切换到AI编辑' },
  TOOLS: { key: 'T', description: '打开创意工坊' },
  CHAT: { key: 'C', description: '打开AI伙伴' },
  GALLERY: { key: 'L', description: '查看创意画廊' },
  EXECUTE: { key: 'Cmd/Ctrl + Enter', description: '执行生成/编辑' },
  HISTORY: { key: 'H', description: '切换历史面板' },
  PROMPT_GALLERY: { key: 'P', description: '切换提示词画廊' },
  HELP: { key: '?', description: '显示快捷键帮助' },
};
