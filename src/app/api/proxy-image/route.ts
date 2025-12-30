import { NextRequest, NextResponse } from 'next/server';

/**
 * 图片代理下载路由
 * 解决跨域CORS问题，作为主要下载方案
 * 
 * 工作原理：
 * 1. 服务端不受CORS限制
 * 2. 获取图片数据
 * 3. 以下载响应返回给客户端
 */
export async function GET(request: NextRequest) {
  try {
    const url = request.nextUrl.searchParams.get('url');
    
    if (!url) {
      console.error('❌ 缺少url参数');
      return NextResponse.json(
        { error: 'Missing url parameter' }, 
        { status: 400 }
      );
    }

    // 验证URL格式
    let parsedUrl: URL;
    try {
      parsedUrl = new URL(url);
    } catch (error) {
      console.error('❌ URL格式无效:', url);
      return NextResponse.json(
        { error: 'Invalid URL format' }, 
        { status: 400 }
      );
    }

    // 安全检查：只允许https协议（生产环境）
    if (process.env.NODE_ENV === 'production' && parsedUrl.protocol !== 'https:') {
      console.error('❌ 非HTTPS协议:', parsedUrl.protocol);
      return NextResponse.json(
        { error: 'Only HTTPS URLs are allowed in production' }, 
        { status: 403 }
      );
    }

    console.log(`📥 代理下载图片: ${url.substring(0, 100)}...`);

    // 从目标URL获取图片，添加超时控制
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 30000); // 30秒超时

    try {
      const response = await fetch(url, {
        signal: controller.signal,
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
          'Accept': 'image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8',
          'Accept-Encoding': 'gzip, deflate, br',
          'Referer': parsedUrl.origin
        },
        // 不跟随重定向太多次
        redirect: 'follow'
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        console.error(`❌ 获取图片失败: ${response.status} ${response.statusText}`);
        return NextResponse.json(
          { error: `Failed to fetch image: ${response.status} ${response.statusText}` }, 
          { status: response.status }
        );
      }

      // 检查内容类型
      const contentType = response.headers.get('content-type') || '';
      if (!contentType.startsWith('image/')) {
        console.error('❌ 响应不是图片类型:', contentType);
        return NextResponse.json(
          { error: 'Response is not an image' }, 
          { status: 400 }
        );
      }

      // 获取图片数据
      const arrayBuffer = await response.arrayBuffer();
      
      console.log(`✅ 代理下载成功: ${arrayBuffer.byteLength} bytes, ${contentType}`);

      // 返回图片数据，设置正确的下载头
      return new NextResponse(arrayBuffer, {
        status: 200,
        headers: {
          'Content-Type': contentType,
          'Content-Disposition': `attachment; filename="imagine-${Date.now()}.${contentType.split('/')[1] || 'png'}"`,
          'Access-Control-Allow-Origin': '*',
          'Cache-Control': 'public, max-age=3600',
          'Content-Length': String(arrayBuffer.byteLength),
        }
      });

    } catch (fetchError) {
      clearTimeout(timeoutId);
      
      if (fetchError instanceof Error && fetchError.name === 'AbortError') {
        console.error('❌ 请求超时');
        return NextResponse.json(
          { error: 'Request timeout (30s)' }, 
          { status: 504 }
        );
      }
      
      throw fetchError; // 抛给外层catch处理
    }

  } catch (error) {
    console.error('❌ 代理下载错误:', error);
    return NextResponse.json(
      { 
        error: 'Failed to proxy image', 
        details: error instanceof Error ? error.message : 'Unknown error' 
      }, 
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
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}

