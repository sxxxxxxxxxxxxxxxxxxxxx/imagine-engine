import { useState, useEffect } from 'react';

/**
 * 网络状态检测Hook
 * 检测用户是否在线，用于友好的离线提示
 */
export function useNetworkStatus() {
  const [isOnline, setIsOnline] = useState(true);
  const [wasOffline, setWasOffline] = useState(false);

  useEffect(() => {
    // 初始化状态
    setIsOnline(navigator.onLine);

    const handleOnline = () => {
      console.log('🌐 网络已连接');
      setIsOnline(true);
      setWasOffline(true);
      
      // 3秒后清除"曾经离线"标志
      setTimeout(() => setWasOffline(false), 3000);
    };

    const handleOffline = () => {
      console.log('📡 网络已断开');
      setIsOnline(false);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return { isOnline, wasOffline };
}
