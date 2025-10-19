# 🚀 Imagine Engine - Vercel部署完整指南

> 目标: 将项目部署到Vercel，实现用户注册登录和配额管理

---

## ✅ 部署前准备（已完成）

- ✅ 用户系统代码（40+文件）
- ✅ Supabase数据库配置
- ✅ Stripe支付集成
- ✅ 环境变量模板
- ✅ 邮箱验证触发器

---

## 📋 **部署步骤（按顺序执行）**

### 🔴 Step 1: 配置Supabase邮箱验证（5分钟）

#### 1.1 启用邮箱验证

打开: https://supabase.com/dashboard/project/ryycsolimgocffujpunq/auth/providers

**操作**:
1. 找到 "Email" provider
2. 开启 "Confirm email" ✅
3. 开启 "Secure email change" ✅
4. 点击 "Save"

#### 1.2 配置邮件模板（可选但推荐）

1. 点击 "Email Templates" 标签
2. 选择 "Confirm signup"
3. 自定义邮件内容（参考计划中的HTML模板）
4. 点击 "Save"

#### 1.3 配置Site URL

**Authentication → URL Configuration**:
- Site URL: `http://localhost:3000`（本地测试）
- Redirect URLs: `http://localhost:3000/**`

**部署后需要更新为生产URL**

---

### 🔴 Step 2: 执行邮箱验证触发器SQL（2分钟）

打开: https://supabase.com/dashboard/project/ryycsolimgocffujpunq/sql/new

**操作**:
1. 打开文件 `📧_邮箱验证配置.sql`
2. 复制全部内容
3. 粘贴到SQL Editor
4. 点击 "Run" ▶️
5. ✅ 看到 "Success"

**验证**:
```sql
SELECT trigger_name FROM information_schema.triggers 
WHERE trigger_name = 'on_email_verified';
```

应该返回 1 行

---

### 🔴 Step 3: 本地完整测试（10分钟）

#### 3.1 清除旧数据

**Supabase SQL**:
```sql
DELETE FROM public.usage_logs;
DELETE FROM public.subscriptions;
DELETE FROM public.profiles;
DELETE FROM auth.users;
```

**浏览器**:
```javascript
localStorage.clear();
sessionStorage.clear();
location.reload();
```

#### 3.2 测试注册流程

1. 访问 http://localhost:3000
2. 点击"登录/注册"
3. 注册新账号: test@example.com
4. **应该看到**: "注册成功！验证邮件已发送"
5. **检查Supabase**: Authentication → Users，应该有新用户但 `email_verified=false`

#### 3.3 测试邮箱验证

**Supabase Dashboard → Authentication → Users**:
1. 找到刚注册的用户
2. 点击右侧 "..." 菜单
3. 点击 "Send magic link" 或 "Send confirmation email"
4. 或直接点击 "Confirm email"（手动验证）

**验证后检查**:
```sql
SELECT * FROM public.subscriptions 
WHERE user_id = (SELECT id FROM auth.users WHERE email = 'test@example.com');
```

应该看到Free订阅，quota_total=10

#### 3.4 测试功能

- [ ] 登录状态保持
- [ ] 配额显示 0/10
- [ ] 生成图片成功
- [ ] 配额变成 1/10
- [ ] 生成10张后无法继续

---

### 🔴 Step 4: 推送到GitHub（3分钟）

#### 4.1 检查文件状态

```bash
cd imagine-engine
git status
```

#### 4.2 添加所有文件

```bash
git add .
```

#### 4.3 提交代码

```bash
git commit -m "feat: 完整用户系统和商业化功能 v4.2.0

新增功能:
- 用户注册登录（Supabase认证+邮箱验证）
- 配额管理系统（10张免费，生成+编辑共用）
- Stripe订阅支付（Free/Basic/Pro/Enterprise）
- 延迟注册策略（先体验后注册）
- 用户仪表板（配额可视化+使用记录）
- 首页动态图片展示（交互式轮播）
- Session持久化（刷新保持登录）

优化:
- 深色模式无闪烁
- 图片轮播Ken Burns效果
- 完整中英文支持
- 性能优化（懒加载+console移除）

Bug修复:
- 35+个bug修复
- 认证token传递问题
- 配额显示和扣减问题
- 图片变形问题"
```

#### 4.4 推送到GitHub

```bash
git push origin main
```

**Vercel会自动检测并开始构建**

---

### 🔴 Step 5: Vercel环境变量配置（5分钟）

#### 5.1 访问Vercel Dashboard

打开: https://vercel.com/dashboard

找到您的项目 → Settings → Environment Variables

#### 5.2 添加所有环境变量

**必需变量**:

| 变量名 | 值 | 环境 |
|--------|------|------|
| NEXT_PUBLIC_SUPABASE_URL | https://ryycsolimgocffujpunq.supabase.co | Production, Preview, Development |
| NEXT_PUBLIC_SUPABASE_ANON_KEY | eyJhbGci... | Production, Preview, Development |
| SUPABASE_SERVICE_ROLE_KEY | WSo7eoXcti77o0vV | Production |
| NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY | pk_test_... | Production, Preview, Development |
| STRIPE_SECRET_KEY | sk_test_... | Production |
| NEXT_PUBLIC_SITE_URL | https://your-app.vercel.app | Production |

**添加方法**:
1. 点击 "Add New"
2. 输入变量名
3. 输入值
4. 选择环境（Production/Preview/Development）
5. 点击 "Save"
6. 重复以上步骤添加所有变量

#### 5.3 触发重新部署

添加完环境变量后:
1. Deployments 标签
2. 最新的部署右侧点击 "..."
3. 点击 "Redeploy"
4. 等待构建完成

---

### 🔴 Step 6: 更新Supabase生产URL（2分钟）

#### 6.1 获取Vercel部署URL

**Vercel Dashboard → Deployments**:
- 复制生产URL: `https://your-app.vercel.app`

#### 6.2 更新Supabase配置

**Supabase Dashboard → Authentication → URL Configuration**:
- Site URL: `https://your-app.vercel.app`
- Redirect URLs: 添加:
  - `https://your-app.vercel.app`
  - `https://your-app.vercel.app/**`
  - `https://your-app.vercel.app/auth/callback`

---

### 🔴 Step 7: 配置Stripe生产Webhook（3分钟）

#### 7.1 添加Webhook Endpoint

打开: https://dashboard.stripe.com/test/webhooks

**操作**:
1. 点击 "Add endpoint"
2. Endpoint URL: `https://your-app.vercel.app/api/payment/stripe/webhook`
3. 选择事件:
   - `checkout.session.completed`
   - `payment_intent.succeeded`
   - `payment_intent.payment_failed`
4. 点击 "Add endpoint"

#### 7.2 获取Signing Secret

1. 点击刚创建的webhook
2. 复制 "Signing secret" (whsec_xxx)
3. 添加到Vercel环境变量: `STRIPE_WEBHOOK_SECRET`
4. Redeploy

---

### ✅ Step 8: 部署后验证（5分钟）

#### 8.1 访问生产网站

打开: `https://your-app.vercel.app`

**检查**:
- [ ] 页面正常加载
- [ ] 深色模式无闪烁
- [ ] 首页图片轮播正常
- [ ] 0.5秒后弹出WelcomeModal

#### 8.2 测试注册流程

1. 点击"登录/注册"
2. 注册新账号
3. **应该收到验证邮件**
4. 点击邮件中的验证链接
5. **应该跳转回网站并显示"验证成功"**
6. **配额应该显示 0/10**

#### 8.3 测试生成功能

1. 访问 /create
2. 输入提示词
3. 点击"开始创作"
4. ✅ **应该成功生成**
5. ✅ **配额变成 1/10**

---

## 🎊 **部署成功检查清单**

### ✅ 功能验证
- [ ] 首页加载正常
- [ ] WelcomeModal显示正常
- [ ] 注册成功
- [ ] 收到验证邮件
- [ ] 验证后获得配额
- [ ] 生成图片成功
- [ ] 配额正确扣减
- [ ] 支付页面正常

### ✅ 性能验证
- [ ] 首屏加载 < 3秒
- [ ] Lighthouse分数 > 90
- [ ] 无控制台错误

---

## ⚠️ **常见问题**

### Q1: Vercel构建失败

**检查**:
- Node.js版本（应该是18.x或20.x）
- 环境变量是否全部配置
- package.json中的依赖版本

### Q2: 注册后收不到邮件

**检查**:
- Supabase邮箱验证是否启用
- SMTP配置是否正确
- 邮箱是否在垃圾箱

### Q3: 验证后没有配额

**检查**:
- 触发器是否创建成功
- 执行验证SQL查看订阅记录

---

## 🎉 **恭喜！部署完成！**

您的 Imagine Engine 现在已经：
- ✅ 部署到Vercel（全球CDN）
- ✅ 用户可以注册和验证
- ✅ 配额管理系统运行
- ✅ 支付功能可用

**下一步**: 监控用户数据，优化转化率！

---

*部署指南版本: v1.0*  
*最后更新: 2025-10-18*

