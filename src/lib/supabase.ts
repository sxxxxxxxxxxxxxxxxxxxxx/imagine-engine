/**
 * Supabase 客户端配置
 * 用于用户认证和数据存储
 */

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

// 客户端（浏览器端使用，启用session持久化）
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,  // 关键：持久化session到localStorage
    autoRefreshToken: true,  // 自动刷新token
    detectSessionInUrl: true,  // 检测URL中的session
    storage: typeof window !== 'undefined' ? window.localStorage : undefined,
    storageKey: 'imagine-engine-auth',  // 自定义存储key
  }
});

// 服务端客户端（API Routes 使用，有管理员权限）
export const supabaseAdmin = createClient(
  supabaseUrl,
  process.env.SUPABASE_SERVICE_ROLE_KEY || supabaseAnonKey,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  }
);

// 数据库类型定义
export interface Profile {
  id: string;
  username: string | null;
  avatar_url: string | null;
  phone: string | null;
  role: string;
  status: string;
  stripe_customer_id: string | null;
  created_at: string;
  updated_at: string;
}

export interface Subscription {
  id: string;
  user_id: string;
  plan_type: 'free' | 'basic' | 'pro' | 'enterprise';
  status: 'active' | 'cancelled' | 'expired';
  quota_total: number;
  quota_used: number;
  quota_remaining: number;
  start_date: string;
  end_date: string;
  auto_renew: boolean;
  stripe_subscription_id: string | null;
  stripe_customer_id: string | null;
  created_at: string;
  updated_at: string;
}

export interface UsageLog {
  id: string;
  user_id: string;
  subscription_id: string;
  action_type: string;
  cost_quota: number;
  image_url: string | null;
  prompt: string | null;
  model_used: string | null;
  created_at: string;
}

export interface Transaction {
  id: string;
  user_id: string;
  subscription_id: string | null;
  amount: number;
  currency: string;
  payment_method: string | null;
  payment_status: string;
  transaction_no: string | null;
  stripe_payment_intent_id: string | null;
  description: string | null;
  created_at: string;
  completed_at: string | null;
}


