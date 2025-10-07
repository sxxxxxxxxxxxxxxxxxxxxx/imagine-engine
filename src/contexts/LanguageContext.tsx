'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

type Language = 'zh' | 'en';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const translations = {
  zh: {
    // 通用
    'app.title': '创想引擎',
    'app.subtitle': 'AI驱动的图像创作平台',
    'app.back': '返回',
    'app.loading': '加载中...',
    'app.error': '出错了',
    'app.success': '成功',
    
    // 导航
    'nav.create': 'AI创作',
    'nav.edit': 'AI编辑',
    'nav.tools': '创意工坊',
    'nav.chat': 'AI伙伴',
    'nav.gallery': '创意画廊',
    
    // 创作页面
    'create.title': 'AI 创作',
    'create.subtitle': '输入描述，让AI为你创造独特作品',
    'create.prompt.label': '创作描述',
    'create.prompt.placeholder': '描述你想要创作的画面，或点击画廊快速开始...',
    'create.generate': '开始生成',
    'create.generating': 'AI 正在创作中...',
    'create.reference.label': '参考图',
    'create.reference.upload': '上传参考图',
    'create.style.label': '艺术风格',
    'create.result.title': '创作结果',
    'create.result.empty': '还没有生成结果',
    'create.result.download': '下载',
    'create.result.edit': '编辑',
    
    // 编辑页面
    'edit.title': 'AI 编辑',
    'edit.subtitle': '智能图片编辑，保持原图分辨率',
    'edit.upload': '上传图片',
    'edit.instruction': '编辑指令',
    'edit.apply': '应用编辑',
    'edit.originalSize': '原图尺寸',
    'edit.resizing': '正在调整尺寸...',
    
    // 画廊
    'gallery.title': '创意画廊',
    'gallery.subtitle': '精选案例展示',
    'gallery.search': '搜索案例、提示词、作者...',
    'gallery.category': '分类',
    'gallery.difficulty': '难度',
    'gallery.all': '全部',
    'gallery.easy': '简单',
    'gallery.medium': '中等',
    'gallery.hard': '高级',
    'gallery.copy': '复制',
    'gallery.use': '使用',
    'gallery.viewLarge': '查看大图',
    
    // 快捷键
    'shortcuts.title': '键盘快捷键',
    'shortcuts.subtitle': '使用快捷键提升200%工作效率',
    'shortcuts.navigation': '导航',
    'shortcuts.action': '操作',
    'shortcuts.panel': '面板',
    
    // 提示词提示
    'hints.title': '提示词质量提升指南',
    'hints.subtitle': '写出高质量提示词的5个关键要素',
    'hints.subject': '主体描述',
    'hints.scene': '场景环境',
    'hints.action': '动作描述',
    'hints.style': '艺术风格',
    'hints.camera': '相机参数',
    'hints.golden': '黄金法则',
    'hints.gotit': '知道了',
    
    // 按钮
    'button.confirm': '确认',
    'button.cancel': '取消',
    'button.close': '关闭',
    'button.save': '保存',
    'button.delete': '删除',
    'button.upload': '上传',
    'button.download': '下载',
  },
  en: {
    // Common
    'app.title': 'Imagine Engine',
    'app.subtitle': 'AI-Powered Image Creation Platform',
    'app.back': 'Back',
    'app.loading': 'Loading...',
    'app.error': 'Error',
    'app.success': 'Success',
    
    // Navigation
    'nav.create': 'AI Create',
    'nav.edit': 'AI Edit',
    'nav.tools': 'Creative Studio',
    'nav.chat': 'AI Partner',
    'nav.gallery': 'Gallery',
    
    // Create Page
    'create.title': 'AI Create',
    'create.subtitle': 'Enter a description, let AI create unique works for you',
    'create.prompt.label': 'Creation Description',
    'create.prompt.placeholder': 'Describe the image you want to create, or click gallery to start...',
    'create.generate': 'Generate',
    'create.generating': 'AI is creating...',
    'create.reference.label': 'Reference Image',
    'create.reference.upload': 'Upload Reference',
    'create.style.label': 'Art Style',
    'create.result.title': 'Results',
    'create.result.empty': 'No results yet',
    'create.result.download': 'Download',
    'create.result.edit': 'Edit',
    
    // Edit Page
    'edit.title': 'AI Edit',
    'edit.subtitle': 'Smart image editing, keeps original resolution',
    'edit.upload': 'Upload Image',
    'edit.instruction': 'Edit Instruction',
    'edit.apply': 'Apply Edit',
    'edit.originalSize': 'Original Size',
    'edit.resizing': 'Resizing...',
    
    // Gallery
    'gallery.title': 'Creative Gallery',
    'gallery.subtitle': 'Featured Cases',
    'gallery.search': 'Search cases, prompts, authors...',
    'gallery.category': 'Category',
    'gallery.difficulty': 'Difficulty',
    'gallery.all': 'All',
    'gallery.easy': 'Easy',
    'gallery.medium': 'Medium',
    'gallery.hard': 'Hard',
    'gallery.copy': 'Copy',
    'gallery.use': 'Use',
    'gallery.viewLarge': 'View Large',
    
    // Shortcuts
    'shortcuts.title': 'Keyboard Shortcuts',
    'shortcuts.subtitle': 'Boost your efficiency by 200%',
    'shortcuts.navigation': 'Navigation',
    'shortcuts.action': 'Actions',
    'shortcuts.panel': 'Panels',
    
    // Hints
    'hints.title': 'Prompt Quality Guide',
    'hints.subtitle': '5 Key Elements for High-Quality Prompts',
    'hints.subject': 'Subject',
    'hints.scene': 'Scene',
    'hints.action': 'Action',
    'hints.style': 'Style',
    'hints.camera': 'Camera',
    'hints.golden': 'Golden Rule',
    'hints.gotit': 'Got it',
    
    // Buttons
    'button.confirm': 'Confirm',
    'button.cancel': 'Cancel',
    'button.close': 'Close',
    'button.save': 'Save',
    'button.delete': 'Delete',
    'button.upload': 'Upload',
    'button.download': 'Download',
  },
};

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>('zh');

  useEffect(() => {
    // 从 localStorage 读取保存的语言设置
    const savedLang = localStorage.getItem('imagine-engine-language') as Language;
    if (savedLang && (savedLang === 'zh' || savedLang === 'en')) {
      setLanguageState(savedLang);
    } else {
      // 检测浏览器语言
      const browserLang = navigator.language.toLowerCase();
      if (browserLang.startsWith('zh')) {
        setLanguageState('zh');
      } else {
        setLanguageState('en');
      }
    }
  }, []);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('imagine-engine-language', lang);
  };

  const t = (key: string): string => {
    return translations[language][key as keyof typeof translations['zh']] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}

export function LanguageSwitcher() {
  const { language, setLanguage } = useLanguage();

  return (
    <button
      onClick={() => setLanguage(language === 'zh' ? 'en' : 'zh')}
      className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-purple-500/10 transition-colors"
      title={language === 'zh' ? 'Switch to English' : '切换到中文'}
    >
      <span className="text-lg">{language === 'zh' ? '🇨🇳' : '🇬🇧'}</span>
      <span className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>
        {language === 'zh' ? '中文' : 'EN'}
      </span>
    </button>
  );
}

