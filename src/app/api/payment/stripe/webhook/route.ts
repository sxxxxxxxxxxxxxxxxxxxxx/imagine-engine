/**
 * Stripe Webhook 处理器
 * 处理支付成功、订阅更新等事件
 */

import { NextRequest, NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
import { supabaseAdmin } from '@/lib/supabase';
import Stripe from 'stripe';
import { PLANS } from '@/lib/stripe';

export async function POST(request: NextRequest) {
  const body = await request.text();
  const signature = request.headers.get('stripe-signature');

  if (!signature) {
    return NextResponse.json({ error: 'Missing signature' }, { status: 400 });
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err: any) {
    console.error('❌ Webhook 签名验证失败:', err.message);
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
  }

  console.log(`📨 收到 Stripe Webhook 事件: ${event.type}`);

  // 处理不同类型的事件
  try {
    switch (event.type) {
      case 'checkout.session.completed':
        await handleCheckoutCompleted(event.data.object as Stripe.Checkout.Session);
        break;

      case 'payment_intent.succeeded':
        await handlePaymentSucceeded(event.data.object as Stripe.PaymentIntent);
        break;

      case 'payment_intent.payment_failed':
        await handlePaymentFailed(event.data.object as Stripe.PaymentIntent);
        break;

      default:
        console.log(`⚠️ 未处理的事件类型: ${event.type}`);
    }

    return NextResponse.json({ received: true });
  } catch (error: any) {
    console.error('❌ Webhook 处理失败:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

/**
 * 处理支付成功
 */
async function handleCheckoutCompleted(session: Stripe.Checkout.Session) {
  const userId = session.metadata?.supabase_uid;
  const planType = session.metadata?.plan_type;
  const quota = parseInt(session.metadata?.quota || '0');

  if (!userId || !planType) {
    console.error('❌ Webhook metadata 缺失');
    return;
  }

  console.log(`💰 处理支付成功: 用户=${userId}, 套餐=${planType}, 配额=${quota}`);

  const plan = PLANS[planType as keyof typeof PLANS];
  if (!plan) return;

  // 1. 创建订阅记录
  const startDate = new Date();
  const endDate = new Date();
  endDate.setMonth(endDate.getMonth() + 1); // 一个月后过期

  const { data: subscription, error: subError } = await supabaseAdmin
    .from('subscriptions')
    .insert({
      user_id: userId,
      plan_type: planType,
      status: 'active',
      quota_total: quota,
      quota_used: 0,
      start_date: startDate.toISOString(),
      end_date: endDate.toISOString(),
      stripe_customer_id: session.customer as string,
    })
    .select()
    .single();

  if (subError) {
    console.error('❌ 创建订阅失败:', subError);
    return;
  }

  // 2. 记录交易
  await supabaseAdmin.from('transactions').insert({
    user_id: userId,
    subscription_id: subscription.id,
    amount: session.amount_total! / 100, // 转换为元
    currency: session.currency?.toUpperCase() || 'CNY',
    payment_method: 'stripe',
    payment_status: 'completed',
    transaction_no: session.id,
    stripe_payment_intent_id: session.payment_intent as string,
    description: `${plan.nameZh} 订阅`,
    completed_at: new Date().toISOString(),
  });

  console.log(`✅ 订阅创建成功: ${subscription.id}`);
}

/**
 * 处理支付成功事件
 */
async function handlePaymentSucceeded(paymentIntent: Stripe.PaymentIntent) {
  console.log(`✅ 支付成功: ${paymentIntent.id}, 金额=${paymentIntent.amount / 100}`);
  
  // 更新交易状态
  await supabaseAdmin
    .from('transactions')
    .update({
      payment_status: 'completed',
      completed_at: new Date().toISOString(),
    })
    .eq('stripe_payment_intent_id', paymentIntent.id);
}

/**
 * 处理支付失败事件
 */
async function handlePaymentFailed(paymentIntent: Stripe.PaymentIntent) {
  console.log(`❌ 支付失败: ${paymentIntent.id}`);
  
  // 更新交易状态
  await supabaseAdmin
    .from('transactions')
    .update({
      payment_status: 'failed',
    })
    .eq('stripe_payment_intent_id', paymentIntent.id);
}

