import { NextRequest, NextResponse } from 'next/server';
import { generateImage } from '@/lib/bananaApi';
import { createClient } from '@supabase/supabase-js';
import { ProviderManager } from '@/lib/apiProviders';
import { calculateQuotaCost } from '@/lib/quotaMultiplier';

export const runtime = 'nodejs';
export const maxDuration = 60;

// 图片生成提示词模板
const IMAGE_PROMPT_TEMPLATE = `你是一个专业的小红书配图设计师。根据以下页面内容，生成一张适合小红书风格的配图。

页面内容：
{page_content}

要求：
1. 图片风格要符合小红书审美（清新、温馨、有质感）
2. 如果是封面页，要突出标题和主题
3. 如果是内容页，要清晰展示关键信息
4. 色彩搭配要和谐，避免过于鲜艳
5. 构图要简洁有力，适合手机竖屏观看
6. 文字要清晰可读（如果包含文字）

请生成详细的图片描述（prompt），用于AI图片生成：`;

function buildImagePrompt(pageContent: string, fullOutline: string = '', userTopic: string = '') {
  let prompt = IMAGE_PROMPT_TEMPLATE.replace('{page_content}', pageContent);
  
  if (fullOutline) {
    prompt += `\n\n完整大纲上下文：\n${fullOutline.substring(0, 500)}`;
  }
  
  if (userTopic) {
    prompt += `\n\n用户主题：${userTopic}`;
  }
  
  return prompt;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { page, taskId, fullOutline, userTopic, userImages, useReference, apiKey, baseUrl, model } = body;

    if (!page || !taskId) {
      return NextResponse.json(
        { success: false, error: '请提供页面信息和任务ID' },
        { status: 400 }
      );
    }

    // 验证用户登录
    const authHeader = request.headers.get('authorization');
    const token = authHeader?.replace('Bearer ', '');

    if (!token) {
      return NextResponse.json(
        { success: false, error: 'AUTHENTICATION_REQUIRED', message: '请先登录' },
        { status: 401 }
      );
    }

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        global: {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      }
    );

    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        { success: false, error: 'AUTHENTICATION_REQUIRED', message: '请先登录' },
        { status: 401 }
      );
    }

    // 计算配额消耗（根据模型）
    const imageModel = model || 'gemini-3-pro-image-preview';
    const quotaCost = calculateQuotaCost(1, imageModel);

    // 检查配额
    const { data: quotaData, error: quotaError } = await supabase.rpc('check_user_quota', {
      p_user_id: user.id,
    });

    if (quotaError || !quotaData || quotaData.remaining < quotaCost) {
      return NextResponse.json(
        {
          success: false,
          error: 'QUOTA_EXHAUSTED',
          message: `配额不足，需要 ${quotaCost} 张，剩余 ${quotaData?.remaining || 0} 张`,
        },
        { status: 403 }
      );
    }

    // 构建图片生成提示词
    const imagePrompt = buildImagePrompt(
      page.content,
      fullOutline || '',
      userTopic || ''
    );

    // 确定参考图片
    let referenceImage: string | undefined;
    if (useReference !== false) {
      if (page.type === 'cover' && userImages && userImages.length > 0) {
        referenceImage = userImages[0];
      }
    }

    // 调用图片生成API
    const result = await generateImage(
      {
        prompt: imagePrompt,
        style: 'realistic',
        aspectRatio: '9:16', // 小红书竖屏比例
        baseImage: referenceImage,
      },
      {
        apiKey,
        baseUrl,
        model: model || 'gemini-3-pro-image-preview', // 默认使用gemini-3-pro-image-preview
      }
    );

    if (result.error || !result.imageUrl) {
      return NextResponse.json(
        {
          success: false,
          error: result.error || '图片生成失败',
        },
        { status: 500 }
      );
    }

    // 扣减配额（根据模型计算倍数）
    const { data: deductData, error: deductError } = await supabase.rpc('deduct_user_quota', {
      p_user_id: user.id,
      p_amount: quotaCost, // 使用计算后的配额数量
      p_action_type: 'generate_image',
      p_metadata: {
        prompt: page.content.substring(0, 200),
        model: imageModel,
        task_id: taskId,
        page_index: page.index,
        action: 'regenerate',
        quota_multiplier: quotaCost, // 记录配额倍数
      },
    });

    if (deductError) {
      console.error('❌ 重新生成图片配额扣减失败:', deductError);
      // 即使扣减失败，图片已生成，仍然返回成功
    }

    return NextResponse.json({
      success: true,
      imageUrl: result.imageUrl,
      index: page.index,
      quota_remaining: deductData?.remaining || quotaData.remaining - quotaCost, // 返回剩余配额
      quota_cost: quotaCost, // 返回本次消耗的配额
    });
  } catch (error) {
    console.error('重新生成图片错误:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : '重新生成失败',
      },
      { status: 500 }
    );
  }
}

