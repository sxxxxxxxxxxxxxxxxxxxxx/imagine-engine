# 🔧 立即执行这个SQL（30秒修复配额问题）

## 🚨 **问题**: 配额显示为0，无法生成图片

## ✅ **解决方案**: 执行1个SQL命令

---

## 🔴 **立即执行（30秒）**

### Step 1: 打开 Supabase SQL Editor

**链接**: https://supabase.com/dashboard/project/ryycsolimgocffujpunq/sql/new

### Step 2: 复制并执行以下SQL

```sql
INSERT INTO public.subscriptions (
  user_id, plan_type, status, quota_total, quota_used, start_date, end_date, auto_renew
)
SELECT 
  id, 'free', 'active', 10, 0, NOW(), NOW() + INTERVAL '1 month', false
FROM auth.users
WHERE id NOT IN (SELECT user_id FROM public.subscriptions);
```

### Step 3: 点击 Run ▶️

应该看到: **Success. Rows returned: 1** (或更多)

---

## 🎉 **执行后立即刷新页面**

按 `F5` 刷新

**您会立即看到**:
- ✅ 顶部: **⚡ 10/10**
- ✅ Dashboard: **总配额 10 张，剩余 10 张**
- ✅ AI Studio: **可以正常生成图片**

---

## 🧪 **测试配额扣减**

1. 访问 /create
2. 输入提示词: "一只猫"
3. 点击"开始创作"
4. ✅ 生成成功，配额变成 9/10
5. 继续生成，配额持续减少
6. 第11张: 显示"配额已用完"

---

## 📊 **验证数据库**

在 Supabase SQL Editor 查询：

```sql
SELECT 
  u.email,
  s.plan_type,
  s.quota_total,
  s.quota_used,
  s.quota_remaining
FROM auth.users u
JOIN public.subscriptions s ON s.user_id = u.id
ORDER BY u.created_at DESC
LIMIT 5;
```

**应该看到您的账号**:
- plan_type: free
- quota_total: 10
- quota_used: 0
- quota_remaining: 10

---

## 🎊 **就这么简单！**

**执行1个SQL命令，30秒解决问题！** 🚀

**现在立即执行！** ✨

