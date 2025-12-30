# 用户系统实施指南

> 本文档记录了已完成的工作和需要您手动完成的步骤

## ✅ 已完成的工作

### 1. 数据库表创建 ✅
- `profiles` 表 - 用户扩展信息
- `subscriptions` 表 - 订阅管理
- `usage_logs` 表 - 使用记录
- `transactions` 表 - 交易记录
- `quota_packages` 表 - 配额包
- `deduct_user_quota()` 函数 - 配额扣减
- `handle_new_user()` 触发器 - 新用户自动创建

### 2. Stripe 产品和价格创建 ✅
- **Basic**（基础版）: `prod_TG466SwVD4XO8D`, Price: `price_1SJXykFBO6WidBGBBWNWGZuZ` (¥19.9)
- **Pro**（专业版）: `prod_TG46IxfX1WBjni`, Price: `price_1SJXymFBO6WidBGBI774fwns` (¥49.9)
- **Enterprise**（企业版）: `prod_TG46YEyTFd5lcI`, Price: `price_1SJXyoFBO6WidBGByezx7Lb0` (¥199.9)

### 3. 核心代码文件创建 ✅
- ✅ `src/lib/supabase.ts` - Supabase 客户端
- ✅ `src/hooks/useAuth.ts` - 认证 Hook
- ✅ `src/components/AuthModal.tsx` - 认证模态框
- ✅ `src/components/QuotaIndicator.tsx` - 配额显示
- ✅ `src/components/OnboardingTour.tsx` - 新手引导
- ✅ `src/app/auth/callback/route.ts` - OAuth 回调
- ✅ `src/app/api/quota/check/route.ts` - 配额检查 API
- ✅ `src/app/api/quota/deduct/route.ts` - 配额扣减 API
- ✅ `src/app/api/payment/stripe/create-checkout/route.ts` - Stripe Checkout
- ✅ `src/app/api/payment/stripe/webhook/route.ts` - Stripe Webhook
- ✅ `src/lib/stripe.ts` - Stripe 客户端配置
- ✅ `src/app/pricing/page.tsx` - 套餐选择页面
- ✅ `src/app/dashboard/page.tsx` - 用户仪表板
- ✅ `src/app/api/generate/route.ts` - 已集成配额检查和扣减
- ✅ `src/app/create/page.tsx` - 已添加延迟注册逻辑和AuthModal

---

## 🔧 需要手动完成的步骤

### Step 1: 执行 Supabase SQL 脚本 ⚠️ 重要

1. 打开 Supabase Dashboard: https://supabase.com/dashboard
2. 选择您的项目: `ryycsolimgocffujpunq`
3. 左侧菜单 → SQL Editor
4. 点击 "New query"
5. 复制 `SUPABASE_SETUP.sql` 中的所有内容
6. 粘贴到编辑器
7. 点击 "Run" 执行

**验证**：
```sql
-- 检查函数是否创建成功
SELECT routine_name FROM information_schema.routines 
WHERE routine_schema = 'public' 
AND routine_name IN ('check_user_quota', 'deduct_user_quota', 'handle_new_user');

-- 应该返回 3 行
```

### Step 2: 创建 .env.local 文件

1. 在项目根目录创建 `.env.local` 文件
2. 复制 `.env.local.example` 的内容
3. 确保所有环境变量都已填写

**验证**：
```bash
# 检查文件是否存在
ls -la .env.local

# 查看内容（不要提交到 Git）
cat .env.local
```

### Step 3: 配置 Supabase 认证设置

1. Supabase Dashboard → Authentication → Providers
2. 启用 GitHub Provider:
   - 创建 GitHub OAuth App: https://github.com/settings/developers
   - 回调 URL: `https://ryycsolimgocffujpunq.supabase.co/auth/v1/callback`
   - 填写 Client ID 和 Secret
3. 启用 Google Provider:
   - 创建 Google OAuth 凭据: https://console.cloud.google.com/
   - 回调 URL: `https://ryycsolimgocffujpunq.supabase.co/auth/v1/callback`
   - 填写 Client ID 和 Secret
4. 配置 Email 认证:
   - 开启 "Confirm email"
   - 设置 "Site URL": `http://localhost:3000`（开发）/ `https://your-domain.com`（生产）

### Step 4: 配置 Stripe Webhook

1. 打开 Stripe Dashboard: https://dashboard.stripe.com/test/webhooks
2. 点击 "Add endpoint"
3. 填写 Endpoint URL:
   - 开发环境: `http://localhost:3000/api/payment/stripe/webhook`
   - 生产环境: `https://your-domain.com/api/payment/stripe/webhook`
4. 选择事件:
   - `checkout.session.completed`
   - `payment_intent.succeeded`
   - `payment_intent.payment_failed`
5. 点击 "Add endpoint"
6. 复制 "Signing secret" (whsec_xxx)
7. 添加到 `.env.local`: `STRIPE_WEBHOOK_SECRET=whsec_xxx`

**测试 Webhook（本地开发）**：
```bash
# 安装 Stripe CLI
stripe listen --forward-to localhost:3000/api/payment/stripe/webhook

# 触发测试事件
stripe trigger checkout.session.completed
```

### Step 5: 更新 TopNav 添加配额显示和登录按钮

**文件**: `src/components/TopNav.tsx`

找到导航栏右侧部分，添加：

```typescript
import { useAuth } from '@/hooks/useAuth';
import QuotaIndicator from './QuotaIndicator';
import { User, LogOut } from 'lucide-react';
import Link from 'next/link';

// 在组件内添加
const { user, isLoggedIn, signOut } = useAuth();

// 在导航栏右侧添加（语言切换按钮后）：
{isLoggedIn ? (
  <>
    <QuotaIndicator />
    <Link href="/dashboard" className="flex items-center gap-2 px-3 py-2 hover:bg-dark-100 dark:hover:bg-dark-800 rounded-lg transition-colors">
      <User className="w-5 h-5" />
      <span className="text-sm">{user?.email?.split('@')[0]}</span>
    </Link>
    <button
      onClick={() => signOut()}
      className="btn-outline text-sm"
    >
      <LogOut className="w-4 h-4 mr-2" />
      {language === 'zh' ? '登出' : 'Logout'}
    </button>
  </>
) : (
  <button
    onClick={() => router.push('/pricing')}
    className="btn-primary text-sm"
  >
    {language === 'zh' ? '登录/注册' : 'Sign In'}
  </button>
)}
```

### Step 6: 更新首页添加订阅信息

**文件**: `src/app/page.tsx`

在 Hero 部分添加免费试用提示：

```typescript
// 在标题下方添加
<p className="text-xl text-dark-600 dark:text-dark-400 mb-8">
  🎁 <span className="font-semibold text-primary-600">注册即送 10 张免费图片</span>
</p>

// 在 CTA 按钮处
<Link href="/create" className="btn-primary text-lg px-8 py-4">
  {language === 'zh' ? '免费开始创作' : 'Start Free'}
</Link>
```

### Step 7: 添加 OnboardingTour 到全局布局

**文件**: `src/app/layout.tsx`

在 `<FloatingBall />` 后添加：

```typescript
import OnboardingTour from '@/components/OnboardingTour';

// 在 body 末尾
<OnboardingTour />
```

---

## 🧪 测试步骤

### 1. 本地开发测试

```bash
# 启动开发服务器
npm run dev

# 打开浏览器
http://localhost:3000
```

### 2. 注册流程测试

1. 访问 `/create`
2. 输入提示词
3. 点击"登录后生成"
4. 应该弹出认证模态框
5. 注册一个测试账号
6. 应该自动继续生成图片
7. 检查 Supabase Dashboard → Authentication → Users，应该看到新用户
8. 检查 `profiles` 和 `subscriptions` 表，应该有新记录

### 3. 配额测试

1. 登录后，顶部应该显示"剩余 10/10 张"
2. 生成 1 张图片
3. 配额应该变成"剩余 9/10 张"
4. 继续生成直到用完 10 张
5. 第 11 张应该提示"配额已用完"

### 4. 支付测试

1. 访问 `/pricing`
2. 点击 "Basic" 套餐的"立即订阅"
3. 应该跳转到 Stripe Checkout
4. 使用测试卡号: `4242 4242 4242 4242`
5. 填写任意邮箱和未来日期
6. 完成支付
7. 应该重定向到 `/dashboard`
8. 配额应该变成"剩余 200/200 张"

---

## 📝 剩余工作（优先级排序）

### P0 - 必须完成（核心功能）

- [x] 数据库表和函数
- [x] 认证系统
- [x] 配额管理
- [x] Stripe 支付
- [ ] **手动执行 SUPABASE_SETUP.sql**
- [ ] **创建 .env.local 文件**
- [ ] **更新 TopNav 添加配额显示和登录按钮**
- [ ] **测试完整注册流程**

### P1 - 重要（用户体验）

- [ ] 配额用尽提示模态框
- [ ] 支付成功页面
- [ ] 支付失败处理
- [ ] 错误监控和日志

### P2 - 可选（增强功能）

- [ ] 微信支付集成
- [ ] 支付宝集成
- [ ] 邮箱验证流程
- [ ] 找回密码功能
- [ ] 用户协议和隐私政策
- [ ] 发票下载功能

---

## 🚨 常见问题

### Q1: 注册后没有自动创建订阅？

**检查**：
1. Supabase Dashboard → Database → Functions
2. 确认 `handle_new_user()` 函数存在
3. 确认触发器已创建
4. 手动触发一次：
   ```sql
   SELECT public.handle_new_user();
   ```

### Q2: 配额扣减失败？

**检查**：
1. 确认 `deduct_user_quota()` 函数已创建
2. 确认函数权限正确（GRANT EXECUTE）
3. 查看浏览器控制台和服务器日志

### Q3: Stripe支付后没有创建订阅？

**检查**：
1. Stripe Dashboard → Developers → Webhooks → 查看事件日志
2. 确认 Webhook Secret 配置正确
3. 查看 `/api/payment/stripe/webhook` 的服务器日志

---

## 📞 下一步

1. **立即执行**: `SUPABASE_SETUP.sql`
2. **创建配置**: `.env.local`
3. **手动修改**: TopNav、首页
4. **测试验证**: 注册 → 生成 → 支付流程

**完成后您将拥有**：
- ✅ 完整的用户注册和登录系统
- ✅ 配额管理和计费系统
- ✅ Stripe 订阅支付功能
- ✅ 延迟注册策略（先体验后注册）
- ✅ 精美的用户仪表板
- ✅ 新手引导系统

祝您实施顺利！🚀✨


