/**
 * Supabase 客户端配置
 * 用于用户认证和数据存储
 */

import { createClient } from '@supabase/supabase-js';

// Supabase 配置（从环境变量读取）
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

// 创建 Supabase 客户端
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  }
});

// === 用户认证相关 ===

/**
 * 邮箱注册
 */
export async function signUpWithEmail(email: string, password: string) {
  try {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      }
    });
    
    if (error) throw error;
    
    console.log('✅ 注册成功，请查看邮箱激活链接');
    return { data, error: null };
  } catch (error) {
    console.error('注册失败:', error);
    return { data: null, error };
  }
}

/**
 * 邮箱登录
 */
export async function signInWithEmail(email: string, password: string) {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    
    if (error) throw error;
    
    console.log('✅ 登录成功');
    return { data, error: null };
  } catch (error) {
    console.error('登录失败:', error);
    return { data: null, error };
  }
}

/**
 * Google 登录
 */
export async function signInWithGoogle() {
  try {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      }
    });
    
    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error('Google 登录失败:', error);
    return { data: null, error };
  }
}

/**
 * GitHub 登录
 */
export async function signInWithGitHub() {
  try {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'github',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      }
    });
    
    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error('GitHub 登录失败:', error);
    return { data: null, error };
  }
}

/**
 * 登出
 */
export async function signOut() {
  try {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    console.log('✅ 已登出');
  } catch (error) {
    console.error('登出失败:', error);
    throw error;
  }
}

/**
 * 获取当前用户
 */
export async function getCurrentUser() {
  try {
    const { data: { user }, error } = await supabase.auth.getUser();
    if (error) throw error;
    return user;
  } catch (error) {
    console.error('获取用户信息失败:', error);
    return null;
  }
}

/**
 * 获取用户会话
 */
export async function getSession() {
  try {
    const { data: { session }, error } = await supabase.auth.getSession();
    if (error) throw error;
    return session;
  } catch (error) {
    console.error('获取会话失败:', error);
    return null;
  }
}

// === 订阅相关 ===

/**
 * 获取用户订阅信息
 */
export async function getUserSubscription(userId: string) {
  try {
    const { data, error } = await supabase
      .from('subscriptions')
      .select('*')
      .eq('user_id', userId)
      .single();
    
    if (error) throw error;
    return data;
  } catch (error) {
    console.error('获取订阅信息失败:', error);
    return null;
  }
}

/**
 * 获取用户配额
 */
export async function getUserQuota(userId: string) {
  try {
    const { data, error } = await supabase
      .from('usage')
      .select('*')
      .eq('user_id', userId)
      .gte('created_at', new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString())
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    
    // 统计今日使用量
    const generateCount = data?.filter(u => u.action === 'generate').length || 0;
    const editCount = data?.filter(u => u.action === 'edit').length || 0;
    
    return {
      generate: { used: generateCount },
      edit: { used: editCount }
    };
  } catch (error) {
    console.error('获取配额失败:', error);
    return null;
  }
}

/**
 * 记录使用量
 */
export async function recordUsage(userId: string, action: 'generate' | 'edit', metadata?: any) {
  try {
    const { error } = await supabase
      .from('usage')
      .insert({
        user_id: userId,
        action,
        metadata,
        created_at: new Date().toISOString()
      });
    
    if (error) throw error;
    console.log(`📊 使用记录已保存: ${action}`);
  } catch (error) {
    console.error('记录使用量失败:', error);
  }
}

// === 作品云端同步 ===

/**
 * 上传作品到云端
 */
export async function uploadArtworkToCloud(artwork: any) {
  try {
    // 上传图片到 Supabase Storage
    const fileName = `${artwork.userId}/${Date.now()}.png`;
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('artworks')
      .upload(fileName, await fetch(artwork.imageUrl).then(r => r.blob()));
    
    if (uploadError) throw uploadError;
    
    // 获取公开 URL
    const { data: { publicUrl } } = supabase.storage
      .from('artworks')
      .getPublicUrl(fileName);
    
    // 保存元数据到数据库
    const { error: dbError } = await supabase
      .from('artworks')
      .insert({
        user_id: artwork.userId,
        prompt: artwork.prompt,
        image_url: publicUrl,
        model: artwork.model,
        aspect_ratio: artwork.aspectRatio,
        parameters: artwork.parameters,
        created_at: new Date(artwork.timestamp).toISOString()
      });
    
    if (dbError) throw dbError;
    
    console.log('☁️ 作品已上传到云端');
    return publicUrl;
  } catch (error) {
    console.error('上传作品失败:', error);
    throw error;
  }
}

