import { NextRequest, NextResponse } from 'next/server';
import { generateImage } from '@/lib/bananaApi';
import { generateScientificPrompt, generateVariantPrompt } from '@/lib/scientificPrompts';
import { createClient } from '@supabase/supabase-js';
import { ScientificDrawingRequest } from '@/types/scientific';
import { calculateQuotaCost } from '@/lib/quotaMultiplier';

// App Router配置
export const runtime = 'nodejs';
export const maxDuration = 60;

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      description,
      discipline,
      drawingType = 'illustration',
      style = 'clean',
      components = [],
      size = 'A4',
      apiKey,
      baseUrl,
      model,
      templateId,
      referenceImage,  // 参考图（Base64）
      styleStrength = 70,  // 风格强度（30-90%）
      mode = 'single',  // 生成模式：single/lottery/batch
      variantCount = 4  // 抽卡模式的数量
    } = body as ScientificDrawingRequest & {
      apiKey: string;
      baseUrl: string;
      model: string;
      templateId?: string;
      referenceImage?: string;
      styleStrength?: number;
      mode?: 'single' | 'lottery' | 'batch';
      variantCount?: number;
    };

    // 验证参数
    if (!description || !discipline || !apiKey) {
      return NextResponse.json(
        { error: 'Missing required parameters: description, discipline, apiKey' },
        { status: 400 }
      );
    }

    // ✅ 1. 验证用户登录
    const authHeader = request.headers.get('authorization');
    const token = authHeader?.replace('Bearer ', '');

    if (!token) {
      return NextResponse.json({
        error: 'AUTHENTICATION_REQUIRED',
        message: '请先登录后再生成科研绘图'
      }, { status: 401 });
    }

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
      return NextResponse.json({
        error: 'AUTHENTICATION_REQUIRED',
        message: '请先登录后再生成科研绘图'
      }, { status: 401 });
    }

    // ✅ 2. 检查用户是否被禁用
    const { data: profile } = await supabase
      .from('profiles')
      .select('is_disabled, disabled_reason')
      .eq('id', user.id)
      .single();

    if (profile?.is_disabled === true) {
      const reason = profile.disabled_reason || '您的账号暂时无法使用';
      return NextResponse.json({
        error: 'QUOTA_EXHAUSTED',
        message: `抱歉，${reason}。如有疑问，请联系客服。`,
        disabled: true,
        disabledReason: reason
      }, { status: 403 });
    }

    // ✅ 3. 确定生成模式和配额消耗
    const isLotteryMode = mode === 'lottery';
    const count = isLotteryMode ? (variantCount || 4) : 1;
    const baseQuotaPerImage = 3; // 每张基础配额3张
    const modelMultiplier = calculateQuotaCost(1, model); // 获取模型倍数
    const quotaCost = baseQuotaPerImage * modelMultiplier * count; // 总配额消耗 = 基础配额 × 模型倍数 × 数量
    
    // 检查配额是否足够
    const { data: quotaCheck } = await supabase.rpc('check_user_quota', {
      p_user_id: user.id
    });
    
    if (!quotaCheck || quotaCheck.remaining < quotaCost) {
      return NextResponse.json({
        error: 'QUOTA_EXHAUSTED',
        message: `配额不足，需要${quotaCost}张（${count}张 × ${baseQuotaPerImage}基础 × ${modelMultiplier}倍），当前剩余${quotaCheck?.remaining || 0}张`
      }, { status: 403 });
    }

    // ✅ 4. 扣减配额
    const { data: deductData, error: deductError } = await supabase.rpc('deduct_user_quota', {
      p_user_id: user.id,
      p_amount: quotaCost,
      p_action_type: 'scientific_drawing',
      p_metadata: {
        discipline,
        drawingType,
        style,
        mode,
        count,
        model: model || 'gemini-2.5-flash-image',
        base_quota: baseQuotaPerImage,
        model_multiplier: modelMultiplier,
        quota_multiplier: quotaCost
      }
    });

    if (deductError) {
      console.error('❌ 配额扣减失败:', deductError);
      return NextResponse.json({
        error: 'QUOTA_DEDUCTION_FAILED',
        message: '配额扣减失败，请稍后重试'
      }, { status: 500 });
    }

    console.log(`✅ 配额已扣减: ${quotaCost}张，剩余=${deductData.remaining}`);

    // ✅ 5. 生成提示词
    const hasReference = !!referenceImage;
    const prompt = generateScientificPrompt({
      description,
      discipline,
      drawingType,
      style,
      components,
      size
    }, hasReference, styleStrength);

    console.log('📝 生成的科研绘图提示词:', prompt.substring(0, 200) + '...');

    // ✅ 6. 生成图片（单张或批量）
    const generateSingle = async (variantIndex?: number) => {
      let finalPrompt = prompt;
      if (variantIndex !== undefined && isLotteryMode) {
        // 抽卡模式：添加变体提示
        finalPrompt = generateVariantPrompt(prompt, variantIndex);
      }

      const result = await generateImage({
        prompt: finalPrompt,
        style: style === '3d' ? '3d' : 'realistic',
        aspectRatio: size === 'A4' ? '4:3' : size === '16:9' ? '16:9' : '1:1',
        referenceImages: hasReference ? [referenceImage!] : undefined
      }, {
        apiKey,
        baseUrl,
        model
      });

      return result;
    };

    // 抽卡模式：并行生成多个变体
    if (isLotteryMode) {
      const variants = await Promise.all(
        Array.from({ length: count }, (_, i) => generateSingle(i))
      );

      const results = variants.map((v, i) => ({
        imageUrl: v.imageUrl,
        variantIndex: i + 1,
        error: v.error
      }));

      // 记录使用日志
      for (const result of results) {
        if (result.imageUrl) {
          await supabase.from('usage_logs').insert({
            user_id: user.id,
            action_type: 'scientific_drawing',
            image_url: result.imageUrl,
            metadata: {
              discipline,
              drawingType,
              style,
              description,
              mode: 'lottery',
              variantIndex: result.variantIndex
            }
          });
        }
      }

      return NextResponse.json({
        variants: results,
        metadata: {
          discipline,
          drawingType,
          style,
          resolution: '300dpi',
          format: 'png',
          mode: 'lottery',
          count
        },
        quota_remaining: deductData.remaining
      });
    }

    // 单张模式
    const result = await generateSingle();

    if (result.error) {
      console.error('API调用失败:', result.error);
      return NextResponse.json(
        { error: typeof result.error === 'string' ? result.error : 'API调用失败' },
        { status: 500 }
      );
    }

    console.log('✅ 科研绘图生成成功');

    // ✅ 7. 记录使用日志
    await supabase
      .from('usage_logs')
      .insert({
        user_id: user.id,
        action_type: 'scientific_drawing',
        image_url: result.imageUrl,
        metadata: {
          discipline,
          drawingType,
          style,
          description,
          mode: hasReference ? 'reference' : 'single'
        }
      });

    // 返回结果
    return NextResponse.json({
      imageUrl: result.imageUrl,
      metadata: {
        discipline,
        drawingType,
        style,
        resolution: '300dpi',
        format: 'png',
        mode: hasReference ? 'reference' : 'single'
      },
      quota_remaining: deductData.remaining
    });

  } catch (error: any) {
    console.error('Scientific drawing API Error:', error);
    return NextResponse.json(
      { error: error.message || '服务器内部错误，请稍后重试' },
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
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });
}
