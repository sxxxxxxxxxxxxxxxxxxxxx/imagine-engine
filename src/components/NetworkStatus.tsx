'use client';

import { useNetworkStatus } from '@/hooks/useNetworkStatus';
import { useLanguage } from '@/contexts/LanguageContext';
import { Wifi, WifiOff } from 'lucide-react';

/**
 * 网络状态通知组件
 * 当网络断开或恢复时显示提示
 */
export default function NetworkStatus() {
  const { isOnline, wasOffline } = useNetworkStatus();
  const { language } = useLanguage();

  // 离线提示
  if (!isOnline) {
    return (
      <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-[60] animate-in slide-in-from-bottom-4 duration-300">
        <div className="bg-red-500 text-white px-6 py-3 rounded-full shadow-2xl flex items-center gap-3">
          <WifiOff className="w-5 h-5 animate-pulse" />
          <span className="font-medium">
            {language === 'zh' ? '网络已断开' : 'Network Disconnected'}
          </span>
        </div>
      </div>
    );
  }

  // 恢复在线提示（显示3秒）
  if (wasOffline) {
    return (
      <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-[60] animate-in slide-in-from-bottom-4 duration-300">
        <div className="bg-green-500 text-white px-6 py-3 rounded-full shadow-2xl flex items-center gap-3">
          <Wifi className="w-5 h-5" />
          <span className="font-medium">
            {language === 'zh' ? '网络已恢复' : 'Network Restored'}
          </span>
        </div>
      </div>
    );
  }

  return null;
}
