import { NextRequest, NextResponse } from 'next/server';
import { generateImage } from '@/lib/bananaApi';
import { createClient } from '@supabase/supabase-js';
import { calculateQuotaCost } from '@/lib/quotaMultiplier';

// App Router配置（增加函数超时和内存）
export const runtime = 'nodejs';
export const maxDuration = 60;  // 60秒超时

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { prompt, style, aspectRatio, referenceImage, referenceImages, baseImage, apiKey, baseUrl, model } = body;

    // 验证必需参数
    if (!prompt || typeof prompt !== 'string' || prompt.trim() === '') {
      return NextResponse.json(
        { error: '请提供有效的提示词' },
        { status: 400 }
      );
    }

    // ✅ 1. 验证用户登录（从请求头获取token）
    const authHeader = request.headers.get('authorization');
    const token = authHeader?.replace('Bearer ', '');

    if (!token) {
      console.log('❌ 未登录用户尝试生成图片（无token）');
      return NextResponse.json({ 
        error: 'AUTHENTICATION_REQUIRED',
        message: '请先登录后再生成图片'
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
        message: '请先登录后再生成图片'
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
      console.log('🚫 禁用用户尝试生成图片:', user.email, '原因:', profile.disabled_reason);
      const reason = profile.disabled_reason || '您的账号暂时无法使用';
      return NextResponse.json({ 
        error: 'QUOTA_EXHAUSTED',
        message: `抱歉，${reason}。如有疑问，请联系客服。`,
        disabled: true,
        disabledReason: reason
      }, { status: 403 });
    }
    
    console.log('✅ 用户可以生成图片:', user.email, 'is_disabled =', profile?.is_disabled);

    // ✅ 3. 计算配额消耗（根据模型）
    const quotaCost = calculateQuotaCost(1, model);
    
    // ✅ 4. 检查配额
    const { data: quotaData, error: quotaError } = await supabase.rpc('check_user_quota', {
      p_user_id: user.id
    });

    if (quotaError || !quotaData || quotaData.remaining < quotaCost) {
      console.log(`❌ 配额不足: 需要${quotaCost}张，剩余${quotaData?.remaining || 0}张`);
      return NextResponse.json({
        error: 'QUOTA_EXHAUSTED',
        message: `配额不足，需要${quotaCost}张，当前剩余${quotaData?.remaining || 0}张`,
        remaining: quotaData?.remaining || 0,
        required: quotaCost
      }, { status: 403 });
    }

    console.log(`✅ 配额充足: 需要${quotaCost}张，剩余=${quotaData.remaining}`);

    // ✅ 多图融合支持
    const hasMultipleImages = referenceImages && Array.isArray(referenceImages) && referenceImages.length > 1;

    console.log('收到文生图请求:', { 
      prompt: prompt.substring(0, 100) + '...', 
      style, 
      aspectRatio,
      hasReferenceImage: !!referenceImage,
      hasBaseImage: !!baseImage,
      multiImageCount: hasMultipleImages ? referenceImages.length : 0  // ✅ 记录多图数量
    });

    // 调用AI API生成图片，传递配置和基础图片
    const result = await generateImage({
      prompt: prompt.trim(),
      style: style || 'realistic',
      baseImage: baseImage || referenceImage,  // 单图模式
      referenceImages: hasMultipleImages ? referenceImages : undefined,  // ✅ 多图模式
      aspectRatio
    }, {
      apiKey,
      baseUrl,
      model
    });

    if (result.error) {
      console.error('生成图片失败:', result.error);
      return NextResponse.json(
        { error: result.error },
        { status: 500 }
      );
    }

    if (!result.imageUrl) {
      return NextResponse.json(
        { error: '未能生成图片，API未返回有效的图片URL' },
        { status: 500 }
      );
    }

    console.log('图片生成成功:', result.imageUrl);

    // ✅ 5. 生成成功后才扣减配额（根据模型计算倍数）
    const { data: deductData, error: deductError } = await supabase.rpc('deduct_user_quota', {
      p_user_id: user.id,
      p_amount: quotaCost, // 使用计算后的配额数量
      p_action_type: 'generate_image',
      p_metadata: {
        prompt: prompt.substring(0, 200),
        model: model || 'gemini-2.5-flash-image',
        style: style || 'realistic',
        aspectRatio: aspectRatio || 'auto',
        image_url: result.imageUrl,
        quota_multiplier: quotaCost // 记录配额倍数
      }
    });

    if (deductError) {
      console.error('❌ 配额扣减失败（但图片已生成）:', deductError);
      // 图片已生成，仍然返回，但提示配额扣减失败
    } else {
      console.log(`✅ 配额已扣减: ${quotaCost}张，剩余=${deductData.remaining}`);
    }

    return NextResponse.json({
      imageUrl: result.imageUrl,
      needsResize: result.needsResize || false,
      backendResized: result.backendResized || false,
      originalDimensions: result.originalDimensions,
      aspectRatio: aspectRatio,
      quota_remaining: deductData?.remaining || quotaData.remaining - quotaCost, // ✅ 返回剩余配额
      quota_cost: quotaCost // 返回本次消耗的配额
    });

  } catch (error) {
    console.error('API路由错误:', error);
    return NextResponse.json(
      { error: `服务器内部错误: ${error instanceof Error ? error.message : '未知错误'}` },
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