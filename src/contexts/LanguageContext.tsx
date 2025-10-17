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
    'app.title': 'Imagine Engine',
    'app.subtitle': '专业 AI 图像创作工作台',
    'app.description': '面向开发者和技术创新者的专业级 AI 创作平台',
    'app.back': '返回',
    'app.loading': '加载中...',
    'app.error': '出错了',
    'app.success': '成功',
    
    // 导航
    'nav.studio': 'AI Studio',
    'nav.editor': 'Editor',
    'nav.showcase': 'Showcase',
    'nav.playground': 'Playground',
    'nav.templates': 'Templates',
    'nav.gallery': 'Gallery',
    'nav.docs': 'Docs',
    'nav.settings': '设置',
    
    // 创作页面（完整）
    'create.title': 'AI Studio',
    'create.subtitle': '专业图片生成工具',
    'create.prompt.label': '提示词',
    'create.prompt.placeholder': '描述你想创作的画面...',
    'create.prompt.hint': '按 Ctrl+Enter 快速生成',
    'create.generate': '生成图片',
    'create.generating': '生成中...',
    'create.batchCount': '批量生成',
    'create.batchHint': '同时生成多张变体',
    'create.aspectRatio': '图片比例',
    'create.style.label': '风格',
    'create.style.realistic': '写实',
    'create.style.anime': '动漫',
    'create.style.oil': '油画',
    'create.style.watercolor': '水彩',
    'create.style.cyberpunk': '赛博朋克',
    'create.style.minimal': '极简',
    'create.style.original': '原始',
    'create.reference.label': '参考图',
    'create.reference.upload': '上传参考图',
    'create.reference.remove': '移除',
    'create.result.title': '生成结果',
    'create.result.empty': '生成的图片将显示在这里',
    'create.result.count': '张作品',
    'create.result.download': '下载',
    'create.result.edit': '编辑',
    'create.result.delete': '删除',
    'create.result.clear': '清空所有',
    'create.error.noPrompt': '请输入提示词',
    'create.error.noApiKey': '请先配置 API 密钥',
    
    // 编辑页面（完整）
    'edit.title': 'Editor',
    'edit.subtitle': '专业图片编辑工具',
    'edit.upload': '上传图片',
    'edit.uploadHint': '支持 JPG、PNG、WEBP 格式',
    'edit.selectTool': '选择工具',
    'edit.tool.inpaint': '智能修复',
    'edit.tool.inpaintDesc': '涂抹区域并描述修改',
    'edit.tool.removeBg': '移除背景',
    'edit.tool.removeBgDesc': '一键生成透明背景',
    'edit.tool.idPhoto': '证件照',
    'edit.tool.idPhotoDesc': '更换背景颜色',
    'edit.instruction': '编辑描述',
    'edit.instructionPlaceholder': '描述你想要的修改效果...',
    'edit.brushSize': '画笔大小',
    'edit.backgroundColor': '背景颜色',
    'edit.clearMask': '清除遮罩',
    'edit.startEdit': '开始编辑',
    'edit.editing': '处理中...',
    'edit.originalImage': '原图',
    'edit.editedImage': '编辑结果',
    'edit.originalSize': '原始尺寸',
    'edit.download': '下载',
    'edit.error.noImage': '请先上传图片',
    'edit.error.noTool': '请选择编辑工具',
    'edit.error.noInstruction': '请输入编辑描述',
    
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
    
    // 设置页面（完整）
    'settings.title': '设置',
    'settings.subtitle': '配置和管理',
    'settings.model': '模型配置',
    'settings.account': '账户管理',
    'settings.preferences': '偏好设置',
    'settings.provider': 'API 提供商',
    'settings.selectProvider': '选择提供商',
    'settings.selectModel': '选择模型',
    'settings.apiKey': 'API 密钥',
    'settings.apiKeyPlaceholder': '输入你的 API 密钥...',
    'settings.apiKeyHint': '密钥仅保存在浏览器本地',
    'settings.baseUrl': 'API 地址',
    'settings.save': '保存设置',
    'settings.clear': '清除设置',
    'settings.saved': '设置已保存',
    'settings.theme': '主题',
    'settings.language': '语言',
    'settings.shortcuts': '快捷键',
    
    // 工具页面
    'tools.title': '创意工坊',
    'tools.subtitle': '多图融合和创意合成',
    'tools.fusion': '图像融合',
    'tools.upload': '上传图片',
    'tools.uploadHint': '支持 2-6 张图片',
    
    // Showcase 案例展示
    'showcase.title': '案例展示',
    'showcase.subtitle': '精选案例 · 学习优秀提示词',
    'showcase.search': '搜索案例、提示词、作者...',
    'showcase.category': '分类',
    'showcase.difficulty': '难度',
    'showcase.all': '全部',
    'showcase.featured': '精选案例',
    'showcase.clearFilters': '清除筛选',
    'showcase.results': '个结果',
    'showcase.copyPrompt': '复制提示词',
    'showcase.useInStudio': '去 AI Studio 使用',
    
    // Templates 模板页面
    'templates.title': '提示词模板库',
    'templates.subtitle': '专业模板，开箱即用',
    'templates.search': '搜索模板...',
    'templates.newTemplate': '新建模板',
    'templates.allTemplates': '全部模板',
    'templates.myTemplates': '我的模板',
    'templates.uses': '次使用',
    'templates.useTemplate': '使用模板',
    'templates.copyPrompt': '复制提示词',
    'templates.viewDetails': '查看详情',
    'templates.favorite': '收藏',
    'templates.unfavorite': '取消收藏',
    'templates.comingSoon': '完整模板库即将推出',
    'templates.comingSoonDesc': '我们正在构建包含数百个专业模板的综合库',
    'templates.category.photography': '摄影',
    'templates.category.art': '艺术插画',
    'templates.category.design': '设计',
    'templates.category.portrait': '人像',
    'templates.category.product': '产品',
    'templates.category.landscape': '风景',
    'templates.category.architecture': '建筑',
    'templates.category.food': '美食',
    'templates.difficulty.easy': '简单',
    'templates.difficulty.medium': '中等',
    'templates.difficulty.hard': '高级',
    
    // Playground 实验室
    'playground.title': 'AI 实验室',
    'playground.subtitle': '多模型对比实验',
    'playground.configuration': '配置',
    'playground.prompt': '提示词',
    'playground.promptPlaceholder': '输入提示词在多个模型间测试...',
    'playground.selectModel': '选择模型',
    'playground.model1': '模型 1',
    'playground.model2': '模型 2',
    'playground.runComparison': '运行对比',
    'playground.running': '生成中...',
    'playground.results': '对比结果',
    'playground.noResults': '还没有对比结果',
    'playground.parameters': '参数',
    'playground.temperature': '温度',
    'playground.maxTokens': '最大长度',
    'playground.topP': 'Top P',
    'playground.comingSoon': '多模型对比功能即将推出',
    'playground.comingSoonDesc': '同时测试多个模型，直观对比生成效果',
    
    // API 配置
    'api.provider': 'API 提供商',
    'api.selectProvider': '选择提供商',
    'api.customProvider': '自定义提供商',
    'api.providerName': '提供商名称',
    'api.baseUrl': 'API 地址',
    'api.apiKey': 'API 密钥',
    'api.apiKeyPlaceholder': '输入你的 API 密钥...',
    'api.apiKeyHint': '密钥仅保存在浏览器本地',
    'api.model': '模型',
    'api.selectModel': '选择模型',
    'api.customModel': '自定义模型',
    'api.modelName': '模型名称',
    'api.testConnection': '测试连接',
    'api.testing': '测试中...',
    'api.testSuccess': '连接成功',
    'api.testFailed': '连接失败',
    'api.saveConfig': '保存配置',
    'api.exportConfig': '导出配置',
    'api.importConfig': '导入配置',
    'api.addProvider': '添加提供商',
    'api.editProvider': '编辑提供商',
    'api.deleteProvider': '删除提供商',
    'api.providerList': '提供商列表',
    'api.noProviders': '还没有配置提供商',
    'api.defaultProvider': '默认',
    'api.modelType.chat': '聊天',
    'api.modelType.image': '图像',
    'api.modelType.vision': '视觉',
    
    // AI 助手
    'assistant.title': 'AI 提示词助手',
    'assistant.subtitle': '智能优化你的提示词',
    'assistant.placeholder': '描述你想要的效果，我来帮你优化提示词...',
    'assistant.send': '发送',
    'assistant.thinking': '思考中...',
    'assistant.optimize': '优化提示词',
    'assistant.generate': '生成变体',
    'assistant.explain': '解释术语',
    'assistant.clear': '清空对话',
    'assistant.minimize': '最小化',
    'assistant.close': '关闭',
    'assistant.quickActions': '快速操作',
    'assistant.examplePrompts': '示例问题',
    'assistant.example1': '如何让图片更有电影感？',
    'assistant.example2': '优化这个提示词',
    'assistant.example3': '什么是prompt engineering？',
    
    // 比例选择器
    'ratio.title': '图片尺寸',
    'ratio.popular': '热门',
    'ratio.allRatios': '全部比例',
    'ratio.square': '方形',
    'ratio.landscape': '横向',
    'ratio.portrait': '纵向',
    'ratio.widescreen': '宽屏',
    'ratio.ultrawide': '超宽',
    'ratio.standard': '标准',
    'ratio.photo': '照片',
    'ratio.poster': '海报',
    'ratio.socialMedia': '社交媒体标准',
    'ratio.video': '视频标准',
    'ratio.mobile': '手机竖屏',
    'ratio.classic': '经典比例',
    'ratio.portraitArt': '人物肖像',
    'ratio.cinema': '电影屏幕',
    'ratio.photoStandard': '摄影标准',
    'ratio.landscapePhoto': '横向摄影',
    'ratio.verticalPoster': '竖屏海报',
    'ratio.horizontalPoster': '横屏海报',
    
    // 帮助页面
    'help.title': '帮助中心',
    'help.subtitle': '使用指南和常见问题',
    'help.search': '搜索帮助...',
    
    // 按钮
    'button.confirm': '确认',
    'button.cancel': '取消',
    'button.close': '关闭',
    'button.save': '保存',
    'button.delete': '删除',
    'button.upload': '上传',
    'button.download': '下载',
    'button.edit': '编辑',
    'button.generate': '生成',
    'button.apply': '应用',
    'button.reset': '重置',
    'button.retry': '重试',
    'button.copy': '复制',
    'button.use': '使用',
    'button.test': '测试',
    'button.add': '添加',
    'button.remove': '移除',
    'button.clear': '清空',
    'button.export': '导出',
    'button.import': '导入',
    'button.send': '发送',
    'button.optimize': '优化',
  },
  en: {
    // Common
    'app.title': 'Imagine Engine',
    'app.subtitle': 'Professional AI Image Creation Workspace',
    'app.description': 'Professional AI creation platform for developers and tech innovators',
    'app.back': 'Back',
    'app.loading': 'Loading...',
    'app.error': 'Error',
    'app.success': 'Success',
    
    // Navigation
    'nav.studio': 'AI Studio',
    'nav.editor': 'Editor',
    'nav.playground': 'Playground',
    'nav.templates': 'Templates',
    'nav.gallery': 'Gallery',
    'nav.docs': 'Docs',
    'nav.settings': 'Settings',
    
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
    
    // Showcase
    'nav.showcase': 'Showcase',
    'showcase.title': 'Showcase',
    'showcase.subtitle': 'Featured Cases · Learn Great Prompts',
    'showcase.search': 'Search cases, prompts, authors...',
    'showcase.category': 'Category',
    'showcase.difficulty': 'Difficulty',
    'showcase.all': 'All',
    'showcase.featured': 'Featured Cases',
    'showcase.clearFilters': 'Clear Filters',
    'showcase.results': ' results',
    'showcase.copyPrompt': 'Copy Prompt',
    'showcase.useInStudio': 'Use in AI Studio',
    
    // Templates
    'templates.title': 'Prompt Template Library',
    'templates.subtitle': 'Professional templates, ready to use',
    'templates.search': 'Search templates...',
    'templates.newTemplate': 'New Template',
    'templates.allTemplates': 'All Templates',
    'templates.myTemplates': 'My Templates',
    'templates.uses': ' uses',
    'templates.useTemplate': 'Use Template',
    'templates.copyPrompt': 'Copy Prompt',
    'templates.viewDetails': 'View Details',
    'templates.favorite': 'Favorite',
    'templates.unfavorite': 'Unfavorite',
    'templates.comingSoon': 'Full Template Library Coming Soon',
    'templates.comingSoonDesc': 'We\'re building a comprehensive library with hundreds of professional templates',
    'templates.category.photography': 'Photography',
    'templates.category.art': 'Art & Illustration',
    'templates.category.design': 'Design',
    'templates.category.portrait': 'Portrait',
    'templates.category.product': 'Product',
    'templates.category.landscape': 'Landscape',
    'templates.category.architecture': 'Architecture',
    'templates.category.food': 'Food',
    'templates.difficulty.easy': 'Easy',
    'templates.difficulty.medium': 'Medium',
    'templates.difficulty.hard': 'Hard',
    
    // Playground
    'playground.title': 'AI Playground',
    'playground.subtitle': 'Multi-Model Comparison',
    'playground.configuration': 'Configuration',
    'playground.prompt': 'Prompt',
    'playground.promptPlaceholder': 'Enter prompt to test across models...',
    'playground.selectModel': 'Select Model',
    'playground.model1': 'Model 1',
    'playground.model2': 'Model 2',
    'playground.runComparison': 'Run Comparison',
    'playground.running': 'Generating...',
    'playground.results': 'Comparison Results',
    'playground.noResults': 'No comparison results yet',
    'playground.parameters': 'Parameters',
    'playground.temperature': 'Temperature',
    'playground.maxTokens': 'Max Tokens',
    'playground.topP': 'Top P',
    'playground.comingSoon': 'Multi-Model Comparison Coming Soon',
    'playground.comingSoonDesc': 'Test multiple models simultaneously, compare results intuitively',
    
    // API Configuration
    'api.provider': 'API Provider',
    'api.selectProvider': 'Select Provider',
    'api.customProvider': 'Custom Provider',
    'api.providerName': 'Provider Name',
    'api.baseUrl': 'API Base URL',
    'api.apiKey': 'API Key',
    'api.apiKeyPlaceholder': 'Enter your API key...',
    'api.apiKeyHint': 'Keys are stored locally in browser',
    'api.model': 'Model',
    'api.selectModel': 'Select Model',
    'api.customModel': 'Custom Model',
    'api.modelName': 'Model Name',
    'api.testConnection': 'Test Connection',
    'api.testing': 'Testing...',
    'api.testSuccess': 'Connection Successful',
    'api.testFailed': 'Connection Failed',
    'api.saveConfig': 'Save Configuration',
    'api.exportConfig': 'Export Config',
    'api.importConfig': 'Import Config',
    'api.addProvider': 'Add Provider',
    'api.editProvider': 'Edit Provider',
    'api.deleteProvider': 'Delete Provider',
    'api.providerList': 'Provider List',
    'api.noProviders': 'No providers configured yet',
    'api.defaultProvider': 'Default',
    'api.modelType.chat': 'Chat',
    'api.modelType.image': 'Image',
    'api.modelType.vision': 'Vision',
    
    // AI Assistant
    'assistant.title': 'AI Prompt Assistant',
    'assistant.subtitle': 'Optimize your prompts intelligently',
    'assistant.placeholder': 'Describe what you want, I\'ll optimize your prompt...',
    'assistant.send': 'Send',
    'assistant.thinking': 'Thinking...',
    'assistant.optimize': 'Optimize Prompt',
    'assistant.generate': 'Generate Variants',
    'assistant.explain': 'Explain Terms',
    'assistant.clear': 'Clear Chat',
    'assistant.minimize': 'Minimize',
    'assistant.close': 'Close',
    'assistant.quickActions': 'Quick Actions',
    'assistant.examplePrompts': 'Example Questions',
    'assistant.example1': 'How to make images more cinematic?',
    'assistant.example2': 'Optimize this prompt',
    'assistant.example3': 'What is prompt engineering?',
    
    // Aspect Ratios
    'ratio.title': 'Image Size',
    'ratio.popular': 'Popular',
    'ratio.allRatios': 'All Ratios',
    'ratio.square': 'Square',
    'ratio.landscape': 'Landscape',
    'ratio.portrait': 'Portrait',
    'ratio.widescreen': 'Widescreen',
    'ratio.ultrawide': 'Ultrawide',
    'ratio.standard': 'Standard',
    'ratio.photo': 'Photo',
    'ratio.poster': 'Poster',
    'ratio.socialMedia': 'Social Media Standard',
    'ratio.video': 'Video Standard',
    'ratio.mobile': 'Mobile Portrait',
    'ratio.classic': 'Classic Ratio',
    'ratio.portraitArt': 'Portrait Art',
    'ratio.cinema': 'Cinema Screen',
    'ratio.photoStandard': 'Photo Standard',
    'ratio.landscapePhoto': 'Landscape Photo',
    'ratio.verticalPoster': 'Vertical Poster',
    'ratio.horizontalPoster': 'Horizontal Poster',
    
    // Buttons
    'button.confirm': 'Confirm',
    'button.cancel': 'Cancel',
    'button.close': 'Close',
    'button.save': 'Save',
    'button.delete': 'Delete',
    'button.upload': 'Upload',
    'button.download': 'Download',
    'button.edit': 'Edit',
    'button.generate': 'Generate',
    'button.apply': 'Apply',
    'button.reset': 'Reset',
    'button.retry': 'Retry',
    'button.copy': 'Copy',
    'button.use': 'Use',
    'button.test': 'Test',
    'button.add': 'Add',
    'button.remove': 'Remove',
    'button.clear': 'Clear',
    'button.export': 'Export',
    'button.import': 'Import',
    'button.send': 'Send',
    'button.optimize': 'Optimize',
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
    const translation = translations[language] as Record<string, string>;
    return translation[key] || key;
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

