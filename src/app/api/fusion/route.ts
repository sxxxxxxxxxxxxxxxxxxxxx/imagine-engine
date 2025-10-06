import { NextRequest, NextResponse } from 'next/server';


export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { images, prompt, imageCount, apiKey, baseUrl, model } = body;

    if (!images || !Array.isArray(images) || images.length < 2) {
      return NextResponse.json(
        { error: '至少需要提供2张参考图片' },
        { status: 400 }
      );
    }

    if (!prompt || typeof prompt !== 'string' || prompt.trim() === '') {
      return NextResponse.json(
        { error: '请提供融合描述' },
        { status: 400 }
      );
    }

    // 使用传入的配置或默认值
    const finalApiKey = apiKey || '';
    const finalBaseUrl = baseUrl || 'https://newapi.aicohere.org/v1/chat/completions';
    const finalModel = model || 'gemini-2.5-flash-image-preview';

    if (!finalApiKey) {
      return NextResponse.json(
        { error: '请先在设置中配置API密钥' },
        { status: 500 }
      );
    }

    console.log('收到多图融合请求:', { imageCount, model: finalModel });

    // 构建多图融合提示词
    const fusionPrompt = `Based on these ${imageCount} reference images, create a brand new artistic composition that fuses their characteristics.

User's fusion request: ${prompt}

【融合创作规则】
1. 分析所有参考图片的核心特征（风格、色彩、构图、主题）
2. 不是简单混合，而是提取精华创造全新作品
3. 融合参考图的艺术风格、色调、氛围
4. 创造和谐统一的视觉效果
5. 保持高质量和艺术性
6. 生成一张独特的新作品

Create a completely new image that creatively fuses elements from all reference images.
High quality, detailed, artistic.`;

    // 构建消息内容（包含所有参考图）
    const messageContent = [
      {
        type: 'text',
        text: fusionPrompt
      },
      ...images.map((img: string) => ({
        type: 'image_url',
        image_url: {
          url: `data:image/png;base64,${img}`
        }
      }))
    ];

    const response = await fetch(finalBaseUrl, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${finalApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: finalModel,
        messages: [
          {
            role: 'user',
            content: messageContent,
          }
        ],
        max_tokens: 150,
        temperature: 0.8, // 提高创造性
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error?.message || `API请求失败: ${response.status}`);
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content || '';

    console.log('融合API响应:', content.substring(0, 200));

    // 提取图片URL
    const urlPatterns = [
      /!\[.*?\]\((https?:\/\/[^)]+)\)/gi,
      /https?:\/\/[^\s\)]+\.(jpg|jpeg|png|gif|webp)/gi,
      /https?:\/\/[^\s\)"']+/gi,
    ];

    for (const pattern of urlPatterns) {
      const matches = [...content.matchAll(pattern)];
      if (matches && matches.length > 0) {
        let imageUrl = matches[0][1] || matches[0][0];
        imageUrl = imageUrl.replace(/["'\)]/g, '');
        
        console.log('提取到融合图片URL:', imageUrl);
        return NextResponse.json({ imageUrl });
      }
    }

    throw new Error('API未返回有效的图片URL');
  } catch (error) {
    console.error('Fusion API Error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : '融合失败，请重试' },
      { status: 500 }
    );
  }
}

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