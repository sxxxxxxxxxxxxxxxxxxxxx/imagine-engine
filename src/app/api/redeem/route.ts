/**
 * 卡密兑换API
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function POST(request: NextRequest) {
  try {
    const { code } = await request.json();

    if (!code || typeof code !== 'string') {
      return NextResponse.json({ error: '请提供有效的卡密' }, { status: 400 });
    }

    const authHeader = request.headers.get('authorization');
    const token = authHeader?.replace('Bearer ', '');

    if (!token) {
      return NextResponse.json({ error: '请先登录' }, { status: 401 });
    }

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      { global: { headers: { Authorization: `Bearer ${token}` } } }
    );

    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: '认证失败' }, { status: 401 });
    }

    const { data, error } = await supabase.rpc('redeem_activation_code', {
      p_user_id: user.id,
      p_code: code.toUpperCase().trim(),
    });

    if (error) {
      console.error('卡密兑换失败:', error);
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    if (!data.success) {
      return NextResponse.json({ error: data.message }, { status: 400 });
    }

    return NextResponse.json({
      success: true,
      message: `成功兑换！获得${data.quota_added}张配额，有效期${data.days_added}天`,
      data,
    });
  } catch (error: any) {
    console.error('兑换API错误:', error);
    return NextResponse.json({ error: '服务器错误' }, { status: 500 });
  }
}
