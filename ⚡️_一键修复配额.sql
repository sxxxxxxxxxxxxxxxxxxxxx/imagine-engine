-- ============================================
-- ⚡ 一键修复配额显示为0的问题
-- 直接复制全部内容到 Supabase SQL Editor 执行
-- ============================================

-- 为所有现有用户添加 Free 订阅（10张免费配额）
INSERT INTO public.subscriptions (
  user_id,
  plan_type,
  status,
  quota_total,
  quota_used,
  start_date,
  end_date,
  auto_renew
)
SELECT 
  id,
  'free',
  'active',
  10,
  0,
  NOW(),
  NOW() + INTERVAL '1 month',
  false
FROM auth.users
WHERE id NOT IN (SELECT user_id FROM public.subscriptions);

-- 执行成功后，刷新页面（F5）
-- 应该立即看到：⚡ 10/10



