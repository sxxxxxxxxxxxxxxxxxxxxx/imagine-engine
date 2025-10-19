/**
 * OAuth 认证回调路由
 * 处理 GitHub、Google 等第三方登录后的回调
 */

import { NextRequest, NextResponse } from 'next/server';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get('code');

  if (code) {
    const supabase = createRouteHandlerClient({ cookies });
    
    try {
      await supabase.auth.exchangeCodeForSession(code);
      console.log('✅ OAuth 认证成功');
    } catch (error) {
      console.error('❌ OAuth 认证失败:', error);
      return NextResponse.redirect(`${requestUrl.origin}/auth/error`);
    }
  }

  // 重定向到首页或用户之前的页面
  return NextResponse.redirect(requestUrl.origin);
}

