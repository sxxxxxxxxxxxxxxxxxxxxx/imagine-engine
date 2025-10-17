import type { Metadata } from 'next';
import './globals.css';
import { ThemeProvider } from '@/contexts/ThemeContext';
import { LanguageProvider } from '@/contexts/LanguageContext';
import ErrorBoundary from '@/components/ErrorBoundary';
import TopNav from '@/components/TopNav';
import FloatingBall from '@/components/AIAssistant/FloatingBall';
import NetworkStatus from '@/components/NetworkStatus';
import InitializeConfig from '@/components/InitializeConfig';

export const metadata: Metadata = {
  title: 'Imagine Engine - Professional AI Image Creation Platform',
  description: 'Tech-focused AI image generation platform. Multi-model support, batch processing, and developer-friendly tools.',
  keywords: [
    'AI Image Generation', 
    'Batch Processing',
    'Multi-Model',
    'Developer Tools',
    'API Access',
    'Tech Platform'
  ],
  authors: [{ name: 'Imagine Engine' }],
  creator: 'Imagine Engine',
  publisher: 'Imagine Engine',
  icons: {
    icon: '/icon.png',
    apple: '/icon.png',
  },
  openGraph: {
    title: 'Imagine Engine - AI Image Creation for Tech Innovators',
    description: 'Professional AI creation workspace for developers and tech enthusiasts',
    type: 'website',
    locale: 'en_US',
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
              <InitializeConfig />
              <TopNav />
              <main>
                {children}
              </main>
              <FloatingBall />
              <NetworkStatus />
            </LanguageProvider>
          </ThemeProvider>
        </ErrorBoundary>
      </body>
    </html>
  );
}
