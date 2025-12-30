import { NextRequest, NextResponse } from 'next/server';
import { APIClient } from '@/lib/apiClient';
import { createClient } from '@supabase/supabase-js';
import { ProviderManager } from '@/lib/apiProviders';

export const runtime = 'nodejs';
export const maxDuration = 60;

// 大纲生成提示词模板
const OUTLINE_PROMPT_TEMPLATE = `你是一个小红书内容创作专家。用户会给你一个要求以及说明，你需要生成一个适合小红书的图文内容大纲。

用户的要求以及说明：
{topic}

要求：
1. 第一页必须是吸引人的封面/标题页，包含标题和副标题
2. 内容控制在 6-12 页（包括封面）（如果用户特别要求页数，以用户的要求为准，页数可以适当放宽到2-18页的范围）
特别的. 如果用户在要求了某种特定语言风格的喜好，或者是否使用emoji等，则以客户的要求为准
3. 每页内容简洁有力，适合配图展示
4. 使用小红书风格的语言（亲切、有趣、实用）
5. 可以适当使用 emoji 增加趣味性
6. 内容要有实用价值，能解决用户问题或提供有用信息
7. 最后一页可以是总结或行动呼吁

输出格式（严格遵守）：
- 用 <page> 标签分割每一页（重要：这是强制分隔符）
- 每页第一行是页面类型标记：[封面]、[内容]、[总结]
- 后面是该页的具体内容描述
- 内容要具体、详细，方便后续生成图片
- 避免在内容中使用 | 竖线符号（会与 markdown 表格冲突）

## 示例输出：

[封面]
标题：5分钟学会手冲咖啡☕
副标题：新手也能做出咖啡店的味道
背景：温馨的咖啡场景，一个家庭布局的咖啡角

<page>
[内容]
第一步：准备器具

必备工具：
• 手冲壶（细嘴壶）
• 滤杯和滤纸
• 咖啡豆 15g
• 热水 250ml（92-96℃）
• 磨豆机
• 电子秤

配图建议：整齐摆放的咖啡器具

<page>

[内容]
第二步：研磨咖啡豆

研磨粗细度：中细研磨（像细砂糖）
重量：15克
新鲜度：建议现磨现冲

小贴士💡：
咖啡豆最好是烘焙后2周内的
研磨后要在15分钟内冲泡完成

配图建议：研磨咖啡豆的特写

<page>

[内容]
第三步：闷蒸

注水量：30ml（2倍咖啡粉重量）
时间：30秒
手法：从中心向外螺旋注水

关键点⚠️：
让所有咖啡粉都湿润
不要注水太快

配图建议：手冲壶注水的过程

<page>

[内容]
第四步：分段萃取

第二次注水：到120ml，用时1分钟
第三次注水：到250ml，用时1分30秒
总时间：2-2.5分钟

配图建议：完整的冲泡过程

<page>

[总结]
完成！享受你的手冲咖啡✨

记住三个关键：
✅ 水温 92-96℃
✅ 粉水比 1:15
✅ 总时间 2-2.5分钟

新手提示：
前几次可能不完美
多练习就会越来越好
享受过程最重要！

配图建议：一杯完成的手冲咖啡，温暖的场景

### 最后
现在，请根据用户的主题生成大纲。记住：
1. 严格使用 <page> 标签分割每一页
2. 每页开头标注类型：[封面]、[内容]、[总结]
3. 内容要详细、具体、专业、有价值。
4. 适合制作成小红书图文 
5. 避免使用竖线符号 | （会与 markdown 表格冲突）

【特别的！！注意】直接给出大纲内容（不要有任何多余的说明，也就是你直接从[封面]开始，不要有针对用户的回应对话），请输出：`;

function parseOutline(outlineText: string) {
  // 按 <page> 分割页面
  const pagesRaw = outlineText.split(/<page>/i);
  const pages: Array<{ index: number; type: string; content: string }> = [];

  pagesRaw.forEach((pageText, index) => {
    pageText = pageText.trim();
    if (!pageText) return;

    let pageType = 'content';
    const typeMatch = pageText.match(/\[(\S+)\]/);
    if (typeMatch) {
      const typeCn = typeMatch[1];
      const typeMapping: Record<string, string> = {
        '封面': 'cover',
        '内容': 'content',
        '总结': 'summary',
      };
      pageType = typeMapping[typeCn] || 'content';
    }

    pages.push({
      index,
      type: pageType,
      content: pageText,
    });
  });

  return pages;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { topic, images, apiKey, baseUrl, model } = body;

    if (!topic || typeof topic !== 'string' || topic.trim() === '') {
      return NextResponse.json(
        { success: false, error: '请提供有效的主题内容' },
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

    // ✅ 检查配额（大纲生成消耗1张配额）
    const { data: quotaData, error: quotaError } = await supabase.rpc('check_user_quota', {
      p_user_id: user.id,
    });

    if (quotaError || !quotaData || quotaData.remaining < 1) {
      return NextResponse.json(
        {
          success: false,
          error: 'QUOTA_EXHAUSTED',
          message: '配额不足，需要 1 张，剩余 ' + (quotaData?.remaining || 0) + ' 张',
        },
        { status: 403 }
      );
    }

    // 构建提示词
    let prompt = OUTLINE_PROMPT_TEMPLATE.replace('{topic}', topic.trim());

    if (images && Array.isArray(images) && images.length > 0) {
      prompt += `\n\n注意：用户提供了 ${images.length} 张参考图片，请在生成大纲时考虑这些图片的内容和风格。这些图片可能是产品图、个人照片或场景图，请根据图片内容来优化大纲，使生成的内容与图片相关联。`;
    }

    // 使用和图片生成相同的API配置（从请求体获取，和图片生成API一样）
    // 如果没有传递，尝试从ProviderManager获取（兼容旧方式）
    let finalApiKey = apiKey;
    let finalBaseUrl = baseUrl || 'https://newapi.aicohere.org/v1/chat/completions';
    let finalModel = model || 'gemini-2.5-pro';

    if (!finalApiKey) {
      // 尝试从ProviderManager获取（服务端会从环境变量读取）
      const pockgoProvider = ProviderManager.getProviderById('pockgo-image');
      if (pockgoProvider) {
        finalApiKey = ProviderManager.getApiKey('pockgo-image');
        if (!finalApiKey && typeof process !== 'undefined') {
          finalApiKey = process.env.POCKGO_API_KEY || '';
        }
      }
    }

    if (!finalApiKey) {
      return NextResponse.json(
        { success: false, error: '请先在设置中配置API密钥（和图片生成使用相同的配置）' },
        { status: 500 }
      );
    }

    // 直接调用chat API（使用gemini-2.5-pro模型）
    const response = await fetch(finalBaseUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${finalApiKey}`,
      },
      body: JSON.stringify({
        model: finalModel, // 使用用户指定的模型
        messages: [
          {
            role: 'user',
            content: prompt,
          },
        ],
        max_tokens: 8000,
        temperature: 1.0,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Chat API错误:', errorText);
      return NextResponse.json(
        { success: false, error: `API调用失败: ${errorText}` },
        { status: 500 }
      );
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content || data.content || '';

    if (!content) {
      return NextResponse.json(
        { success: false, error: 'API未返回有效内容' },
        { status: 500 }
      );
    }

    // 解析大纲
    const pages = parseOutline(content);

    if (pages.length === 0) {
      return NextResponse.json(
        { success: false, error: '生成的大纲格式不正确，未找到页面内容' },
        { status: 500 }
      );
    }

    // ✅ 大纲生成成功，扣减配额（消耗1张）
    const { data: deductData, error: deductError } = await supabase.rpc('deduct_user_quota', {
      p_user_id: user.id,
      p_amount: 1,
      p_action_type: 'generate_outline',
      p_metadata: {
        topic: topic.substring(0, 200),
        model: finalModel,
        page_count: pages.length,
        has_images: images && images.length > 0,
      },
    });

    if (deductError) {
      console.error('❌ 配额扣减失败:', deductError);
      // 即使扣减失败，也返回结果（但记录错误）
    } else {
      console.log(`✅ 配额已扣减: 剩余=${deductData.remaining}`);
    }

    return NextResponse.json({
      success: true,
      outline: content,
      pages,
      has_images: images && images.length > 0,
      quota_remaining: deductData?.remaining || quotaData.remaining - 1, // 返回剩余配额
    });
  } catch (error) {
    console.error('大纲生成错误:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : '大纲生成失败',
      },
      { status: 500 }
    );
  }
}

