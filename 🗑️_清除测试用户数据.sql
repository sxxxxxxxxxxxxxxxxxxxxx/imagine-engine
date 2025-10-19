-- ============================================
-- 🗑️ 清除所有测试用户数据
-- 在 Supabase SQL Editor 中执行
-- ============================================

-- 1. 删除所有使用日志
DELETE FROM public.usage_logs;

-- 2. 删除所有交易记录
DELETE FROM public.transactions;

-- 3. 删除所有订阅记录
DELETE FROM public.subscriptions;

-- 4. 删除所有用户资料
DELETE FROM public.profiles;

-- 5. 删除所有认证用户（这会级联删除上面的数据）
-- ⚠️ 谨慎：这会删除所有用户账号！
DELETE FROM auth.users;

-- ============================================
-- ✅ 执行成功后，数据库清空
-- ============================================

-- 验证：查看是否还有用户
SELECT COUNT(*) as user_count FROM auth.users;
-- 应该返回 0

SELECT COUNT(*) as profile_count FROM public.profiles;
-- 应该返回 0

SELECT COUNT(*) as subscription_count FROM public.subscriptions;
-- 应该返回 0

-- ============================================
-- 🎊 清空完成！现在可以重新测试注册流程
-- ============================================

