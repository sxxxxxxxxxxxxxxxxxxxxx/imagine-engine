/**
 * 调试面板组件（仅开发环境）
 * 显示 Supabase 连接状态和认证信息
 */

'use client';

import { useAuth } from '@/hooks/useAuth';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

export default function DebugPanel() {
  const { user, isLoggedIn, loading } = useAuth();
  const [supabaseStatus, setSupabaseStatus] = useState('checking');
  const [envCheck, setEnvCheck] = useState({
    url: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
    key: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  });

  useEffect(() => {
    checkSupabase();
  }, []);

  const checkSupabase = async () => {
    try {
      const { data, error } = await supabase.from('profiles').select('count').limit(1);
      if (error) {
        console.error('❌ Supabase 连接失败:', error);
        setSupabaseStatus('error: ' + error.message);
      } else {
        setSupabaseStatus('✅ connected');
      }
    } catch (error: any) {
      setSupabaseStatus('❌ error: ' + error.message);
      console.error('❌ Supabase 连接异常:', error);
    }
  };

  // 仅开发环境显示
  if (process.env.NODE_ENV !== 'development') return null;

  return (
    <div className="fixed bottom-4 left-4 p-4 bg-dark-900 text-white rounded-lg text-xs space-y-1 z-50 shadow-2xl border border-primary-500">
      <p className="font-bold text-primary-400">🔧 调试面板</p>
      <p>Supabase: <span className={supabaseStatus.includes('✅') ? 'text-green-400' : 'text-red-400'}>{supabaseStatus}</span></p>
      <p>ENV URL: {envCheck.url ? '✅' : '❌'}</p>
      <p>ENV KEY: {envCheck.key ? '✅' : '❌'}</p>
      <p>登录状态: {isLoggedIn ? '✅ 已登录' : '❌ 未登录'}</p>
      <p>用户邮箱: {user?.email || '无'}</p>
      <p>Loading: {loading ? '⏳' : '✅'}</p>
      <button
        onClick={checkSupabase}
        className="mt-2 px-2 py-1 bg-primary-600 rounded text-white hover:bg-primary-700"
      >
        重新检测
      </button>
    </div>
  );
}

