'use client';

import { useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';
import { useLanguage } from '@/contexts/LanguageContext';
import { User, Loader2 } from 'lucide-react';
import ProfileEditor from '@/components/ProfileEditor';

export default function ProfilePage() {
  const { user, isLoggedIn, loading } = useAuth();
  const { language } = useLanguage();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !isLoggedIn) {
      router.push('/');
    }
  }, [isLoggedIn, loading]);

  if (loading) {
    return (
      <div className="page-container flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-12 h-12 text-primary-500 animate-spin" />
      </div>
    );
  }

  if (!isLoggedIn) return null;

  return (
    <div className="page-container">
      <div className="content-wrapper max-w-2xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-dark-900 dark:text-dark-50 mb-2 flex items-center gap-2">
            <User className="w-8 h-8 text-primary-500" />
            {language === 'zh' ? '个人资料' : 'Profile'}
          </h1>
          <p className="text-dark-600 dark:text-dark-400">
            {language === 'zh' ? '管理您的个人信息和头像' : 'Manage your personal information and avatar'}
          </p>
        </div>

        <div className="card p-8">
          <ProfileEditor />
        </div>
      </div>
    </div>
  );
}
