import { NextRequest, NextResponse } from 'next/server';
import { editImage } from '@/lib/bananaApi';
import { createClient } from '@supabase/supabase-js';

// App Router配置
export const runtime = 'nodejs';
export const maxDuration = 60;

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { tool, image, mask, instruction, bgColor, originalDimensions, apiKey, baseUrl, model } = body;

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

    // ✅ 2. 扣减配额（编辑也消耗1张配额）
    const { data: deductData, error: deductError } = await supabase.rpc('deduct_user_quota', {
      p_user_id: user.id,
      p_amount: 1,
      p_action_type: 'edit_image',
      p_metadata: {
        tool,
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
    if (!tool || !['inpaint', 'remove_bg', 'id_photo'].includes(tool)) {
      return NextResponse.json(
        { error: '请提供有效的编辑工具类型 (inpaint, remove_bg 或 id_photo)' },
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