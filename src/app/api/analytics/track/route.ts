import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { event, properties, timestamp, url, userAgent } = body;

    if (!event) {
      return NextResponse.json({ error: '缺少事件名称' }, { status: 400 });
    }

    const supabase = createClient(supabaseUrl, supabaseKey);

    // 解析 User Agent
    const deviceType = /mobile/i.test(userAgent) ? 'mobile' : 'desktop';
    const browser = userAgent.match(/(chrome|firefox|safari|edge|opera)/i)?.[0] || 'unknown';
    const os = userAgent.match(/(windows|mac|linux|android|ios)/i)?.[0] || 'unknown';

    // 获取会话ID（从cookie或生成新的）
    const sessionId = req.cookies.get('session_id')?.value || `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    // 插入行为数据
    const { error } = await supabase.from('user_behaviors').insert({
      event_name: event,
      event_category: properties?.category || 'general',
      page_url: url,
      page_title: properties?.pageTitle || '',
      referrer: properties?.referrer || '',
      user_agent: userAgent,
      device_type: deviceType,
      browser: browser,
      os: os,
      session_id: sessionId,
      properties: properties || {},
      created_at: timestamp || new Date().toISOString(),
    });

    if (error) {
      console.error('插入行为数据失败:', error);
      return NextResponse.json({ error: '记录失败' }, { status: 500 });
    }

    const response = NextResponse.json({ success: true });
    
    // 设置会话cookie
    response.cookies.set('session_id', sessionId, {
      maxAge: 60 * 60 * 24 * 30,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
    });

    return response;
  } catch (error) {
    console.error('追踪错误:', error);
    return NextResponse.json({ error: '服务器错误' }, { status: 500 });
  }
}
