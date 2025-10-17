/**
 * Stripe 支付集成
 * 用于订阅和计费管理
 */

import { loadStripe } from '@stripe/stripe-js';

// 初始化 Stripe
const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || ''
);

// 产品价格 ID（需要在 Stripe Dashboard 创建）
export const PRICE_IDS = {
  pro_monthly: 'price_pro_monthly_id',
  pro_yearly: 'price_pro_yearly_id',
  team_monthly: 'price_team_monthly_id',
  team_yearly: 'price_team_yearly_id',
};

/**
 * 创建 Checkout Session
 */
export async function createCheckoutSession(
  priceId: string,
  userId: string,
  successUrl: string,
  cancelUrl: string
) {
  try {
    const response = await fetch('/api/stripe/create-checkout-session', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        priceId,
        userId,
        successUrl,
        cancelUrl,
      }),
    });

    const { sessionId, error } = await response.json();

    if (error) {
      throw new Error(error);
    }

    // 重定向到 Stripe Checkout
    const stripe = await stripePromise;
    if (!stripe) {
      throw new Error('Stripe 加载失败');
    }

    const { error: stripeError } = await stripe.redirectToCheckout({
      sessionId,
    });

    if (stripeError) {
      throw stripeError;
    }
  } catch (error) {
    console.error('创建 Checkout Session 失败:', error);
    throw error;
  }
}

/**
 * 创建 Customer Portal Session（管理订阅）
 */
export async function createPortalSession(userId: string, returnUrl: string) {
  try {
    const response = await fetch('/api/stripe/create-portal-session', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        userId,
        returnUrl,
      }),
    });

    const { url, error } = await response.json();

    if (error) {
      throw new Error(error);
    }

    // 重定向到 Stripe Customer Portal
    window.location.href = url;
  } catch (error) {
    console.error('创建 Portal Session 失败:', error);
    throw error;
  }
}

/**
 * 获取订阅状态
 */
export async function getSubscriptionStatus(userId: string) {
  try {
    const response = await fetch(`/api/stripe/subscription-status?userId=${userId}`);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('获取订阅状态失败:', error);
    return null;
  }
}

