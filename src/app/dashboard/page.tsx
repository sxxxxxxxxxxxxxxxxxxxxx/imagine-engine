/**
 * 用户仪表板
 * 显示配额使用情况、订阅状态、使用历史
 */

'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useLanguage } from '@/contexts/LanguageContext';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { Zap, TrendingUp, Calendar, CreditCard, Image as ImageIcon, Loader2, Code2, Settings, Gift, User as UserIcon } from 'lucide-react';
import Link from 'next/link';
import dynamic from 'next/dynamic';

const RedeemCodeModal = dynamic(() => import('@/components/RedeemCodeModal'), { ssr: false });

interface SubscriptionInfo {
  planType: string;
  startDate?: string;
  endDate?: string;
  nextBillingDate?: string;
}

interface UserProfile {
  displayName?: string;
  email?: string;
  createdAt?: string;
}

export default function DashboardPage() {
  const { user, isLoggedIn, loading: authLoading } = useAuth();
  const { language } = useLanguage();
  const router = useRouter();

  const [quota, setQuota] = useState<any>(null);
  const [subscription, setSubscription] = useState<SubscriptionInfo | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [recentUsage, setRecentUsage] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showRedeemModal, setShowRedeemModal] = useState(false);

  useEffect(() => {
    if (!authLoading && !isLoggedIn) {
      router.push('/');
    } else if (isLoggedIn && user?.id) {
      fetchDashboardData();
    }
  }, [isLoggedIn, authLoading, user?.id]);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      // 1. 获取配额信息（带认证token）
      const { data: { session } } = await supabase.auth.getSession();

      const quotaRes = await fetch('/api/quota/check', {
        headers: {
          'Authorization': `Bearer ${session?.access_token}`
        }
      });
      const quotaData = await quotaRes.json();

      console.log('📊 仪表盘配额数据:', quotaData);
      setQuota(quotaData);

      // 2. 获取用户资料
      const { data: profileData } = await supabase
        .from('profiles')
        .select('display_name, username, avatar_url, created_at')
        .eq('id', user?.id)
        .single();

      if (profileData) {
        // 显示名称优先级：display_name > username > 邮箱前缀
        const displayName = profileData.display_name
          || profileData.username
          || user?.email?.split('@')[0]
          || '用户';

        setProfile({
          displayName: displayName,
          email: user?.email,
          createdAt: profileData.created_at
        });
      }

      // 3. 获取订阅信息（修正字段名：start_date, end_date, status）
      const { data: subscriptionData } = await supabase
        .from('subscriptions')
        .select('plan_type, start_date, end_date, quota_remaining, quota_total')
        .eq('user_id', user?.id)
        .eq('status', 'active')
        .order('end_date', { ascending: false })
        .limit(1)
        .single();

      if (subscriptionData) {
        setSubscription({
          planType: subscriptionData.plan_type || 'free',
          startDate: subscriptionData.start_date,
          endDate: subscriptionData.end_date
        });
      }

      // 4. 获取最近使用记录
      const { data: usageLogs } = await supabase
        .from('usage_logs')
        .select('*')
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false })
        .limit(10);

      setRecentUsage(usageLogs || []);
    } catch (error) {
      console.error('❌ 获取仪表板数据失败:', error);
    } finally {
      setLoading(false);
    }
  };

  if (authLoading || loading) {
    return (
      <div className="page-container flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-12 h-12 text-primary-500 animate-spin" />
      </div>
    );
  }

  if (!quota) return null;

  // 从quota或subscription获取配额数据（容错处理）
  const totalQuota = quota.totalQuota || subscription?.quota_total || 0;
  const usedQuota = quota.usedQuota || subscription?.quota_used || 0;
  const remaining = quota.remaining || subscription?.quota_remaining || 0;

  const usagePercentage = totalQuota > 0
    ? (usedQuota / totalQuota) * 100
    : 0;

  return (
    <div className="page-container">
      <div className="content-wrapper max-w-6xl mx-auto">
        {/* 页面标题 - 显示用户信息 */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-12 h-12 rounded-full bg-primary-500/20 flex items-center justify-center">
              <UserIcon className="w-6 h-6 text-primary-500" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-dark-900 dark:text-dark-50">
                {language === 'zh' ? '欢迎, ' : 'Welcome, '}{profile?.displayName || user?.email?.split('@')[0]}
              </h1>
              <p className="text-dark-600 dark:text-dark-400">
                {language === 'zh' ? '查看您的使用情况和订阅状态' : 'View your usage and subscription status'}
              </p>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6 mb-8">
          {/* 配额卡片 */}
          <div className="card p-6 lg:col-span-2">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-dark-900 dark:text-dark-50 flex items-center gap-2">
                <Zap className="w-6 h-6 text-primary-500" />
                {language === 'zh' ? '配额使用情况' : 'Quota Usage'}
              </h2>
              <span className={`px-3 py-1 rounded-full text-sm font-semibold ${(subscription?.planType || quota.planType) === 'free'
                ? 'bg-dark-200 dark:bg-dark-700 text-dark-600 dark:text-dark-400'
                : (subscription?.planType || quota.planType) === 'pro'
                  ? 'bg-purple-200 dark:bg-purple-900/50 text-purple-700 dark:text-purple-300'
                  : (subscription?.planType || quota.planType) === 'basic'
                    ? 'bg-primary-200 dark:bg-primary-900/50 text-primary-700 dark:text-primary-300'
                    : 'bg-accent-200 dark:bg-accent-900/50 text-accent-700 dark:text-accent-300'
                }`}>
                {(subscription?.planType || quota.planType)?.toUpperCase()}
              </span>
            </div>

            {/* 环形进度条 */}
            <div className="flex items-center gap-8 mb-6">
              <div className="relative w-32 h-32">
                <svg className="w-32 h-32 transform -rotate-90">
                  <circle
                    cx="64"
                    cy="64"
                    r="56"
                    stroke="currentColor"
                    strokeWidth="12"
                    fill="none"
                    className="text-dark-200 dark:text-dark-800"
                  />
                  <circle
                    cx="64"
                    cy="64"
                    r="56"
                    stroke="currentColor"
                    strokeWidth="12"
                    fill="none"
                    strokeDasharray={`${2 * Math.PI * 56}`}
                    strokeDashoffset={`${2 * Math.PI * 56 * (1 - usagePercentage / 100)}`}
                    className={`transition-all duration-500 ${usagePercentage > 80
                      ? 'text-red-500'
                      : usagePercentage > 50
                        ? 'text-yellow-500'
                        : 'text-primary-500'
                      }`}
                    strokeLinecap="round"
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center flex-col">
                  <span className="text-2xl font-bold text-dark-900 dark:text-dark-50">
                    {Math.round(100 - usagePercentage)}%
                  </span>
                  <span className="text-xs text-dark-500">
                    {language === 'zh' ? '剩余' : 'Left'}
                  </span>
                </div>
              </div>

              <div className="flex-1">
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-dark-600 dark:text-dark-400">
                      {language === 'zh' ? '总配额' : 'Total Quota'}
                    </span>
                    <span className="font-semibold text-dark-900 dark:text-dark-50">
                      {totalQuota} {language === 'zh' ? '张' : 'images'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-dark-600 dark:text-dark-400">
                      {language === 'zh' ? '已使用' : 'Used'}
                    </span>
                    <span className="font-semibold text-dark-900 dark:text-dark-50">
                      {usedQuota} {language === 'zh' ? '张' : 'images'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-dark-600 dark:text-dark-400">
                      {language === 'zh' ? '剩余' : 'Remaining'}
                    </span>
                    <span className="font-bold text-primary-600 dark:text-primary-400 text-lg">
                      {remaining} {language === 'zh' ? '张' : 'images'}
                    </span>
                  </div>
                </div>

                {/* 进度条 */}
                <div className="mt-4 h-3 bg-dark-200 dark:bg-dark-800 rounded-full overflow-hidden">
                  <div
                    className={`h-full transition-all duration-500 ${usagePercentage > 80
                      ? 'bg-red-500'
                      : usagePercentage > 50
                        ? 'bg-yellow-500'
                        : 'bg-primary-500'
                      }`}
                    style={{ width: `${usagePercentage}%` }}
                  />
                </div>
              </div>
            </div>

            {/* 快速操作 */}
            <div className="grid grid-cols-3 gap-3">
              <Link href="/pricing" className="btn-primary text-center text-sm">
                {language === 'zh' ? '升级套餐' : 'Upgrade'}
              </Link>
              <button
                onClick={() => setShowRedeemModal(true)}
                className="btn-outline text-center text-sm flex items-center justify-center gap-1 hover:bg-primary-50 dark:hover:bg-primary-900/20 hover:text-primary-600 dark:hover:text-primary-400"
              >
                <Gift className="w-4 h-4" />
                {language === 'zh' ? '兑换卡密' : 'Redeem'}
              </button>
              <Link href="/create" className="btn-outline text-center text-sm">
                {language === 'zh' ? '开始创作' : 'Create'}
              </Link>
            </div>
          </div>

          {/* 订阅信息卡片 - 修复后显示真实数据 */}
          <div className="card p-6">
            <h2 className="text-xl font-bold text-dark-900 dark:text-dark-50 mb-4 flex items-center gap-2">
              <Calendar className="w-6 h-6 text-primary-500" />
              {language === 'zh' ? '订阅信息' : 'Subscription'}
            </h2>

            <div className="space-y-4">
              <div>
                <p className="text-sm text-dark-500 mb-1">
                  {language === 'zh' ? '当前套餐' : 'Current Plan'}
                </p>
                <p className="text-lg font-bold text-dark-900 dark:text-dark-50">
                  {subscription?.planType?.toUpperCase() || quota.planType?.toUpperCase()}
                </p>
              </div>

              {subscription?.startDate && (
                <div>
                  <p className="text-sm text-dark-500 mb-1">
                    {language === 'zh' ? '开始时间' : 'Started On'}
                  </p>
                  <p className="text-sm font-medium text-dark-700 dark:text-dark-300">
                    {new Date(subscription.startDate).toLocaleDateString(language === 'zh' ? 'zh-CN' : 'en-US')}
                  </p>
                </div>
              )}

              {subscription?.endDate && (
                <div>
                  <p className="text-sm text-dark-500 mb-1">
                    {language === 'zh' ? '到期时间' : 'Expires On'}
                  </p>
                  <p className={`text-sm font-medium ${new Date(subscription.endDate) < new Date()
                    ? 'text-red-600 dark:text-red-400'
                    : 'text-dark-700 dark:text-dark-300'
                    }`}>
                    {new Date(subscription.endDate).toLocaleDateString(language === 'zh' ? 'zh-CN' : 'en-US')}
                  </p>
                </div>
              )}

              <div className="pt-4 border-t border-dark-200 dark:border-dark-800">
                <Link href="/pricing" className="w-full btn-outline text-sm flex items-center justify-center">
                  <CreditCard className="w-4 h-4 mr-2" />
                  {language === 'zh' ? '管理订阅' : 'Manage Subscription'}
                </Link>
              </div>
            </div>
          </div>

          {/* 自定义API配置卡片 */}
          <div className="card p-6">
            <h2 className="text-xl font-bold text-dark-900 dark:text-dark-50 mb-4 flex items-center gap-2">
              <Code2 className="w-6 h-6 text-primary-500" />
              {language === 'zh' ? 'API 配置' : 'API Settings'}
            </h2>

            <div className="space-y-4">
              <div>
                <p className="text-sm text-dark-500 mb-1">
                  {language === 'zh' ? '图片生成 API' : 'Image Generation API'}
                </p>
                <p className="text-sm font-medium text-dark-700 dark:text-dark-300">
                  {typeof window !== 'undefined' && localStorage.getItem('imagine-engine-custom-image-enabled') === 'true'
                    ? (language === 'zh' ? '✅ 已启用自定义' : '✅ Custom Enabled')
                    : (language === 'zh' ? '默认服务' : 'Default Service')}
                </p>
              </div>

              <div>
                <p className="text-sm text-dark-500 mb-1">
                  {language === 'zh' ? 'AI 聊天 API' : 'AI Chat API'}
                </p>
                <p className="text-sm font-medium text-dark-700 dark:text-dark-300">
                  {typeof window !== 'undefined' && localStorage.getItem('imagine-engine-custom-chat-enabled') === 'true'
                    ? (language === 'zh' ? '✅ 已启用自定义' : '✅ Custom Enabled')
                    : (language === 'zh' ? '默认服务' : 'Default Service')}
                </p>
              </div>

              <div className="pt-4 border-t border-dark-200 dark:border-dark-800">
                <Link href="/settings" className="w-full btn-outline text-sm flex items-center justify-center">
                  <Settings className="w-4 h-4 mr-2" />
                  {language === 'zh' ? '配置 API' : 'Configure API'}
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* 最近使用记录 */}
        <div className="card p-6">
          <h2 className="text-xl font-bold text-dark-900 dark:text-dark-50 mb-4 flex items-center gap-2">
            <TrendingUp className="w-6 h-6 text-primary-500" />
            {language === 'zh' ? '最近使用记录' : 'Recent Activity'}
          </h2>

          {recentUsage.length === 0 ? (
            <div className="text-center py-12 text-dark-500">
              <ImageIcon className="w-12 h-12 mx-auto mb-3 opacity-50" />
              <p>{language === 'zh' ? '还没有使用记录' : 'No usage history yet'}</p>
            </div>
          ) : (
            <div className="space-y-3">
              {recentUsage.map((log) => (
                <div
                  key={log.id}
                  className="flex items-center gap-4 p-3 bg-dark-50 dark:bg-dark-900 rounded-lg hover:bg-dark-100 dark:hover:bg-dark-800 transition-colors"
                >
                  {log.image_url && (
                    <img
                      src={log.image_url}
                      alt="Generated"
                      className="w-16 h-16 object-cover rounded"
                    />
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-dark-900 dark:text-dark-50 truncate">
                      {log.prompt || (language === 'zh' ? '无提示词' : 'No prompt')}
                    </p>
                    <p className="text-xs text-dark-500">
                      {new Date(log.created_at).toLocaleString(language === 'zh' ? 'zh-CN' : 'en-US')} · {log.model_used}
                    </p>
                  </div>
                  <div className="text-sm font-semibold text-dark-700 dark:text-dark-300">
                    -{log.cost_quota} {language === 'zh' ? '张' : 'quota'}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* 卡密兑换模态框 */}
      <RedeemCodeModal
        isOpen={showRedeemModal}
        onClose={() => setShowRedeemModal(false)}
        onSuccess={() => {
          fetchDashboardData(); // 刷新数据
          setShowRedeemModal(false);
        }}
      />
    </div>
  );
}
