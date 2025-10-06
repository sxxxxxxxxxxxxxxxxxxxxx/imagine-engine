import { NextRequest, NextResponse } from 'next/server';

const API_BASE_URL = process.env.NANO_BANANA_BASE_URL || 'https://newapi.aicohere.org/v1/chat/completions';
const IMAGE_API_BASE_URL = process.env.IMAGE_API_BASE_URL || 'https://newapi.pockgo.com/v1/chat/completions';
const API_KEY = process.env.NANO_BANANA_API_KEY;
const TEXT_MODEL = 'claude-3-7-sonnet-20250219';
const IMAGE_MODEL = 'gemini-2.5-flash-image-preview';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { message, imageUrl, conversationHistory } = body;

    if (!message && !imageUrl) {
      return NextResponse.json(
        { error: '请提供消息内容或图片' },
        { status: 400 }
      );
    }

    if (!API_KEY) {
      return NextResponse.json(
        { error: 'API密钥未配置' },
        { status: 500 }
      );
    }

    console.log('收到聊天请求:', { message: message?.substring(0, 50), hasImage: !!imageUrl });

    // 判断是否需要生成图片
    const needsImageGeneration = 
      message?.includes('生成') || 
      message?.includes('创作') || 
      message?.includes('画') ||
      message?.includes('图片');

    if (needsImageGeneration && !imageUrl) {
      // 生成图片
      const prompt = `Based on this user request, generate an image: ${message}

Create a high-quality, detailed image that matches the user's description.`;

      const response = await fetch(IMAGE_API_BASE_URL, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: IMAGE_MODEL,
          messages: [
            {
              role: 'user',
              content: [{ type: 'text', text: prompt }]
            }
          ],
          max_tokens: 150,
          temperature: 0.7,
        }),
      });

      const data = await response.json();
      const content = data.choices?.[0]?.message?.content || '';

      // 提取图片URL
      const urlPatterns = [
        /!\[.*?\]\((https?:\/\/[^)]+)\)/gi,
        /https?:\/\/[^\s\)]+\.(jpg|jpeg|png|gif|webp)/gi,
        /https?:\/\/[^\s\)"']+/gi,
      ];

      let generatedImageUrl = null;
      for (const pattern of urlPatterns) {
        const matches = [...content.matchAll(pattern)];
        if (matches && matches.length > 0) {
          generatedImageUrl = (matches[0][1] || matches[0][0]).replace(/["'\)]/g, '');
          break;
        }
      }

      return NextResponse.json({
        message: '我为你创作了这张图片！你可以继续告诉我需要修改的地方。',
        imageUrl: generatedImageUrl,
        type: 'image_generation'
      });
    } else {
      // 文本对话
      const messages = [
        ...(conversationHistory || []),
        {
          role: 'user',
          content: message
        }
      ];

      const response = await fetch(API_BASE_URL, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: TEXT_MODEL,
          messages,
          max_tokens: 500,
          temperature: 0.8,
        }),
      });

      const data = await response.json();
      const aiMessage = data.choices?.[0]?.message?.content || '抱歉，我没有理解你的意思，请再说一次。';

      return NextResponse.json({
        message: aiMessage,
        type: 'text'
      });
    }
  } catch (error) {
    console.error('Chat API Error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : '处理失败' },
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
