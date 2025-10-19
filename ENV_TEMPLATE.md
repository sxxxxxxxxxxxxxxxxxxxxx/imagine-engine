# 环境变量配置模板

## 本地开发（.env.local）

创建文件 `.env.local`，内容如下：

```env
# Supabase 配置
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# Stripe 配置
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_xxx
STRIPE_SECRET_KEY=sk_test_xxx
STRIPE_WEBHOOK_SECRET=whsec_xxx

# 应用配置
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

## Vercel生产环境

在 Vercel Dashboard → Settings → Environment Variables 添加：

| 变量名 | 说明 | 环境 |
|--------|------|------|
| NEXT_PUBLIC_SUPABASE_URL | Supabase项目URL | All |
| NEXT_PUBLIC_SUPABASE_ANON_KEY | Supabase公开密钥 | All |
| SUPABASE_SERVICE_ROLE_KEY | Supabase管理员密钥 | Production |
| NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY | Stripe公钥 | All |
| STRIPE_SECRET_KEY | Stripe私钥 | Production |
| STRIPE_WEBHOOK_SECRET | Stripe Webhook签名 | Production |
| NEXT_PUBLIC_SITE_URL | 生产域名 | Production |

