/**
 * 微信支付 API（占位符）
 * 后续集成微信支付 SDK
 */

import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  // TODO: 集成微信支付 SDK
  // 参考: https://github.com/binarywang/WxJava
  // 或: https://github.com/JeffreySu/WeiXinMPSDK
  
  return NextResponse.json({
    error: '微信支付功能开发中，请使用 Stripe 支付',
    message: 'WeChat Pay coming soon, please use Stripe for now'
  }, { status: 501 });
}

