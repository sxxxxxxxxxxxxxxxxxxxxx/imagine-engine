-- ============================================
-- 📧 邮箱验证后创建订阅（推荐方案）
-- 在 Supabase SQL Editor 中执行
-- ============================================

-- 1. 创建邮箱验证后的处理函数
CREATE OR REPLACE FUNCTION public.handle_email_verified()
RETURNS TRIGGER AS $$
BEGIN
  -- 检查是否已有订阅
  IF NOT EXISTS (
    SELECT 1 FROM public.subscriptions WHERE user_id = NEW.id
  ) THEN
    -- 创建profile（如果不存在）
    INSERT INTO public.profiles (id, username, avatar_url)
    VALUES (
      NEW.id,
      NEW.raw_user_meta_data->>'username',
      NEW.raw_user_meta_data->>'avatar_url'
    )
    ON CONFLICT (id) DO NOTHING;
    
    -- 创建 Free 订阅（10张配额）
    INSERT INTO public.subscriptions (
      user_id,
      plan_type,
      status,
      quota_total,
      quota_used,
      start_date,
      end_date,
      auto_renew
    ) VALUES (
      NEW.id,
      'free',
      'active',
      10,
      0,
      NOW(),
      NOW() + INTERVAL '1 month',
      false
    );
    
    RAISE NOTICE '✅ 邮箱验证成功，已为用户 % 创建Free订阅（10张配额）', NEW.email;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 2. 删除旧的注册触发器（如果存在）
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- 3. 创建新的邮箱验证触发器
DROP TRIGGER IF EXISTS on_email_verified ON auth.users;

CREATE TRIGGER on_email_verified
  AFTER UPDATE OF email_confirmed_at ON auth.users
  FOR EACH ROW
  WHEN (NEW.email_confirmed_at IS NOT NULL AND OLD.email_confirmed_at IS NULL)
  EXECUTE FUNCTION public.handle_email_verified();

-- ============================================
-- ✅ 配置说明
-- ============================================

/*
** 邮箱验证流程 **:

1. 用户注册 → Supabase创建账号（email_verified=false）
2. Supabase发送验证邮件
3. 用户点击邮件链接
4. Supabase标记 email_confirmed_at = NOW()
5. 触发器自动执行 → 创建profile + Free订阅（10张）
6. 用户可以开始使用

** 重要提示 **:

- 必须在 Supabase Dashboard → Authentication → Email 
  启用 "Confirm email"
  
- 配置邮件模板（可选但推荐）

- 已注册但未验证的用户，验证后会自动获得配额
*/

-- ============================================
-- 🧪 测试验证
-- ============================================

-- 查看触发器是否创建成功
SELECT trigger_name, event_object_table, action_statement
FROM information_schema.triggers
WHERE trigger_name = 'on_email_verified';

-- 查看所有用户的验证状态
SELECT 
  id,
  email,
  email_confirmed_at,
  created_at
FROM auth.users
ORDER BY created_at DESC;

-- 查看哪些用户已有订阅
SELECT 
  u.email,
  u.email_confirmed_at,
  s.plan_type,
  s.quota_total,
  s.quota_remaining
FROM auth.users u
LEFT JOIN public.subscriptions s ON s.user_id = u.id
ORDER BY u.created_at DESC;

-- ============================================

