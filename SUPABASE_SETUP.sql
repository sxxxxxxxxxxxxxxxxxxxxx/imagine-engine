-- ============================================
-- Imagine Engine - Supabase 数据库完整初始化脚本
-- 请在 Supabase SQL Editor 中执行此脚本
-- ============================================

-- 1. 创建新用户自动初始化函数（关键！）
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  -- 创建用户 profile
  INSERT INTO public.profiles (id, username, avatar_url)
  VALUES (
    NEW.id,
    NEW.raw_user_meta_data->>'username',
    NEW.raw_user_meta_data->>'avatar_url'
  );
  
  -- 创建 Free 订阅（20张配额）
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
    20,
    0,
    NOW(),
    NOW() + INTERVAL '1 month',
    false
  );
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 2. 创建配额检查函数
CREATE OR REPLACE FUNCTION public.check_user_quota(
  p_user_id UUID
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_remaining INT;
  v_total INT;
  v_used INT;
  v_plan_type VARCHAR;
BEGIN
  -- 查询当前有效订阅
  SELECT 
    quota_remaining,
    quota_total,
    quota_used,
    plan_type
  INTO v_remaining, v_total, v_used, v_plan_type
  FROM public.subscriptions
  WHERE user_id = p_user_id
    AND status = 'active'
    AND end_date > NOW()
  ORDER BY end_date DESC
  LIMIT 1;

  IF v_remaining IS NULL THEN
    RETURN jsonb_build_object(
      'available', false,
      'remaining', 0,
      'total', 0,
      'used', 0,
      'plan_type', 'none'
    );
  END IF;

  RETURN jsonb_build_object(
    'available', v_remaining > 0,
    'remaining', v_remaining,
    'total', v_total,
    'used', v_used,
    'plan_type', v_plan_type
  );
END;
$$;

-- 3. 创建配额扣减函数（原子操作）
CREATE OR REPLACE FUNCTION public.deduct_user_quota(
  p_user_id UUID,
  p_amount INT DEFAULT 1,
  p_action_type VARCHAR DEFAULT 'generate_image',
  p_metadata JSONB DEFAULT '{}'::jsonb
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_subscription_id UUID;
  v_remaining INT;
  v_quota_before INT;
BEGIN
  -- 1. 获取当前有效订阅（加锁防止并发）
  SELECT id, quota_remaining INTO v_subscription_id, v_quota_before
  FROM public.subscriptions
  WHERE user_id = p_user_id
    AND status = 'active'
    AND end_date > NOW()
  ORDER BY end_date DESC
  LIMIT 1
  FOR UPDATE;  -- 关键：锁行，防止并发超额

  IF v_subscription_id IS NULL THEN
    RAISE EXCEPTION 'No active subscription found';
  END IF;

  -- 2. 检查配额是否充足
  IF v_quota_before < p_amount THEN
    RAISE EXCEPTION 'Insufficient quota. Remaining: %, Required: %', v_quota_before, p_amount;
  END IF;

  -- 3. 扣减配额
  UPDATE public.subscriptions
  SET quota_used = quota_used + p_amount,
      updated_at = NOW()
  WHERE id = v_subscription_id;

  -- 4. 记录使用日志
  INSERT INTO public.usage_logs (
    user_id,
    subscription_id,
    action_type,
    cost_quota,
    prompt,
    image_url,
    model_used
  ) VALUES (
    p_user_id,
    v_subscription_id,
    p_action_type,
    p_amount,
    p_metadata->>'prompt',
    p_metadata->>'image_url',
    p_metadata->>'model_used'
  );

  -- 5. 计算剩余配额
  SELECT quota_remaining INTO v_remaining
  FROM public.subscriptions
  WHERE id = v_subscription_id;

  -- 返回结果
  RETURN jsonb_build_object(
    'success', true,
    'remaining', v_remaining,
    'deducted', p_amount,
    'subscription_id', v_subscription_id
  );
END;
$$;

-- 4. 授权函数给相关角色
GRANT EXECUTE ON FUNCTION public.check_user_quota(UUID) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.deduct_user_quota(UUID, INT, VARCHAR, JSONB) TO anon, authenticated;

-- 5. 创建触发器（新用户自动初始化）
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- 6. 创建 RLS 策略
DROP POLICY IF EXISTS "Users can insert own profile" ON public.profiles;
CREATE POLICY "Users can insert own profile"
  ON public.profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

DROP POLICY IF EXISTS "System can create subscriptions" ON public.subscriptions;
CREATE POLICY "System can create subscriptions"
  ON public.subscriptions FOR INSERT
  WITH CHECK (true);

DROP POLICY IF EXISTS "System can create usage logs" ON public.usage_logs;
CREATE POLICY "System can create usage logs"
  ON public.usage_logs FOR INSERT
  WITH CHECK (true);

DROP POLICY IF EXISTS "System can create transactions" ON public.transactions;
CREATE POLICY "System can create transactions"
  ON public.transactions FOR INSERT
  WITH CHECK (true);

DROP POLICY IF EXISTS "Users can buy quota packages" ON public.quota_packages;
CREATE POLICY "Users can buy quota packages"
  ON public.quota_packages FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- ============================================
-- ✅ 验证配置（执行后请检查）
-- ============================================

-- 检查函数是否创建成功
SELECT routine_name, routine_type 
FROM information_schema.routines 
WHERE routine_schema = 'public' 
AND routine_name IN ('check_user_quota', 'deduct_user_quota', 'handle_new_user');
-- 应该返回 3 行

-- 检查触发器是否创建成功
SELECT trigger_name, event_object_table, action_statement
FROM information_schema.triggers
WHERE trigger_name = 'on_auth_user_created';
-- 应该返回 1 行

-- ============================================
-- 🎯 新用户配额流程验证
-- ============================================

-- 注册测试用户后，执行以下查询验证：

-- 1. 检查 profile 是否自动创建
-- SELECT * FROM public.profiles WHERE id = '你的用户ID';

-- 2. 检查 Free 订阅是否自动创建（20张配额）
-- SELECT * FROM public.subscriptions WHERE user_id = '你的用户ID';
-- 应该显示：plan_type='free', quota_total=20, quota_used=0, quota_remaining=20

-- 3. 测试生成1张图片后
-- SELECT * FROM public.subscriptions WHERE user_id = '你的用户ID';
-- 应该显示：quota_used=1, quota_remaining=19

-- 4. 测试生成20张后
-- SELECT * FROM public.subscriptions WHERE user_id = '你的用户ID';
-- 应该显示：quota_used=20, quota_remaining=0

-- 5. 尝试生成第21张
-- 应该返回错误: 'Insufficient quota'

-- ============================================
