-- ============================================
-- 更新免费用户配额为20张
-- 执行此脚本以更新所有现有免费用户的配额
-- ============================================

-- 1. 更新所有现有免费用户的配额为20张
-- 如果用户已使用的配额少于20张，则更新总配额为20张，并重新计算剩余配额
UPDATE public.subscriptions
SET 
  quota_total = 20,
  quota_remaining = GREATEST(20 - quota_used, 0),  -- 确保不为负数
  updated_at = NOW()
WHERE plan_type = 'free'
  AND status = 'active';

-- 2. 验证更新结果
SELECT 
  plan_type,
  COUNT(*) as user_count,
  MIN(quota_total) as min_quota,
  MAX(quota_total) as max_quota,
  AVG(quota_total) as avg_quota,
  SUM(quota_remaining) as total_remaining
FROM public.subscriptions
WHERE plan_type = 'free'
  AND status = 'active'
GROUP BY plan_type;

-- 3. 显示更新后的用户配额详情（可选，用于验证）
-- SELECT 
--   user_id,
--   plan_type,
--   quota_total,
--   quota_used,
--   quota_remaining,
--   updated_at
-- FROM public.subscriptions
-- WHERE plan_type = 'free'
--   AND status = 'active'
-- ORDER BY updated_at DESC
-- LIMIT 10;

