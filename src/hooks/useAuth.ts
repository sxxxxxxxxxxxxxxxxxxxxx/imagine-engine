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
    // 初始化：先尝试从 localStorage 恢复 session
    const initializeAuth = async () => {
      try {
        // 1. 首先获取已保存的 session（从 localStorage）
        const { data: { session } } = await supabase.auth.getSession();
        
        if (session?.user) {
          console.log('✅ 从 localStorage 恢复 session:', session.user.email);
          setUser(session.user);
          setLoading(false);
        } else {
          // 2. 如果没有 session，尝试 getUser（会触发自动恢复）
          const { data: { user }, error } = await supabase.auth.getUser();
          
          if (user && !error) {
            console.log('✅ 通过 getUser 恢复用户:', user.email);
            setUser(user);
          } else {
            console.log('ℹ️ 未找到已保存的登录状态');
            setUser(null);
          }
          setLoading(false);
        }
      } catch (error) {
        console.error('❌ 初始化认证状态失败:', error);
        setUser(null);
        setLoading(false);
      }
    };

    initializeAuth();

    // 监听认证状态变化（登录、登出、token刷新等）
    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('🔐 认证状态变化:', event, session?.user?.email);
        
        // 处理各种认证事件
        switch (event) {
          case 'INITIAL_SESSION':
            // 初始化时恢复 session（页面刷新时触发）
            if (session?.user) {
              console.log('✅ 初始化恢复 session:', session.user.email);
              setUser(session.user);
            } else {
              setUser(null);
            }
            setLoading(false);
            break;
            
          case 'SIGNED_IN':
            // 用户登录
            console.log('✅ 用户登录:', session?.user?.email);
            setUser(session?.user ?? null);
            setLoading(false);
            break;
            
          case 'SIGNED_OUT':
            // 用户登出
            console.log('✅ 用户登出');
            setUser(null);
            setLoading(false);
            break;
            
          case 'TOKEN_REFRESHED':
            // Token 刷新（保持登录状态）
            if (session?.user) {
              console.log('✅ Token 已刷新:', session.user.email);
              setUser(session.user);
            }
            setLoading(false);
            break;
            
          case 'USER_UPDATED':
            // 用户信息更新
            const { data: { user } } = await supabase.auth.getUser();
            if (user) {
              console.log('✅ 用户信息已更新:', user.email);
              setUser(user);
            }
            setLoading(false);
            break;
            
          default:
            // 其他事件（如 PASSWORD_RECOVERY）
            setUser(session?.user ?? null);
            setLoading(false);
            break;
        }
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


