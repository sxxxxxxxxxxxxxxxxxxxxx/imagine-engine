/**
 * 配额扣减 API
 * 原子操作，防止超额使用
 */

import { NextRequest, NextResponse } from 'next/server';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';

export async function POST(request: NextRequest) {
  try {
    const supabase = createRouteHandlerClient({ cookies });
    const { amount = 1, action_type = 'generate_image', metadata = {} } = await request.json();

    // 1. 验证用户登录
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      return NextResponse.json({ 
        error: '请先登录',
        success: false 
      }, { status: 401 });
    }

    console.log(`🔻 扣减配额: 用户=${user.email}, 数量=${amount}, 类型=${action_type}`);

    // 2. 调用数据库函数进行原子扣减
    const { data, error } = await supabase.rpc('deduct_user_quota', {
      p_user_id: user.id,
      p_amount: amount,
      p_action_type: action_type,
      p_metadata: metadata
    });

    if (error) {
      console.error('❌ 配额扣减失败:', error);
      
      // 处理配额不足错误
      if (error.message.includes('Insufficient quota')) {
        return NextResponse.json({
          error: 'QUOTA_EXHAUSTED',
          message: '配额不足，请升级套餐或购买配额包',
          success: false,
          remaining: 0
        }, { status: 403 });
      }

      return NextResponse.json({ 
        error: error.message,
        success: false 
      }, { status: 500 });
    }

    console.log(`✅ 配额扣减成功: 剩余=${data.remaining}`);

    return NextResponse.json({
      success: true,
      remaining: data.remaining,
      deducted: data.deducted,
      subscription_id: data.subscription_id
    });

  } catch (error: any) {
    console.error('❌ 配额扣减错误:', error);
    return NextResponse.json(
      { error: error.message || '配额扣减失败', success: false },
      { status: 500 }
    );
  }
}

