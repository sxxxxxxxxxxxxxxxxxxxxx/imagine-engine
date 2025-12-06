/**
 * 更新用户资料API
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function POST(request: NextRequest) {
  try {
    const { displayName, bio, avatarUrl } = await request.json();

    const authHeader = request.headers.get('authorization');
    const token = authHeader?.replace('Bearer ', '');

    if (!token) {
      return NextResponse.json({ error: '请先登录' }, { status: 401 });
    }

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      { global: { headers: { Authorization: `Bearer ${token}` } } }
    );

    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: '认证失败' }, { status: 401 });
    }

    const updateData: any = {};
    if (displayName !== undefined) updateData.display_name = displayName;
    if (bio !== undefined) updateData.bio = bio;
    if (avatarUrl !== undefined) updateData.avatar_url = avatarUrl;

    const { data, error } = await supabase
      .from('profiles')
      .update(updateData)
      .eq('id', user.id)
      .select()
      .single();

    if (error) {
      console.error('更新资料失败:', error);
      return NextResponse.json({ error: '更新失败' }, { status: 400 });
    }

    return NextResponse.json({ success: true, profile: data });
  } catch (error: any) {
    console.error('更新资料API错误:', error);
    return NextResponse.json({ error: '服务器错误' }, { status: 500 });
  }
}
