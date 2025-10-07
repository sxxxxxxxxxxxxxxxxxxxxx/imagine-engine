import type { Metadata } from 'next';
import './globals.css';
import { ThemeProvider } from '@/contexts/ThemeContext';
import { LanguageProvider } from '@/contexts/LanguageContext';
import ErrorBoundary from '@/components/ErrorBoundary';

export const metadata: Metadata = {
  title: '创想引擎 - 基于 Nano Banana AI 的专业图像创作平台',
  description: '采用 Google Gemini 2.5 Flash 技术的 Nano Banana AI 模型，支持批量生成、角色一致性、多图融合。提供超写实、动漫、油画等多种风格，专业级图像创作工具。',
  keywords: [
    'Nano Banana', 
    'Google Gemini 2.5', 
    'AI图像生成', 
    '批量生成',
    '角色一致性',
    '场景融合',
    '超写实',
    '动漫风格',
    '图片编辑',
    'AI创作',
    '专业摄影'
  ],
  authors: [{ name: '创想引擎团队' }],
  creator: 'Imagine Engine',
  publisher: 'Imagine Engine',
  icons: {
    icon: '/icon.png',
    apple: '/icon.png',
  },
  openGraph: {
    title: '创想引擎 - Nano Banana AI 图像创作平台',
    description: '基于 Google Gemini 2.5 的顶级 AI 图像生成技术',
    type: 'website',
    locale: 'zh_CN',
  },
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh-CN">
      <body className="antialiased">
        <ErrorBoundary>
          <ThemeProvider>
            <LanguageProvider>
              {children}
            </LanguageProvider>
          </ThemeProvider>
        </ErrorBoundary>
      </body>
    </html>
  );
}