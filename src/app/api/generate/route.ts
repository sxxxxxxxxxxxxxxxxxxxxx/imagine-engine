import { NextRequest, NextResponse } from 'next/server';
import { generateImage } from '@/lib/bananaApi';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { prompt, style, aspectRatio, referenceImage, baseImage, apiKey, baseUrl, model } = body;

    // 验证必需参数
    if (!prompt || typeof prompt !== 'string' || prompt.trim() === '') {
      return NextResponse.json(
        { error: '请提供有效的提示词' },
        { status: 400 }
      );
    }

    console.log('收到文生图请求:', { 
      prompt: prompt.substring(0, 100) + '...', 
      style, 
      aspectRatio,
      hasReferenceImage: !!referenceImage,
      hasBaseImage: !!baseImage
    });

    // 调用AI API生成图片，传递配置
    const result = await generateImage({
      prompt: prompt.trim(),
      style: style || 'realistic'
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

    return NextResponse.json({
      imageUrl: result.imageUrl,
      needsResize: result.needsResize || false,
      backendResized: result.backendResized || false,
      originalDimensions: result.originalDimensions,
      aspectRatio: aspectRatio
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