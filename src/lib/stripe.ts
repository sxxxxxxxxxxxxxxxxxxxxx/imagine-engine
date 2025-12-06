/**
 * Stripe 客户端配置
 * 用于订阅管理和支付处理
 */

import Stripe from 'stripe';
import { loadStripe } from '@stripe/stripe-js';

// 服务端 Stripe 客户端（仅服务端使用）
export const stripe = typeof window === 'undefined' && process.env.STRIPE_SECRET_KEY
  ? new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: '2024-12-18.acacia' as any,
      typescript: true,
    })
  : null as any;

// 客户端 Stripe Promise（安全初始化）
export const stripePromise = typeof window !== 'undefined' && process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
  ? loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY)
  : null;

// 套餐配置
export const PLANS = {
  free: {
    name: 'Free',
    nameZh: '免费版',
    price: 0,
    quota: 20,
    features: ['20张/月', '基础功能', '社区支持'],
    featuresZh: ['20张/月', '基础功能', '社区支持'],
    recommended: false,
  },
  basic: {
    name: 'Basic',
    nameZh: '基础版',
    price: 19.9,
    quota: 200,
    stripeProductId: 'prod_TG466SwVD4XO8D',
    stripePriceId: 'price_1SJXykFBO6WidBGBBWNWGZuZ',
    features: ['200张/月', '所有基础功能', '邮件支持', '社区论坛'],
    featuresZh: ['200张/月', '所有基础功能', '邮件支持', '社区论坛'],
    recommended: false,
  },
  pro: {
    name: 'Pro',
    nameZh: '专业版',
    price: 49.9,
    quota: 500,
    stripeProductId: 'prod_TG46IxfX1WBjni',
    stripePriceId: 'price_1SJXymFBO6WidBGBI774fwns',
    features: ['500张/月', '所有模型', '无限存储', 'API 访问'],
    featuresZh: ['500张/月', '所有模型', '无限存储', 'API 访问'],
    recommended: true,
  },
  enterprise: {
    name: 'Enterprise',
    nameZh: '企业版',
    price: 199.9,
    quota: 3000,
    stripeProductId: 'prod_TG46YEyTFd5lcI',
    stripePriceId: 'price_1SJXyoFBO6WidBGByezx7Lb0',
    features: ['3000张/月', '团队协作', '专属客服', '定制功能', 'SLA 保障'],
    featuresZh: ['3000张/月', '团队协作', '专属客服', '定制功能', 'SLA 保障'],
    recommended: false,
  },
};

// 按需购买配额包配置
export const QUOTA_PACKAGES = {
  small: {
    name: '10张配额包',
    nameZh: '10张配额包',
    quota: 10,
    price: 1.5,
    stripePriceId: 'price_quota_10', // 需要在 Stripe 后台创建
  },
  medium: {
    name: '50张配额包',
    nameZh: '50张配额包',
    quota: 50,
    price: 6.9,
    stripePriceId: 'price_quota_50',
  },
  large: {
    name: '100张配额包',
    nameZh: '100张配额包',
    quota: 100,
    price: 12.9,
    stripePriceId: 'price_quota_100',
    recommended: true,
  },
};

// 辅助函数：将人民币转换为分（Stripe 使用最小货币单位）
export function yuanToCents(yuan: number): number {
  return Math.round(yuan * 100);
}

// 辅助函数：将分转换为人民币
export function centsToYuan(cents: number): number {
  return cents / 100;
}
