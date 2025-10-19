'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useTheme } from '@/contexts/ThemeContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/hooks/useAuth';
import QuotaIndicator from './QuotaIndicator';
import AuthModal from './AuthModal';
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
  Languages
} from 'lucide-react';

export default function TopNav() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const pathname = usePathname();
  const { theme, toggleTheme } = useTheme();
  const { language, setLanguage, t } = useLanguage();
  const { user, isLoggedIn, signOut } = useAuth();

  const navItems = [
    { icon: Sparkles, label: 'AI Studio', labelKey: 'nav.studio', path: '/create', descriptionZh: '图片创作', descriptionEn: 'Image Creation' },
    { icon: Wand2, label: 'Editor', labelKey: 'nav.editor', path: '/edit', descriptionZh: '图片编辑', descriptionEn: 'Image Editing' },
    { icon: Sparkles, label: 'Showcase', labelKey: 'nav.showcase', path: '/showcase', descriptionZh: '案例展示', descriptionEn: 'Case Studies' },
    { icon: Boxes, label: 'Playground', labelKey: 'nav.playground', path: '/playground', descriptionZh: 'AI 实验室', descriptionEn: 'AI Lab' },
    { icon: FileText, label: 'Templates', labelKey: 'nav.templates', path: '/templates', descriptionZh: '模板库', descriptionEn: 'Template Library' },
    { icon: LayoutGrid, label: 'Gallery', labelKey: 'nav.gallery', path: '/gallery', descriptionZh: '作品画廊', descriptionEn: 'Artwork Gallery' },
    { icon: BookOpen, label: 'Docs', labelKey: 'nav.docs', path: '/docs', descriptionZh: '文档中心', descriptionEn: 'Documentation' },
  ];

  const isActive = (path: string) => pathname === path;

  return (
    <>
      {/* 顶部导航栏 */}
      <header className="sticky top-0 z-50 w-full border-b border-dark-200 dark:border-dark-800 bg-white/80 dark:bg-dark-950/80 backdrop-blur-xl">
        <div className="content-wrapper py-3">
          <div className="flex items-center justify-between">
            {/* Logo - 修复变形问题 */}
            <Link href="/" className="flex items-center gap-4 group flex-shrink-0">
              <div className="w-11 h-11 min-w-[2.75rem] min-h-[2.75rem] bg-primary-500 rounded-xl flex items-center justify-center transition-all group-hover:scale-105 group-hover:shadow-md shadow-sm">
                <Sparkles className="w-6 h-6 text-white flex-shrink-0" />
              </div>
              <div className="hidden md:block flex-shrink-0">
                <h1 className="text-base font-bold text-dark-900 dark:text-dark-50 whitespace-nowrap">
                  {language === 'zh' ? '创想引擎' : 'Imagine Engine'}
                </h1>
              </div>
            </Link>

            {/* 桌面端导航 */}
            <nav className="hidden lg:flex items-center gap-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                const active = isActive(item.path);
                return (
                  <Link
                    key={item.path}
                    href={item.path}
                    className={active ? 'nav-link-active' : 'nav-link'}
                  >
                    <Icon className="w-4 h-4 flex-shrink-0" />
                    <span className="text-sm font-medium whitespace-nowrap">{item.label}</span>
                  </Link>
                );
              })}
            </nav>

            {/* 右侧操作区 */}
            <div className="flex items-center gap-4">
              {/* 语言切换 - 美化版 */}
              <button
                onClick={() => setLanguage(language === 'zh' ? 'en' : 'zh')}
                className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-dark-200 dark:border-dark-800 hover:border-primary-400 dark:hover:border-primary-600 hover:bg-dark-50 dark:hover:bg-dark-900 transition-all text-sm font-medium text-dark-700 dark:text-dark-300 whitespace-nowrap flex-shrink-0"
                title={language === 'zh' ? 'Switch to English' : '切换到中文'}
              >
                <Languages className="w-4 h-4 flex-shrink-0" />
                {language === 'zh' ? '中文' : 'EN'}
              </button>

              {/* 主题切换 - 美化版 */}
              <button
                onClick={() => {
                  try {
                    if (toggleTheme) toggleTheme();
                  } catch (e) {
                    console.error('主题切换失败:', e);
                  }
                }}
                className="w-9 h-9 flex items-center justify-center rounded-lg border border-dark-200 dark:border-dark-800 hover:border-primary-400 dark:hover:border-primary-600 hover:bg-dark-50 dark:hover:bg-dark-900 transition-all"
                title={language === 'zh' ? '切换主题' : 'Toggle Theme'}
              >
                {theme === 'light' ? (
                  <Moon className="w-4.5 h-4.5 text-dark-600 dark:text-dark-400" />
                ) : (
                  <Sun className="w-4.5 h-4.5 text-dark-600 dark:text-dark-400" />
                )}
              </button>

              {/* 用户区域 */}
              {isLoggedIn ? (
                <>
                  {/* 配额显示 */}
                  <QuotaIndicator />
                  
                  {/* 用户菜单 */}
                  <div className="relative">
                    <button
                      onClick={() => setShowUserMenu(!showUserMenu)}
                      className="toolbar-btn flex items-center gap-2"
                    >
                      <User className="w-5 h-5" />
                      <span className="text-sm hidden md:inline max-w-[100px] truncate">
                        {user?.email?.split('@')[0]}
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
              const active = isActive(item.path);
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

