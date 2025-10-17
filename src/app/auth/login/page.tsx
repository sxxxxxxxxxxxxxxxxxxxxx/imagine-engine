'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useLanguage } from '@/contexts/LanguageContext';
import { signInWithEmail, signInWithGoogle, signInWithGitHub } from '@/lib/supabase';
import { Mail, Lock, Github, Chrome, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();
  const { language } = useLanguage();

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const { data, error: authError } = await signInWithEmail(email, password);

    if (authError) {
      setError(language === 'zh' ? '登录失败，请检查邮箱和密码' : 'Login failed. Please check your email and password.');
      setLoading(false);
      return;
    }

    if (data) {
      router.push('/create');
    }
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    await signInWithGoogle();
    // OAuth 会重定向，无需处理结果
  };

  const handleGitHubLogin = async () => {
    setLoading(true);
    await signInWithGitHub();
    // OAuth 会重定向，无需处理结果
  };

  return (
    <div className="page-container min-h-screen flex items-center justify-center">
      <div className="w-full max-w-md px-4">
        {/* Back Button */}
        <Link href="/" className="inline-flex items-center gap-2 text-dark-600 dark:text-dark-400 hover:text-dark-900 dark:hover:text-dark-100 mb-8">
          <ArrowLeft className="w-4 h-4" />
          <span className="text-sm">{language === 'zh' ? '返回首页' : 'Back to Home'}</span>
        </Link>

        <div className="card p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-dark-900 dark:text-dark-50 mb-2">
              {language === 'zh' ? '登录账户' : 'Sign In'}
            </h1>
            <p className="text-dark-600 dark:text-dark-400">
              {language === 'zh' ? '继续使用创想引擎' : 'Continue to Imagine Engine'}
            </p>
          </div>

          {/* Social Login */}
          <div className="space-y-3 mb-6">
            <button
              onClick={handleGoogleLogin}
              disabled={loading}
              className="btn-secondary w-full"
            >
              <Chrome className="w-5 h-5" />
              {language === 'zh' ? '使用 Google 登录' : 'Continue with Google'}
            </button>
            <button
              onClick={handleGitHubLogin}
              disabled={loading}
              className="btn-secondary w-full"
            >
              <Github className="w-5 h-5" />
              {language === 'zh' ? '使用 GitHub 登录' : 'Continue with GitHub'}
            </button>
          </div>

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full divider" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white dark:bg-dark-900 text-dark-500">
                {language === 'zh' ? '或' : 'OR'}
              </span>
            </div>
          </div>

          {/* Email Login Form */}
          <form onSubmit={handleEmailLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-dark-700 dark:text-dark-300 mb-2">
                {language === 'zh' ? '邮箱' : 'Email'}
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-dark-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={language === 'zh' ? '输入邮箱地址' : 'Enter your email'}
                  className="input pl-10"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-dark-700 dark:text-dark-300 mb-2">
                {language === 'zh' ? '密码' : 'Password'}
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-dark-400" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder={language === 'zh' ? '输入密码' : 'Enter your password'}
                  className="input pl-10"
                  required
                />
              </div>
            </div>

            {error && (
              <div className="p-3 rounded-lg bg-accent-50 dark:bg-accent-900/20 border border-accent-200 dark:border-accent-800">
                <p className="text-sm text-accent-700 dark:text-accent-300">{error}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full"
            >
              {loading 
                ? (language === 'zh' ? '登录中...' : 'Signing in...') 
                : (language === 'zh' ? '登录' : 'Sign In')}
            </button>
          </form>

          {/* Footer */}
          <div className="mt-6 text-center text-sm text-dark-600 dark:text-dark-400">
            {language === 'zh' ? '还没有账户？' : "Don't have an account?"}{' '}
            <Link href="/auth/signup" className="text-primary-600 dark:text-primary-400 hover:underline font-medium">
              {language === 'zh' ? '注册' : 'Sign Up'}
            </Link>
          </div>
        </div>

        {/* Free Trial Notice */}
        <div className="mt-6 text-center">
          <p className="text-sm text-dark-500">
            {language === 'zh' 
              ? '💡 免费账户每天 10 次 AI 生成额度' 
              : '💡 Free accounts get 10 AI generations per day'}
          </p>
        </div>
      </div>
    </div>
  );
}

