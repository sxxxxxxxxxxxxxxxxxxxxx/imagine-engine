/**
 * 支付宝支付 API（占位符）
 * 后续集成支付宝 SDK
 */

import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  // TODO: 集成支付宝 SDK
  // 参考: https://github.com/go-pay/gopay
  // 或: https://github.com/egzosn/pay-java-parent
  
  return NextResponse.json({
    error: '支付宝支付功能开发中，请使用 Stripe 支付',
    message: 'Alipay coming soon, please use Stripe for now'
  }, { status: 501 });
}

