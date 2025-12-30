'use client';

import { useEffect, useState } from 'react';
import { CheckCircle2, XCircle, AlertCircle, Info, X } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

export type ToastType = 'success' | 'error' | 'warning' | 'info';

export interface Toast {
  id: string;
  type: ToastType;
  message: string;
  title?: string;
  duration?: number;
  action?: {
    label: string;
    onClick: () => void;
  };
}

interface ToastProps {
  toast: Toast;
  onDismiss: (id: string) => void;
}

function ToastItem({ toast, onDismiss }: ToastProps) {
  const { language } = useLanguage();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // 淡入动画
    setTimeout(() => setIsVisible(true), 10);
    
    // 自动关闭
    if (toast.duration !== 0) {
      const timer = setTimeout(() => {
        setIsVisible(false);
        setTimeout(() => onDismiss(toast.id), 300);
      }, toast.duration || 3000);
      
      return () => clearTimeout(timer);
    }
  }, [toast.id, toast.duration, onDismiss]);

  const icons = {
    success: <CheckCircle2 className="w-5 h-5" />,
    error: <XCircle className="w-5 h-5" />,
    warning: <AlertCircle className="w-5 h-5" />,
    info: <Info className="w-5 h-5" />,
  };

  const colors = {
    success: 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800 text-green-800 dark:text-green-200',
    error: 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800 text-red-800 dark:text-red-200',
    warning: 'bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800 text-amber-800 dark:text-amber-200',
    info: 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800 text-blue-800 dark:text-blue-200',
  };

  const iconColors = {
    success: 'text-green-600 dark:text-green-400',
    error: 'text-red-600 dark:text-red-400',
    warning: 'text-amber-600 dark:text-amber-400',
    info: 'text-blue-600 dark:text-blue-400',
  };

  return (
    <div
      className={`
        max-w-md w-full
        transform transition-all duration-300 ease-out
        ${isVisible ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'}
      `}
    >
      <div className={`
        rounded-xl border-2 shadow-xl p-4 backdrop-blur-sm
        ${colors[toast.type]}
      `}>
        <div className="flex items-start gap-3">
          <div className={`flex-shrink-0 mt-0.5 ${iconColors[toast.type]}`}>
            {icons[toast.type]}
          </div>
          
          <div className="flex-1 min-w-0">
            {toast.title && (
              <h4 className="font-semibold mb-1 text-sm">
                {toast.title}
              </h4>
            )}
            <p className="text-sm leading-relaxed">
              {toast.message}
            </p>
            
            {toast.action && (
              <button
                onClick={() => {
                  toast.action?.onClick();
                  setIsVisible(false);
                  setTimeout(() => onDismiss(toast.id), 300);
                }}
                className="mt-3 px-3 py-1.5 rounded-lg text-xs font-medium bg-white/50 dark:bg-black/20 hover:bg-white/70 dark:hover:bg-black/40 transition-colors"
              >
                {toast.action.label}
              </button>
            )}
          </div>
          
          <button
            onClick={() => {
              setIsVisible(false);
              setTimeout(() => onDismiss(toast.id), 300);
            }}
            className="flex-shrink-0 opacity-50 hover:opacity-100 transition-opacity p-1"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

// Toast 管理器
class ToastManager {
  private toasts: Toast[] = [];
  private listeners: ((toasts: Toast[]) => void)[] = [];

  subscribe(listener: (toasts: Toast[]) => void) {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  private notify() {
    this.listeners.forEach(listener => listener([...this.toasts]));
  }

  show(toast: Omit<Toast, 'id'>) {
    const id = `toast-${Date.now()}-${Math.random()}`;
    const newToast: Toast = { ...toast, id };
    this.toasts.push(newToast);
    this.notify();
    return id;
  }

  dismiss(id: string) {
    this.toasts = this.toasts.filter(t => t.id !== id);
    this.notify();
  }

  success(message: string, options?: Omit<Toast, 'id' | 'type' | 'message'>) {
    return this.show({ type: 'success', message, ...options });
  }

  error(message: string, options?: Omit<Toast, 'id' | 'type' | 'message'>) {
    return this.show({ type: 'error', message, ...options });
  }

  warning(message: string, options?: Omit<Toast, 'id' | 'type' | 'message'>) {
    return this.show({ type: 'warning', message, ...options });
  }

  info(message: string, options?: Omit<Toast, 'id' | 'type' | 'message'>) {
    return this.show({ type: 'info', message, ...options });
  }
}

export const toastManager = new ToastManager();

// Toast 容器组件
export default function ToastContainer() {
  const [toasts, setToasts] = useState<Toast[]>([]);

  useEffect(() => {
    const unsubscribe = toastManager.subscribe(setToasts);
    return unsubscribe;
  }, []);

  return (
    <div className="fixed top-4 right-4 z-[100] pointer-events-none space-y-3">
      {toasts.map((toast, index) => (
        <div
          key={toast.id}
          className="pointer-events-auto"
          style={{ 
            transform: `translateY(${index * 12}px)`,
            zIndex: 100 - index
          }}
        >
          <ToastItem
            toast={toast}
            onDismiss={(id) => toastManager.dismiss(id)}
          />
        </div>
      ))}
    </div>
  );
}

