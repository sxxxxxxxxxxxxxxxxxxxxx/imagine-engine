'use client';

import { useEffect, useState } from 'react';
import { AlertCircle, Wifi, WifiOff, RefreshCw, X } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

interface ErrorNotificationProps {
  error: Error | string | null;
  onRetry?: () => void;
  onDismiss?: () => void;
  autoHide?: boolean;
  duration?: number;
}

export default function ErrorNotification({ 
  error, 
  onRetry, 
  onDismiss,
  autoHide = true,
  duration = 5000
}: ErrorNotificationProps) {
  const { language } = useLanguage();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (error) {
      setVisible(true);
      
      if (autoHide) {
        const timer = setTimeout(() => {
          setVisible(false);
          if (onDismiss) onDismiss();
        }, duration);
        
        return () => clearTimeout(timer);
      }
    } else {
      setVisible(false);
    }
  }, [error, autoHide, duration, onDismiss]);

  if (!error || !visible) return null;

  const errorMessage = typeof error === 'string' ? error : error.message;

  // 智能识别错误类型
  const getErrorInfo = (msg: string) => {
    if (msg.includes('timeout') || msg.includes('超时')) {
      return {
        icon: <AlertCircle className="w-5 h-5" />,
        title: language === 'zh' ? '请求超时' : 'Request Timeout',
        message: language === 'zh' ? '请检查网络连接或稍后重试' : 'Check network or retry later',
        color: 'orange'
      };
    }
    
    if (msg.includes('Failed to fetch') || msg.includes('网络')) {
      return {
        icon: <WifiOff className="w-5 h-5" />,
        title: language === 'zh' ? '网络连接失败' : 'Network Error',
        message: language === 'zh' ? '请检查您的网络连接' : 'Please check your network connection',
        color: 'red'
      };
    }
    
    if (msg.includes('401') || msg.includes('Unauthorized') || msg.includes('密钥')) {
      return {
        icon: <AlertCircle className="w-5 h-5" />,
        title: language === 'zh' ? 'API密钥无效' : 'Invalid API Key',
        message: language === 'zh' ? '请在设置中检查您的API密钥' : 'Check your API key in settings',
        color: 'yellow'
      };
    }
    
    if (msg.includes('429') || msg.includes('频繁')) {
      return {
        icon: <AlertCircle className="w-5 h-5" />,
        title: language === 'zh' ? '请求过于频繁' : 'Too Many Requests',
        message: language === 'zh' ? '请稍后再试（1分钟后）' : 'Please try again in 1 minute',
        color: 'orange'
      };
    }
    
    if (msg.includes('500') || msg.includes('服务器')) {
      return {
        icon: <AlertCircle className="w-5 h-5" />,
        title: language === 'zh' ? '服务器错误' : 'Server Error',
        message: language === 'zh' ? 'API服务暂时不可用' : 'API service temporarily unavailable',
        color: 'red'
      };
    }
    
    // 默认错误
    return {
      icon: <AlertCircle className="w-5 h-5" />,
      title: language === 'zh' ? '操作失败' : 'Operation Failed',
      message: msg,
      color: 'red'
    };
  };

  const errorInfo = getErrorInfo(errorMessage);

  const colorClasses = {
    red: 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800 text-red-900 dark:text-red-100',
    orange: 'bg-orange-50 dark:bg-orange-900/20 border-orange-200 dark:border-orange-800 text-orange-900 dark:text-orange-100',
    yellow: 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800 text-yellow-900 dark:text-yellow-100',
  };

  const buttonColorClasses = {
    red: 'bg-red-100 hover:bg-red-200 dark:bg-red-800/50 dark:hover:bg-red-700/50 text-red-700 dark:text-red-200',
    orange: 'bg-orange-100 hover:bg-orange-200 dark:bg-orange-800/50 dark:hover:bg-orange-700/50 text-orange-700 dark:text-orange-200',
    yellow: 'bg-yellow-100 hover:bg-yellow-200 dark:bg-yellow-800/50 dark:hover:bg-yellow-700/50 text-yellow-700 dark:text-yellow-200',
  };

  return (
    <div className="fixed top-4 right-4 z-[60] max-w-md animate-in slide-in-from-top-2 duration-300">
      <div className={`rounded-xl border-2 shadow-xl p-4 ${colorClasses[errorInfo.color as keyof typeof colorClasses]}`}>
        <div className="flex items-start gap-3">
          <div className="flex-shrink-0 mt-0.5">
            {errorInfo.icon}
          </div>
          
          <div className="flex-1 min-w-0">
            <h4 className="font-semibold mb-1">
              {errorInfo.title}
            </h4>
            <p className="text-sm opacity-90">
              {errorInfo.message}
            </p>
            
            {onRetry && (
              <button
                onClick={() => {
                  setVisible(false);
                  onRetry();
                }}
                className={`mt-3 flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${buttonColorClasses[errorInfo.color as keyof typeof buttonColorClasses]}`}
              >
                <RefreshCw className="w-4 h-4" />
                {language === 'zh' ? '重试' : 'Retry'}
              </button>
            )}
          </div>
          
          <button
            onClick={() => {
              setVisible(false);
              if (onDismiss) onDismiss();
            }}
            className="flex-shrink-0 opacity-50 hover:opacity-100 transition-opacity"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}

