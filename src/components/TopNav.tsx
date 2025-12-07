'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useTheme } from '@/contexts/ThemeContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/hooks/useAuth';
import QuotaIndicator from './QuotaIndicator';
import AuthModal from './AuthModal';
import Tooltip from './Tooltip';
import { 
  Sparkles, 
  Wand2, 
  Boxes, 
  FileText,
  LayoutGrid,
  BookOpen,
  Settings,
  Menu,
  User,
  LogOut,
  X,
  Sun,
  Moon,
  Languages,
  Wrench,
  Camera,
  Scissors,
  Maximize2,
  Palette,
  Image as ImageIcon,
  Microscope,
  GitBranch,
  FileImage,
  ChevronDown,
  ArrowUpRight,
  Shapes
} from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { getRecentTools, recordToolUsage } from '@/lib/recentTools';
import { Clock } from 'lucide-react';

export default function TopNav() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showToolsMenu, setShowToolsMenu] = useState(false);
  const [userProfile, setUserProfile] = useState<any>(null);
  const [recentTools, setRecentTools] = useState<any[]>([]);
  const pathname = usePathname();
  const { theme, toggleTheme } = useTheme();
  const { language, setLanguage, t } = useLanguage();
  const { user, isLoggedIn, signOut } = useAuth();

  // 获取用户资料
  const fetchUserProfile = async () => {
    if (!user?.id) return;
    try {
      const { data } = await supabase
        .from('profiles')
        .select('display_name, username, avatar_url')
        .eq('id', user.id)
        .single();
      
      if (data) {
        // 确保有名字显示（优先级：display_name > username > 邮箱前缀）
        const displayName = data.display_name 
          || data.username 
          || user?.email?.split('@')[0] 
          || '用户';
        
        setUserProfile({
          ...data,
          display_name: displayName
        });
      }
    } catch (error) {
      console.error('获取用户资料失败:', error);
    }
  };

  useEffect(() => {
    if (isLoggedIn && user?.id) {
      fetchUserProfile();
    }
  }, [isLoggedIn, user?.id]);

  // 加载最近使用的工具
  useEffect(() => {
    const recent = getRecentTools();
    setRecentTools(recent);
  }, [pathname]); // 当路径变化时更新

  // AI工具列表
  const aiTools = [
    {
      id: 'id-photo',
      name: { zh: '证件照生成', en: 'ID Photo Generator' },
      description: { zh: '5秒生成标准证件照，无需摄影棚', en: 'Generate ID photos in 5 seconds' },
      icon: Camera,
      path: '/tools/id-photo',
      quota: 1
    },
    {
      id: 'remove-bg',
      name: { zh: '智能去背景', en: 'Remove Background' },
      description: { zh: '1秒抠图，发丝级细节', en: '1-second cutout, hair-level details' },
      icon: Scissors,
      path: '/tools/remove-bg',
      quota: 1
    },
    {
      id: 'upscale',
      name: { zh: '图片放大', en: 'Image Upscaler' },
      description: { zh: '无损放大4倍，保持清晰', en: 'Upscale 4x without quality loss' },
      icon: Maximize2,
      path: '/tools/upscale',
      quota: 2
    },
    {
      id: 'style-transfer',
      name: { zh: '风格转换', en: 'Style Transfer' },
      description: { zh: '艺术风格一键转换', en: 'One-click artistic style conversion' },
      icon: Palette,
      path: '/tools/style-transfer',
      quota: 2
    },
    {
      id: 'enhance',
      name: { zh: '画质增强', en: 'Quality Enhancement' },
      description: { zh: '智能优化画质和色彩', en: 'Smart quality & color optimization' },
      icon: Sparkles,
      path: '/tools/enhance',
      quota: 2
    },
    {
      id: 'colorize',
      name: { zh: '黑白上色', en: 'Colorization' },
      description: { zh: '黑白照片AI上色', en: 'AI colorization for B&W photos' },
      icon: ImageIcon,
      path: '/tools/colorize',
      quota: 2
    },
    {
      id: 'scientific-drawing',
      name: { zh: '科研绘图', en: 'Scientific Drawing' },
      description: { zh: '5分钟生成专业学术配图', en: 'Generate publication-ready scientific illustrations' },
      icon: Microscope,
      path: '/tools/scientific-drawing',
      quota: 3
    },
    {
      id: 'svg-editor',
      name: { zh: 'SVG流程图编辑器', en: 'SVG Flowchart Editor' },
      description: { zh: '可视化创建流程图、架构图、思维导图', en: 'Create flowcharts, diagrams, and mind maps visually' },
      icon: GitBranch,
      path: '/tools/svg-editor',
      quota: 0
    },
    {
      id: 'ai-icon-generator',
      name: { zh: 'AI图标生成器', en: 'AI Icon Generator' },
      description: { zh: 'AI生成各种风格图标，扁平、渐变、3D等', en: 'Generate icons in various styles: flat, gradient, 3D' },
      icon: Shapes,
      path: '/tools/ai-icon-generator',
      quota: 2
    },
    {
      id: 'xiaohongshu-generator',
      name: { zh: '小红书图文生成器', en: 'Xiaohongshu Content Generator' },
      description: { zh: '一句话生成完整小红书图文，包含大纲和配图', en: 'Generate complete Xiaohongshu content with outline and images' },
      icon: FileText,
      path: '/tools/xiaohongshu-generator',
      quota: -1 // -1 表示按需消耗（大纲1张+图片按模型1-4张/张）
    }
  ];

  // 导航项顺序（按用户使用频率和逻辑流程优化）
  // 1. 核心创作功能 → 2. 工具集 → 3. 编辑功能 → 4. 个人作品 → 5. 探索功能 → 6. 参考学习 → 7. 帮助文档
  const navItems = [
    { icon: Sparkles, label: 'AI Studio', labelKey: 'nav.studio', path: '/create', descriptionZh: '图片创作', descriptionEn: 'Image Creation' },
    { icon: Wrench, label: 'Tools', labelKey: 'nav.tools', path: '/tools', descriptionZh: 'AI工具箱', descriptionEn: 'AI Tools', isDropdown: true },
    { icon: Wand2, label: 'Editor', labelKey: 'nav.editor', path: '/edit', descriptionZh: '图片编辑', descriptionEn: 'Image Editing' },
    { icon: LayoutGrid, label: 'Gallery', labelKey: 'nav.gallery', path: '/gallery', descriptionZh: '作品画廊', descriptionEn: 'Artwork Gallery' },
    { icon: Boxes, label: 'Playground', labelKey: 'nav.playground', path: '/playground', descriptionZh: 'AI 实验室', descriptionEn: 'AI Lab' },
    { icon: Sparkles, label: 'Showcase', labelKey: 'nav.showcase', path: '/showcase', descriptionZh: '案例展示', descriptionEn: 'Case Studies' },
    { icon: BookOpen, label: 'Docs', labelKey: 'nav.docs', path: '/docs', descriptionZh: '文档中心', descriptionEn: 'Documentation' },
  ];

  const isActive = (path: string) => pathname === path;

  // 点击外部关闭下拉菜单
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (showToolsMenu && !target.closest('.tools-menu-container')) {
        setShowToolsMenu(false);
      }
      if (showUserMenu && !target.closest('.user-menu-container')) {
        setShowUserMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showToolsMenu, showUserMenu]);

  return (
    <>
      {/* 顶部导航栏 */}
      <header className="sticky top-0 z-50 w-full border-b border-dark-200 dark:border-dark-800 bg-white/80 dark:bg-dark-950/80 backdrop-blur-xl">
        <div className="content-wrapper py-3">
          <div className="flex items-center justify-between">
            {/* Logo - 修复变形问题 + 光晕效果 */}
            <Link href="/" className="flex items-center gap-4 group flex-shrink-0 relative">
              <div className="relative">
                {/* 光晕背景 */}
                <div className="absolute inset-0 bg-primary-500/20 rounded-xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10" />
                {/* Logo 容器 */}
                <div className="w-11 h-11 min-w-[2.75rem] min-h-[2.75rem] bg-primary-500 rounded-xl flex items-center justify-center transition-all group-hover:scale-110 group-hover:shadow-lg group-hover:shadow-primary-500/30 shadow-sm duration-300">
                  <Sparkles className="w-6 h-6 text-white flex-shrink-0 transition-transform group-hover:rotate-12 duration-300" />
                </div>
              </div>
              <div className="hidden md:block flex-shrink-0">
                <h1 className="text-base font-bold text-dark-900 dark:text-dark-50 whitespace-nowrap tracking-tight transition-colors group-hover:text-primary-600 dark:group-hover:text-primary-400 duration-300">
                  {language === 'zh' ? '创想引擎' : 'Imagine Engine'}
                </h1>
              </div>
            </Link>

            {/* 桌面端导航 */}
            <nav className="hidden lg:flex items-center gap-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                const active = isActive(item.path) || (item.isDropdown && pathname.startsWith('/tools'));
                
                // 如果是Tools下拉菜单
                if (item.isDropdown) {
                  return (
                    <div key={item.path} className="relative tools-menu-container">
                      <Tooltip 
                        content={language === 'zh' ? item.descriptionZh : item.descriptionEn}
                        position="bottom"
                      >
                        <button
                          onClick={() => setShowToolsMenu(!showToolsMenu)}
                          className={`nav-link ${active ? 'nav-link-active' : ''} group relative`}
                        >
                          <Icon className="w-4 h-4 flex-shrink-0 transition-transform group-hover:scale-110 duration-200" />
                          <span className="text-sm font-medium whitespace-nowrap tracking-tight">{item.label}</span>
                          <ChevronDown className={`w-3 h-3 flex-shrink-0 transition-transform duration-300 ${showToolsMenu ? 'rotate-180' : ''}`} />
                        </button>
                      </Tooltip>
                      
                      {/* 工具下拉菜单 */}
                      {showToolsMenu && (
                        <div className="absolute top-full left-0 mt-2 w-80 card p-2 shadow-2xl border border-dark-200 dark:border-dark-800 bg-white dark:bg-dark-900 z-50 animate-fade-in">
                          <div className="max-h-[600px] overflow-y-auto">
                            {/* 最近使用的工具 */}
                            {recentTools.length > 0 && (
                              <div className="mb-2">
                                <div className="px-3 py-2 text-xs font-semibold text-dark-500 dark:text-dark-400 uppercase tracking-wider flex items-center gap-2">
                                  <Clock className="w-3 h-3" />
                                  {language === 'zh' ? '最近使用' : 'Recent'}
                                </div>
                                {recentTools.map((recentTool) => {
                                  const tool = aiTools.find(t => t.id === recentTool.id);
                                  if (!tool) return null;
                                  const ToolIcon = tool.icon;
                                  return (
                                    <Link
                                      key={recentTool.id}
                                      href={recentTool.path}
                                      onClick={() => {
                                        setShowToolsMenu(false);
                                        recordToolUsage(recentTool.id, recentTool.name, recentTool.path);
                                      }}
                                      className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-dark-50 dark:hover:bg-dark-800 transition-all group text-sm"
                                    >
                                      <ToolIcon className="w-4 h-4 text-primary-500" />
                                      <span className="text-dark-700 dark:text-dark-300 flex-1 truncate">
                                        {recentTool.name}
                                      </span>
                                      <span className="text-xs text-dark-400 dark:text-dark-500">
                                        {recentTool.usageCount}x
                                      </span>
                                    </Link>
                                  );
                                })}
                                <div className="my-2 border-t border-dark-200 dark:border-dark-800" />
                              </div>
                            )}
                            
                            {/* 所有工具 */}
                            {aiTools.map((tool) => {
                              const ToolIcon = tool.icon;
                              const toolActive = pathname === tool.path;
                              return (
                                <Link
                                  key={tool.id}
                                  href={tool.path}
                                  onClick={() => setShowToolsMenu(false)}
                                  className={`flex items-start gap-3 p-3 rounded-lg transition-all group ${
                                    toolActive
                                      ? 'bg-primary-50 dark:bg-primary-900/30 border border-primary-200 dark:border-primary-800'
                                      : 'hover:bg-dark-50 dark:hover:bg-dark-800 border border-transparent'
                                  }`}
                                >
                                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 transition-colors ${
                                    toolActive
                                      ? 'bg-primary-500 text-white'
                                      : 'bg-primary-500/20 text-primary-500 group-hover:bg-primary-500/30'
                                  }`}>
                                    <ToolIcon className="w-5 h-5" />
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <div className="flex items-center justify-between gap-2 mb-1">
                                      <h4 className={`font-semibold text-sm ${
                                        toolActive
                                          ? 'text-primary-700 dark:text-primary-300'
                                          : 'text-dark-900 dark:text-dark-50'
                                      }`}>
                                        {language === 'zh' ? tool.name.zh : tool.name.en}
                                      </h4>
                                      <ArrowUpRight className={`w-4 h-4 flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity ${
                                        toolActive ? 'text-primary-500' : 'text-dark-400'
                                      }`} />
                                    </div>
                                    <p className={`text-xs leading-relaxed ${
                                      toolActive
                                        ? 'text-primary-600 dark:text-primary-400'
                                        : 'text-dark-600 dark:text-dark-400'
                                    }`}>
                                      {language === 'zh' ? tool.description.zh : tool.description.en}
                                    </p>
                                    <div className="mt-2 flex items-center gap-2">
                                      <span className={`text-xs px-2 py-0.5 rounded-full ${
                                        toolActive
                                          ? 'bg-primary-100 dark:bg-primary-900/50 text-primary-700 dark:text-primary-300'
                                          : 'bg-dark-100 dark:bg-dark-800 text-dark-600 dark:text-dark-400'
                                      }`}>
                                        {tool.quota === 0 
                                          ? (language === 'zh' ? '免费' : 'Free')
                                          : tool.quota === -1
                                          ? (language === 'zh' ? '按需消耗' : 'As needed')
                                          : (language === 'zh' ? `${tool.quota}张配额` : `${tool.quota} quota`)
                                        }
                                      </span>
                                    </div>
                                  </div>
                                </Link>
                              );
                            })}
                            
                            {/* 查看全部工具链接 */}
                            <div className="mt-2 pt-2 border-t border-dark-200 dark:border-dark-800">
                              <Link
                                href="/tools"
                                onClick={() => setShowToolsMenu(false)}
                                className="flex items-center justify-between p-3 rounded-lg hover:bg-dark-50 dark:hover:bg-dark-800 transition-all group"
                              >
                                <div className="flex items-center gap-3">
                                  <div className="w-10 h-10 rounded-lg bg-primary-500/20 text-primary-500 flex items-center justify-center">
                                    <Wrench className="w-5 h-5" />
                                  </div>
                                  <div>
                                    <h4 className="font-semibold text-sm text-dark-900 dark:text-dark-50">
                                      {language === 'zh' ? '查看全部工具' : 'View All Tools'}
                                    </h4>
                                    <p className="text-xs text-dark-600 dark:text-dark-400">
                                      {language === 'zh' ? '浏览所有可用工具' : 'Browse all available tools'}
                                    </p>
                                  </div>
                                </div>
                                <ArrowUpRight className="w-4 h-4 text-dark-400 group-hover:text-primary-500 transition-colors" />
                              </Link>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                }
                
                // 普通导航项
                return (
                  <Tooltip
                    key={item.path}
                    content={language === 'zh' ? item.descriptionZh : item.descriptionEn}
                    position="bottom"
                  >
                    <Link
                      href={item.path}
                      className={`${active ? 'nav-link-active' : 'nav-link'} group relative`}
                    >
                      <Icon className="w-4 h-4 flex-shrink-0 transition-transform group-hover:scale-110 duration-200" />
                      <span className="text-sm font-medium whitespace-nowrap tracking-tight">{item.label}</span>
                  </Link>
                  </Tooltip>
                );
              })}
            </nav>

            {/* 右侧操作区 */}
            <div className="flex items-center gap-4">
              {/* 语言切换 - 美化版 */}
              <Tooltip 
                content={language === 'zh' ? 'Switch to English' : '切换到中文'}
                position="bottom"
              >
              <button
                onClick={() => setLanguage(language === 'zh' ? 'en' : 'zh')}
                className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-dark-200 dark:border-dark-800 hover:border-primary-400 dark:hover:border-primary-600 hover:bg-dark-50 dark:hover:bg-dark-900 transition-all text-sm font-medium text-dark-700 dark:text-dark-300 whitespace-nowrap flex-shrink-0"
              >
                <Languages className="w-4 h-4 flex-shrink-0" />
                {language === 'zh' ? '中文' : 'EN'}
              </button>
              </Tooltip>

              {/* 主题切换 - 美化版 */}
              <Tooltip 
                content={language === 'zh' ? '切换主题' : 'Toggle Theme'}
                position="bottom"
              >
              <button
                onClick={() => {
                  try {
                    if (toggleTheme) toggleTheme();
                  } catch (e) {
                    console.error('主题切换失败:', e);
                  }
                }}
                className="w-9 h-9 flex items-center justify-center rounded-lg border border-dark-200 dark:border-dark-800 hover:border-primary-400 dark:hover:border-primary-600 hover:bg-dark-50 dark:hover:bg-dark-900 transition-all"
              >
                {theme === 'light' ? (
                  <Moon className="w-4.5 h-4.5 text-dark-600 dark:text-dark-400" />
                ) : (
                  <Sun className="w-4.5 h-4.5 text-dark-600 dark:text-dark-400" />
                )}
              </button>
              </Tooltip>

              {/* 用户区域 */}
              {isLoggedIn ? (
                <>
                  {/* 配额显示 */}
                  <QuotaIndicator />
                  
                  {/* 用户菜单 */}
                  <div className="relative user-menu-container">
                    <button
                      onClick={() => setShowUserMenu(!showUserMenu)}
                      className="toolbar-btn flex items-center gap-2 hover:bg-primary-50 dark:hover:bg-primary-900/20 transition-colors"
                    >
                      {userProfile?.avatar_url ? (
                        <img
                          src={userProfile.avatar_url}
                          alt="Avatar"
                          className="w-6 h-6 rounded-full object-cover"
                        />
                      ) : (
                        <div className="w-6 h-6 rounded-full bg-primary-500/30 flex items-center justify-center">
                          <User className="w-4 h-4 text-primary-500" />
                        </div>
                      )}
                      <span className="text-sm hidden md:inline max-w-[100px] truncate font-medium">
                        {userProfile?.display_name || user?.email?.split('@')[0] || 'User'}
                      </span>
                    </button>
                    
                    {showUserMenu && (
                      <div className="absolute right-0 mt-2 w-44 card p-1.5 shadow-xl border border-dark-200 dark:border-dark-800 animate-fade-in">
                        <Link
                          href="/dashboard"
                          onClick={() => setShowUserMenu(false)}
                          className="block px-3 py-2 hover:bg-dark-100 dark:hover:bg-dark-800 rounded text-sm transition-colors"
                        >
                          {language === 'zh' ? '仪表板' : 'Dashboard'}
                        </Link>
                        <Link
                          href="/profile"
                          onClick={() => setShowUserMenu(false)}
                          className="block px-3 py-2 hover:bg-dark-100 dark:hover:bg-dark-800 rounded text-sm transition-colors"
                        >
                          {language === 'zh' ? '个人资料' : 'Profile'}
                        </Link>
                        <div className="my-1 border-t border-dark-200 dark:border-dark-800" />
                        <button
                          onClick={() => {
                            signOut();
                            setShowUserMenu(false);
                          }}
                          className="w-full text-left px-3 py-2 hover:bg-dark-100 dark:hover:bg-dark-800 rounded text-sm transition-colors text-red-600 dark:text-red-400 flex items-center gap-2"
                        >
                          <LogOut className="w-4 h-4" />
                          {language === 'zh' ? '登出' : 'Logout'}
                        </button>
                      </div>
                    )}
                  </div>
                </>
              ) : (
                <button 
                  onClick={() => setShowAuthModal(true)}
                  className="btn-primary text-sm px-4 py-2"
                >
                  {language === 'zh' ? '登录/注册' : 'Sign In'}
                </button>
              )}

              {/* 设置 */}
              <Link href="/settings" className="toolbar-btn">
                <Settings className="w-5 h-5" />
              </Link>

              {/* 移动端菜单按钮 */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="toolbar-btn lg:hidden"
              >
                {mobileMenuOpen ? (
                  <X className="w-5 h-5" />
                ) : (
                  <Menu className="w-5 h-5" />
                )}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* 移动端菜单 */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 top-[73px] z-40 bg-white dark:bg-dark-950 border-b border-dark-200 dark:border-dark-800">
          <nav className="content-wrapper py-4 space-y-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.path) || (item.isDropdown && pathname.startsWith('/tools'));
              
              // 如果是Tools下拉菜单
              if (item.isDropdown) {
                return (
                  <div key={item.path} className="space-y-2">
                    <button
                      onClick={() => setShowToolsMenu(!showToolsMenu)}
                      className={`w-full flex items-center justify-between p-3 rounded-lg ${
                        active
                          ? 'bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400'
                          : 'text-dark-600 dark:text-dark-400 hover:bg-dark-100 dark:hover:bg-dark-900'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <Icon className="w-5 h-5" />
                        <div>
                          <div className="font-medium">{item.label}</div>
                          <div className="text-xs text-dark-500">
                            {language === 'zh' ? item.descriptionZh : item.descriptionEn}
                          </div>
                        </div>
                      </div>
                      <ChevronDown className={`w-4 h-4 transition-transform ${showToolsMenu ? 'rotate-180' : ''}`} />
                    </button>
                    
                    {/* 移动端工具子菜单 */}
                    {showToolsMenu && (
                      <div className="pl-4 space-y-1">
                        {aiTools.map((tool) => {
                          const ToolIcon = tool.icon;
                          const toolActive = pathname === tool.path;
                          return (
                            <Link
                              key={tool.id}
                              href={tool.path}
                              onClick={() => {
                                setMobileMenuOpen(false);
                                setShowToolsMenu(false);
                              }}
                              className={`flex items-center gap-3 p-3 rounded-lg ${
                                toolActive
                                  ? 'bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400'
                                  : 'text-dark-600 dark:text-dark-400 hover:bg-dark-100 dark:hover:bg-dark-900'
                              }`}
                            >
                              <ToolIcon className="w-4 h-4" />
                              <div className="flex-1">
                                <div className="font-medium text-sm">
                                  {language === 'zh' ? tool.name.zh : tool.name.en}
                                </div>
                                <div className="text-xs text-dark-500">
                                  {language === 'zh' ? tool.description.zh : tool.description.en}
                                </div>
                              </div>
                              {toolActive && (
                                <div className="w-2 h-2 bg-primary-400 rounded-full" />
                              )}
                            </Link>
                          );
                        })}
                        <Link
                          href="/tools"
                          onClick={() => {
                            setMobileMenuOpen(false);
                            setShowToolsMenu(false);
                          }}
                          className="flex items-center gap-3 p-3 rounded-lg text-dark-600 dark:text-dark-400 hover:bg-dark-100 dark:hover:bg-dark-900"
                        >
                          <Wrench className="w-4 h-4" />
                          <div className="font-medium text-sm">
                            {language === 'zh' ? '查看全部工具' : 'View All Tools'}
                          </div>
                        </Link>
                      </div>
                    )}
                  </div>
                );
              }
              
              // 普通导航项
              return (
                <Link
                  key={item.path}
                  href={item.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center justify-between p-3 rounded-lg ${
                    active
                      ? 'bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400'
                      : 'text-dark-600 dark:text-dark-400 hover:bg-dark-100 dark:hover:bg-dark-900'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className="w-5 h-5" />
                    <div>
                      <div className="font-medium">{item.label}</div>
                      <div className="text-xs text-dark-500">
                        {language === 'zh' ? item.descriptionZh : item.descriptionEn}
                      </div>
                    </div>
                  </div>
                  {active && (
                    <div className="w-2 h-2 bg-primary-400 rounded-full" />
                  )}
                </Link>
              );
            })}
          </nav>
        </div>
      )}

      {/* 认证模态框 */}
      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        onSuccess={() => setShowAuthModal(false)}
        initialMode="signup"
      />
    </>
  );
}

