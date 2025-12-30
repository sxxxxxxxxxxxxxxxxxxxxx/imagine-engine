import { NextRequest } from 'next/server';
import { generateImage } from '@/lib/bananaApi';
import { createClient } from '@supabase/supabase-js';
import { ProviderManager } from '@/lib/apiProviders';
import { calculateQuotaCost } from '@/lib/quotaMultiplier';

export const runtime = 'nodejs';
export const maxDuration = 300; // 5分钟超时（批量生成需要更长时间）

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

async function generateSingleImage(
  page: { index: number; type: string; content: string },
  taskId: string,
  fullOutline: string,
  userTopic: string,
  userImages: string[] | null,
  apiKey?: string,
  baseUrl?: string,
  model?: string
): Promise<{ index: number; success: boolean; imageUrl?: string; error?: string }> {
  try {
    // 构建图片生成提示词
    const imagePrompt = buildImagePrompt(page.content, fullOutline, userTopic);
    
    // 如果有封面图，使用第一张用户参考图
    const referenceImage = 
      page.type === 'cover' && userImages && userImages.length > 0
        ? userImages[0]
        : undefined;

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
      return {
        index: page.index,
        success: false,
        error: result.error || '图片生成失败',
      };
    }

    return {
      index: page.index,
      success: true,
      imageUrl: result.imageUrl,
    };
  } catch (error) {
    return {
      index: page.index,
      success: false,
      error: error instanceof Error ? error.message : '图片生成异常',
    };
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { pages, taskId, fullOutline, userTopic, userImages, apiKey, baseUrl, model } = body;

    if (!pages || !Array.isArray(pages) || pages.length === 0) {
      return new Response(
        JSON.stringify({ success: false, error: '请提供有效的页面列表' }),
        {
          status: 400,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }

    // 验证用户登录
    const authHeader = request.headers.get('authorization');
    const token = authHeader?.replace('Bearer ', '');

    if (!token) {
      return new Response(
        JSON.stringify({ success: false, error: 'AUTHENTICATION_REQUIRED', message: '请先登录' }),
        {
          status: 401,
          headers: { 'Content-Type': 'application/json' },
        }
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
      return new Response(
        JSON.stringify({ success: false, error: 'AUTHENTICATION_REQUIRED', message: '请先登录' }),
        {
          status: 401,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }

    // 计算总配额消耗（根据模型计算每张图片的配额倍数）
    const quotaCostPerImage = calculateQuotaCost(1, model || 'gemini-3-pro-image-preview');
    const totalQuotaCost = pages.length * quotaCostPerImage;

    // 检查配额（批量生成需要检查总配额）
    const { data: quotaData, error: quotaError } = await supabase.rpc('check_user_quota', {
      p_user_id: user.id,
    });

    if (quotaError || !quotaData || quotaData.remaining < totalQuotaCost) {
      return new Response(
        JSON.stringify({
          success: false,
          error: 'QUOTA_EXHAUSTED',
          message: `配额不足，需要 ${totalQuotaCost} 张（${pages.length} 张图片 × ${quotaCostPerImage} 倍），剩余 ${quotaData?.remaining || 0} 张`,
        }),
        {
          status: 403,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }

    // 创建SSE流
    const encoder = new TextEncoder();
    const stream = new ReadableStream({
      async start(controller) {
        const sendEvent = (event: string, data: any) => {
          const message = `event: ${event}\ndata: ${JSON.stringify(data)}\n\n`;
          controller.enqueue(encoder.encode(message));
        };

        try {
          // 发送开始事件
          sendEvent('start', {
            total: pages.length,
            taskId: taskId || `task_${Date.now()}`,
          });

          // 并发生成图片（支持多张同时生成）
          const MAX_CONCURRENT = 5; // 最大并发数（可根据API限制调整）
          const imageModel = model || 'gemini-3-pro-image-preview';
          
          // 初始化所有图片状态为生成中
          pages.forEach((page, i) => {
            sendEvent('progress', {
              index: page.index,
              current: i + 1,
              total: pages.length,
              status: 'generating',
            });
          });

          // 并发控制：分批执行
          for (let i = 0; i < pages.length; i += MAX_CONCURRENT) {
            const batch = pages.slice(i, i + MAX_CONCURRENT);
            
            // 并发生成当前批次
            const batchPromises = batch.map((page) => 
              generateSingleImage(
                page,
                taskId || `task_${Date.now()}`,
                fullOutline || '',
                userTopic || '',
                userImages || null,
                apiKey,
                baseUrl,
                imageModel
              ).then(async (result) => {
                if (result.success && result.imageUrl) {
                  // 计算并扣减配额（根据模型计算倍数）
                  const imageQuotaCost = calculateQuotaCost(1, imageModel);
                  const { data: deductData } = await supabase.rpc('deduct_user_quota', {
                    p_user_id: user.id,
                    p_amount: imageQuotaCost, // 使用计算后的配额数量
                    p_action_type: 'generate_image',
                    p_metadata: {
                      prompt: page.content.substring(0, 200),
                      model: imageModel,
                      task_id: taskId,
                      page_index: page.index,
                      quota_multiplier: imageQuotaCost, // 记录配额倍数
                    },
                  });

                  // 发送成功事件
                  sendEvent('image', {
                    index: result.index,
                    imageUrl: result.imageUrl,
                    status: 'done',
                    quota_remaining: deductData?.remaining, // 返回剩余配额
                    quota_cost: imageQuotaCost, // 返回本次消耗的配额
                  });
                } else {
                  // 发送失败事件
                  sendEvent('error', {
                    index: result.index,
                    error: result.error || '生成失败',
                    status: 'error',
                  });
                }
                return result;
              }).catch((error) => {
                // 发送失败事件
                sendEvent('error', {
                  index: page.index,
                  error: error instanceof Error ? error.message : '生成异常',
                  status: 'error',
                });
                return {
                  index: page.index,
                  success: false,
                  error: error instanceof Error ? error.message : '生成异常',
                };
              })
            );

            // 等待当前批次完成
            await Promise.allSettled(batchPromises);
          }

          // 发送完成事件
          sendEvent('complete', {
            total: pages.length,
            taskId: taskId || `task_${Date.now()}`,
          });

          controller.close();
        } catch (error) {
          sendEvent('error', {
            error: error instanceof Error ? error.message : '批量生成异常',
          });
          controller.close();
        }
      },
    });

    return new Response(stream, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
        'X-Accel-Buffering': 'no',
      },
    });
  } catch (error) {
    console.error('批量生成错误:', error);
    return new Response(
      JSON.stringify({
        success: false,
        error: error instanceof Error ? error.message : '批量生成失败',
      }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }
}

