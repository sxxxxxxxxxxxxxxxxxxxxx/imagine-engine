/**
 * 配额检查 API
 * 返回用户当前的配额使用情况
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// 声明为动态路由
export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function GET(request: NextRequest) {
  try {
    // 从请求头获取 Authorization token
    const authHeader = request.headers.get('authorization');
    const token = authHeader?.replace('Bearer ', '');

    if (!token) {
      console.log('❌ API: 缺少认证token');
      return NextResponse.json({ 
        error: '请先登录',
        available: false,
        remaining: 0
      }, { status: 401 });
    }

    // 使用token创建Supabase客户端
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        global: {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      }
    );

    // 1. 验证用户登录
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      return NextResponse.json({ 
        error: '请先登录',
        available: false,
        remaining: 0
      }, { status: 401 });
    }

    console.log('🔍 检查用户配额:', user.email);

    // 2. 检查用户是否被禁用（强制刷新查询，禁用缓存）
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('is_disabled, disabled_reason')
      .eq('id', user.id)
      .maybeSingle();
    
    if (profileError) {
      console.error('❌ 查询用户资料失败:', profileError);
    }
    
    // 只有明确为true才禁用，避免null/undefined误判
    if (profile?.is_disabled === true) {
      console.log('🚫 用户已被禁用:', user.email, '原因:', profile.disabled_reason);
      const reason = profile.disabled_reason || '账号暂时无法使用';
      return NextResponse.json({ 
        error: `抱歉，${reason}。如需帮助，请联系客服。`,
        available: false,
        remaining: 0,
        totalQuota: 0,
        usedQuota: 0,
        disabled: true,
        disabledReason: reason
      }, { status: 403 });
    }
    
    console.log('✅ 用户未被禁用，可以正常使用:', user.email, 'is_disabled =', profile?.is_disabled);

    // 4. 查询当前有效订阅
    const { data: subscriptions, error: subError } = await supabase
      .from('subscriptions')
      .select('*')
      .eq('user_id', user.id)
      .eq('status', 'active')
      .gt('end_date', new Date().toISOString())
      .order('end_date', { ascending: false })
      .limit(1);

    if (subError) {
      console.error('❌ 查询订阅失败:', subError);
      return NextResponse.json({ error: '查询订阅失败' }, { status: 500 });
    }

    const subscription = subscriptions?.[0];

    if (!subscription) {
      return NextResponse.json({
        available: false,
        remaining: 0,
        subscriptionQuota: 0,
        extraQuota: 0,
        message: '无有效订阅，请升级套餐'
      });
    }

    // 5. 查询额外购买的配额包
    const { data: packages, error: pkgError } = await supabase
      .from('quota_packages')
      .select('quota_remaining')
      .eq('user_id', user.id)
      .gt('quota_remaining', 0)
      .or('expires_at.is.null,expires_at.gt.' + new Date().toISOString());

    const computedRemaining = (subscription as any).quota_remaining ?? (subscription.quota_total - subscription.quota_used);
    const extraQuota = packages?.reduce((sum, pkg) => sum + pkg.quota_remaining, 0) || 0;
    const totalRemaining = computedRemaining + extraQuota;

    console.log(`✅ 配额检查结果: 订阅配额=${subscription.quota_remaining}, 额外配额=${extraQuota}, 总计=${totalRemaining}`);

    return NextResponse.json({
      available: totalRemaining > 0,
      remaining: totalRemaining,
      subscriptionQuota: computedRemaining,
      extraQuota,
      planType: subscription.plan_type,
      totalQuota: subscription.quota_total,
      usedQuota: subscription.quota_used,
      endDate: subscription.end_date
    });

  } catch (error) {
    console.error('❌ 配额检查错误:', error);
    return NextResponse.json(
      { error: '配额检查失败' },
      { status: 500 }
    );
  }
}
