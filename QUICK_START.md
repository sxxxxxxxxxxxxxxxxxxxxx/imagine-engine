# 🚀 用户系统快速启动指南

> 只需 3 步，立即启动完整的用户系统！

---

## Step 1: 执行 Supabase SQL 脚本（2分钟）

1. 打开 https://supabase.com/dashboard/project/ryycsolimgocffujpunq/sql/new
2. 复制 `SUPABASE_SETUP.sql` 的所有内容
3. 粘贴到编辑器
4. 点击 "Run" ▶️
5. ✅ 看到 "Success" 提示

---

## Step 2: 创建环境变量文件（1分钟）

在项目根目录创建 `.env.local` 文件，内容如下:

```env
NEXT_PUBLIC_SUPABASE_URL=https://ryycsolimgocffujpunq.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJ5eWNzb2xpbWdvY2ZmdWpwdW5xIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjA3NzkzMjgsImV4cCI6MjA3NjM1NTMyOH0.pj55LwIA4kasv4SlG66W6QFqVVUdlEWIFyOlOW2mKbA
SUPABASE_SERVICE_ROLE_KEY=WSo7eoXcti77o0vV
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_51SIpNCFBO6WidBGBE5G4cjKdAmxz8lXn9MEY3Hhopd9IzIUYau4IN0XiRI2aOEumbVcr9K4fYzThHdk26CtrPAnt00piGgUpK5
STRIPE_SECRET_KEY=sk_test_51SIpNCFBO6WidBGBiNlc3PdAuXPgVlHFSWth64BRwEpcXkJy9zc66p7r2ENpnxR9MzehyHCVWBDUpcIUV6K02tg400LOyFDFlY
STRIPE_WEBHOOK_SECRET=whsec_xxx
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

---

## Step 3: 启动测试（1分钟）

```bash
npm run dev
```

打开浏览器: http://localhost:3000

---

## ✅ 验证功能

### 测试注册和配额

1. 访问 http://localhost:3000/create
2. 输入提示词: "一只可爱的猫"
3. 点击"登录后生成"
4. 注册账号: test@example.com / password123
5. ✅ 应该自动生成图片
6. ✅ 顶部显示"剩余 9/10 张"

### 测试支付

1. 访问 http://localhost:3000/pricing
2. 点击 Pro 套餐的"立即订阅"
3. 使用测试卡: `4242 4242 4242 4242`
4. ✅ 支付成功后配额变成 600/600

---

## 🎉 完成！

您的用户系统已经可以使用了！

**下一步**:
- 📝 查看 `USER_SYSTEM_COMPLETED.md` 了解详细功能
- 🧪 进行完整测试
- 🚀 准备上线部署

需要帮助？查看 `USER_SYSTEM_GUIDE.md`

