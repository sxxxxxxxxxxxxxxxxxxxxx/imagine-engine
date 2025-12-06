import { NextRequest, NextResponse } from 'next/server';
import { editImage } from '@/lib/bananaApi';
import { createClient } from '@supabase/supabase-js';

// App Router配置
export const runtime = 'nodejs';
export const maxDuration = 60;

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { tool, image, mask, instruction, bgColor, originalDimensions, apiKey, baseUrl, model, scale, quotaCost } = body;

    // ✅ 1. 验证用户登录（从请求头获取token）
    const authHeader = request.headers.get('authorization');
    const token = authHeader?.replace('Bearer ', '');

    if (!token) {
      console.log('❌ 未登录用户尝试编辑图片（无token）');
      return NextResponse.json({
        error: 'AUTHENTICATION_REQUIRED',
        message: '请先登录后再编辑图片'
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

    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      console.log('❌ Token无效或已过期');
      return NextResponse.json({
        error: 'AUTHENTICATION_REQUIRED',
        message: '请先登录后再编辑图片'
      }, { status: 401 });
    }

    console.log('✅ 用户已登录:', user.email);

    // ✅ 2. 检查用户是否被禁用
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('is_disabled, disabled_reason')
      .eq('id', user.id)
      .single();

    // 只有明确为true才禁用
    if (profile?.is_disabled === true) {
      console.log('🚫 禁用用户尝试编辑图片:', user.email, '原因:', profile.disabled_reason);
      const reason = profile.disabled_reason || '您的账号暂时无法使用';
      return NextResponse.json({
        error: 'QUOTA_EXHAUSTED',
        message: `抱歉，${reason}。如有疑问，请联系客服。`,
        disabled: true,
        disabledReason: reason
      }, { status: 403 });
    }

    console.log('✅ 用户可以编辑图片:', user.email, 'is_disabled =', profile?.is_disabled);

    // ✅ 3. 扣减配额（根据工具类型消耗不同配额）
    // upscale工具消耗2张，其他工具消耗1张
    const quotaAmount = tool === 'upscale' ? (quotaCost || 2) : 1;
    
    const { data: deductData, error: deductError } = await supabase.rpc('deduct_user_quota', {
      p_user_id: user.id,
      p_amount: quotaAmount,
      p_action_type: tool === 'upscale' ? 'upscale_image' : 'edit_image',
      p_metadata: {
        tool,
        scale: scale || null,
        model: model || 'gemini-2.5-flash-image'
      }
    });

    if (deductError) {
      console.error('❌ 配额扣减失败:', deductError);
      return NextResponse.json({
        error: 'QUOTA_DEDUCTION_FAILED',
        message: '配额扣减失败，请稍后重试'
      }, { status: 500 });
    }

    console.log(`✅ 配额已扣减: 剩余=${deductData.remaining}`);

    // 验证必需参数
    if (!tool || !['inpaint', 'remove_bg', 'id_photo', 'upscale'].includes(tool)) {
      return NextResponse.json(
        { error: '请提供有效的编辑工具类型 (inpaint, remove_bg, id_photo 或 upscale)' },
        { status: 400 }
      );
    }

    if (!image || typeof image !== 'string') {
      return NextResponse.json(
        { error: '请提供有效的图片数据' },
        { status: 400 }
      );
    }

    // 对于inpaint工具，mask是可选的
    if (tool === 'inpaint' && mask && typeof mask !== 'string') {
      return NextResponse.json(
        { error: '请提供有效的遮罩数据' },
        { status: 400 }
      );
    }

    console.log('收到图片编辑请求:', { tool, imageLength: image.length, instruction, bgColor });

    // 调用Nano Banana API，传递配置
    const result = await editImage({
      tool,
      image,
      mask,
      instruction,
      bgColor,
      scale,
      originalDimensions
    }, {
      apiKey,
      baseUrl,
      model
    });

    if (result.error) {
      console.error('API调用失败:', result.error);
      return NextResponse.json(
        { error: typeof result.error === 'string' ? result.error : 'API调用失败' },
        { status: 500 }
      );
    }

    console.log('图片编辑成功:', {
      hasImage: !!result.imageUrl,
      needsResize: result.needsResize,
      backendResized: result.backendResized
    });

    //✅ 更新使用日志（记录编辑的图片URL）
    await supabase
      .from('usage_logs')
      .update({ image_url: result.imageUrl })
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(1);

    // 返回完整的响应数据
    return NextResponse.json({
      imageUrl: result.imageUrl,
      needsResize: result.needsResize,
      backendResized: result.backendResized,
      originalDimensions: result.originalDimensions,
      quota_remaining: deductData.remaining  // ✅ 返回剩余配额
    });
  } catch (error) {
    console.error('Edit API Error:', error);
    return NextResponse.json(
      { error: '服务器内部错误，请稍后重试' },
      { status: 500 }
    );
  }
}

// 处理CORS预检请求
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}