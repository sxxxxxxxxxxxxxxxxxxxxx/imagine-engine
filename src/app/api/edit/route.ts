import { NextRequest, NextResponse } from 'next/server';
import { editImage } from '@/lib/bananaApi';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { tool, image, mask, instruction, bgColor, originalDimensions, apiKey, baseUrl, model } = body;

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

    // 返回完整的响应数据
    return NextResponse.json({
      imageUrl: result.imageUrl,
      needsResize: result.needsResize,
      backendResized: result.backendResized,
      originalDimensions: result.originalDimensions,
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