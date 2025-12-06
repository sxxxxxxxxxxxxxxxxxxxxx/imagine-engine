/**
 * 配额指示器组件
 * 显示在顶部导航栏，实时显示用户剩余配额
 */

'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/lib/supabase';
import { Zap, AlertCircle } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

export default function QuotaIndicator() {
  const { user, isLoggedIn } = useAuth();
  const { language } = useLanguage();
  const [quota, setQuota] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isLoggedIn && user) {
      fetchQuota();
      
      // 每60秒刷新一次配额（性能优化）
      const interval = setInterval(fetchQuota, 60000);
      return () => clearInterval(interval);
    } else {
      setQuota(null);
    }
  }, [isLoggedIn, user]);

  const fetchQuota = async () => {
    setLoading(true);
    try {
      // 获取 Supabase session token
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        console.log('⚠️ 无session，跳过配额检查');
        setLoading(false);
        return;
      }

      const res = await fetch('/api/quota/check', {
        headers: {
          'Authorization': `Bearer ${session.access_token}`
        }
      });
      const data = await res.json();
      setQuota(data);
      console.log('🔄 配额刷新:', data);
    } catch (error) {
      console.error('❌ 获取配额失败:', error);
    } finally {
      setLoading(false);
    }
  };

  // 未登录时不显示
  if (!isLoggedIn || !quota) return null;

  // 计算数据
  const totalQuota = quota.totalQuota || 0;
  const usedQuota = quota.usedQuota || 0;
  const remaining = quota.remaining || 0;
  const usagePercentage = totalQuota > 0 ? (usedQuota / totalQuota) * 100 : 0;

  // 配额低于20%时显示红色
  const isLow = remaining <= Math.ceil(totalQuota * 0.2);

  return (
    <div 
      className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white dark:bg-dark-900 border border-dark-200 dark:border-dark-800 hover:border-primary-400 dark:hover:border-primary-600 transition-colors cursor-pointer whitespace-nowrap"
      onClick={fetchQuota}
      title={language === 'zh' ? '点击刷新配额' : 'Click to refresh quota'}
    >
      {loading ? (
        <div className="w-4 h-4 border-2 border-primary-500 border-t-transparent rounded-full animate-spin flex-shrink-0" />
      ) : (
        <Zap className="w-4 h-4 text-primary-500 flex-shrink-0" />
      )}
      
      <div className="flex items-baseline gap-1 whitespace-nowrap">
        <span className={`text-base font-semibold ${isLow ? 'text-red-600 dark:text-red-400' : 'text-primary-600 dark:text-primary-400'}`}>
          {remaining}
        </span>
        <span className="text-xs text-dark-500">
          /{totalQuota}
        </span>
      </div>

      {/* 配额不足警告（剩余≤2张时显示）*/}
      {remaining <= 2 && remaining > 0 && (
        <AlertCircle className="w-3.5 h-3.5 text-red-500 flex-shrink-0" />
      )}
    </div>
  );
}

