'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useTheme } from '@/contexts/ThemeContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { 
  Sparkles, 
  Wand2, 
  Boxes, 
  FileText,
  LayoutGrid,
  BookOpen,
  Settings,
  Menu,
  X,
  Sun,
  Moon,
  User,
  Languages
} from 'lucide-react';

export default function TopNav() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  const { theme, toggleTheme } = useTheme();
  const { language, setLanguage, t } = useLanguage();

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
            {/* Logo */}
            <Link href="/" className="flex items-center gap-3 group">
              <div className="w-9 h-9 bg-primary-400 rounded-lg flex items-center justify-center transition-transform group-hover:scale-105">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <div className="hidden sm:block">
                <h1 className="text-lg font-bold text-dark-900 dark:text-dark-50">
                  {language === 'zh' ? '创想引擎' : 'Imagine Engine'}
                </h1>
                <p className="text-xs text-dark-500 dark:text-dark-500">
                  {language === 'zh' ? 'v3.0 技术版' : 'v3.0 Tech Edition'}
                </p>
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
                    <Icon className="w-4 h-4" />
                    <span className="text-sm font-medium">{item.label}</span>
                  </Link>
                );
              })}
            </nav>

            {/* 右侧操作区 */}
            <div className="flex items-center gap-2">
              {/* 语言切换 */}
              <button
                onClick={() => setLanguage(language === 'zh' ? 'en' : 'zh')}
                className="toolbar-btn hidden sm:flex"
                title={language === 'zh' ? 'Switch to English' : '切换到中文'}
              >
                <Languages className="w-5 h-5" />
                <span className="text-sm">{language === 'zh' ? '中文' : 'EN'}</span>
              </button>

              {/* 主题切换 */}
              <button
                onClick={toggleTheme}
                className="toolbar-btn"
                title={language === 'zh' ? '切换主题' : 'Toggle Theme'}
              >
                {theme === 'light' ? (
                  <Moon className="w-5 h-5" />
                ) : (
                  <Sun className="w-5 h-5" />
                )}
              </button>

              {/* 设置 */}
              <Link href="/settings" className="toolbar-btn">
                <Settings className="w-5 h-5" />
              </Link>

              {/* 用户（占位，待实现登录） */}
              <button className="toolbar-btn">
                <User className="w-5 h-5" />
              </button>

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
    </>
  );
}

