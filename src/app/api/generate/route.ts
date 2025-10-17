import { NextRequest, NextResponse } from 'next/server';
import { generateImage } from '@/lib/bananaApi';

// 增加请求体大小限制（支持多图上传）
export const config = {
  api: {
    bodyParser: {
      sizeLimit: '10mb',  // 增加到10MB，支持多张高清图片
    },
  },
};

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