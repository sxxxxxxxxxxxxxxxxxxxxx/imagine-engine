/**
 * Stripe Checkout Session 创建 API
 * 用于创建订阅支付会话
 */

import { NextRequest, NextResponse } from 'next/server';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { stripe } from '@/lib/stripe';
import { PLANS } from '@/lib/stripe';

// 声明为动态路由
export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function POST(request: NextRequest) {
  try {
    const supabase = createRouteHandlerClient({ cookies });
    const { planType } = await request.json();

    // 1. 验证用户登录
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      return NextResponse.json({ 
        error: '请先登录' 
      }, { status: 401 });
    }

    // 2. 验证套餐类型
    const plan = PLANS[planType as keyof typeof PLANS];
    if (!plan || planType === 'free') {
      return NextResponse.json({ 
        error: '无效的套餐类型' 
      }, { status: 400 });
    }

    console.log(`💳 创建支付会话: 用户=${user.email}, 套餐=${planType}`);

    // 3. 获取或创建 Stripe 客户
    const { data: profile } = await supabase
      .from('profiles')
      .select('stripe_customer_id')
      .eq('id', user.id)
      .single();

    let customerId = profile?.stripe_customer_id;

    if (!customerId) {
      // 创建新的 Stripe 客户
      const customer = await stripe.customers.create({
        email: user.email!,
        metadata: {
          supabase_uid: user.id,
        },
      });
      customerId = customer.id;

      // 保存到数据库
      await supabase
        .from('profiles')
        .update({ stripe_customer_id: customerId })
        .eq('id', user.id);

      console.log(`✅ 创建 Stripe 客户: ${customerId}`);
    }

    // 4. 创建 Checkout Session
    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      mode: 'payment',  // 一次性支付（月订阅）
      payment_method_types: ['card', 'wechat_pay', 'alipay'],
      line_items: [
        {
          price: plan.stripePriceId,
          quantity: 1,
        },
      ],
      success_url: `${process.env.NEXT_PUBLIC_SITE_URL}/dashboard?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_SITE_URL}/pricing?canceled=true`,
      metadata: {
        supabase_uid: user.id,
        plan_type: planType,
        quota: plan.quota.toString(),
      },
      locale: 'zh',
    });

    console.log(`✅ Checkout Session 创建成功: ${session.id}`);

    return NextResponse.json({
      sessionId: session.id,
      url: session.url
    });

  } catch (error: any) {
    console.error('❌ 创建 Stripe Checkout 失败:', error);
    return NextResponse.json({ 
      error: error.message || '创建支付会话失败' 
    }, { status: 500 });
  }
}
