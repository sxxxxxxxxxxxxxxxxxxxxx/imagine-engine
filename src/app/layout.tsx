import type { Metadata } from 'next';
import './globals.css';
import { ThemeProvider } from '@/contexts/ThemeContext';
import { LanguageProvider } from '@/contexts/LanguageContext';
import ErrorBoundary from '@/components/ErrorBoundary';
import TopNav from '@/components/TopNav';
import FloatingBall from '@/components/AIAssistant/FloatingBall';
import NetworkStatus from '@/components/NetworkStatus';
import InitializeConfig from '@/components/InitializeConfig';
import ConfigAlert from '@/components/ConfigAlert';
import ToastContainer from '@/components/Toast';
import dynamic from 'next/dynamic';

// 懒加载非关键组件
const OnboardingTour = dynamic(() => import('@/components/OnboardingTour'), {
  ssr: false
});
const WelcomeModal = dynamic(() => import('@/components/WelcomeModal'), {
  ssr: false
});

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
  // icons: {
  //   icon: '/icon.png',
  //   apple: '/icon.png',
  // },
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
    <html lang="zh-CN" className="dark">
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                const theme = localStorage.getItem('theme') || 'dark';
                if (theme === 'dark') {
                  document.documentElement.classList.add('dark');
                } else {
                  document.documentElement.classList.remove('dark');
                }
              })();
            `,
          }}
        />
      </head>
      <body className="antialiased">
        <ErrorBoundary>
          <ThemeProvider>
            <LanguageProvider>
              <InitializeConfig />
              <TopNav />
              <ConfigAlert />
              <main>
                {children}
              </main>
              <FloatingBall />
              <NetworkStatus />
              <WelcomeModal />
              <ToastContainer />
            </LanguageProvider>
          </ThemeProvider>
        </ErrorBoundary>
        
        {/* Vercel Analytics - 性能监控 */}
        {process.env.NODE_ENV === 'production' && (
          <>
            <script async src="https://cdn.vercel-insights.com/v1/script.debug.js" data-endpoint="/_vercel/insights/view" />
            <script async src="https://va.vercel-scripts.com/v1/speed-insights/script.debug.js" />
          </>
        )}

        {/* Microsoft Clarity - 用户行为分析 */}
        {(process.env.NEXT_PUBLIC_CLARITY_PROJECT_ID || process.env.NEXT_PUBLIC_CLARITY_ID) && (
          <script
            dangerouslySetInnerHTML={{
              __html: `
                (function(c,l,a,r,i,t,y){
                  c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
                  t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
                  y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
                })(window, document, "clarity", "script", "${process.env.NEXT_PUBLIC_CLARITY_PROJECT_ID || process.env.NEXT_PUBLIC_CLARITY_ID}");
              `,
            }}
          />
        )}
      </body>
    </html>
  );
}
