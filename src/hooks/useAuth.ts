/**
 * 用户认证 Hook
 * 提供注册、登录、登出等功能
 */

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { User } from '@supabase/supabase-js';

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 获取当前登录用户
    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user);
      setLoading(false);
    });

    // 监听认证状态变化
    const { data: authListener } = supabase.auth.onAuthStateChange(
      (event, session) => {
        console.log('🔐 认证状态变化:', event, session?.user?.email);
        setUser(session?.user ?? null);
        setLoading(false);
      }
    );

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  // 注册
  const signUp = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      });

      if (error) throw error;

      console.log('✅ 注册成功:', data.user?.email);
      return { data, error: null };
    } catch (error: any) {
      console.error('❌ 注册失败:', error);
      return { data: null, error };
    }
  };

  // 登录
  const signIn = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      console.log('✅ 登录成功:', data.user?.email);
      return { data, error: null };
    } catch (error: any) {
      console.error('❌ 登录失败:', error);
      return { data: null, error };
    }
  };

  // 登出
  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;

      console.log('✅ 登出成功');
      setUser(null);
      return { error: null };
    } catch (error: any) {
      console.error('❌ 登出失败:', error);
      return { error };
    }
  };

  // OAuth 登录（GitHub、Google 等）
  const signInWithOAuth = async (provider: 'github' | 'google') => {
    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      });

      if (error) throw error;

      console.log('✅ OAuth 登录发起:', provider);
      return { data, error: null };
    } catch (error: any) {
      console.error('❌ OAuth 登录失败:', error);
      return { data: null, error };
    }
  };

  // 重置密码
  const resetPassword = async (email: string) => {
    try {
      const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/reset-password`,
      });

      if (error) throw error;

      console.log('✅ 重置密码邮件已发送');
      return { data, error: null };
    } catch (error: any) {
      console.error('❌ 重置密码失败:', error);
      return { data: null, error };
    }
  };

  return {
    user,
    loading,
    isLoggedIn: !!user,
    signUp,
    signIn,
    signOut,
    signInWithOAuth,
    resetPassword,
  };
}


