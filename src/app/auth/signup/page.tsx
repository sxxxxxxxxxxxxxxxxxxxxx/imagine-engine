'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useLanguage } from '@/contexts/LanguageContext';
import { signUpWithEmail, signInWithGoogle, signInWithGitHub } from '@/lib/supabase';
import { Mail, Lock, User, Github, Chrome, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function SignUpPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const router = useRouter();
  const { language } = useLanguage();

  const handleEmailSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (password !== confirmPassword) {
      setError(language === 'zh' ? '两次输入的密码不一致' : 'Passwords do not match');
      setLoading(false);
      return;
    }

    if (password.length < 6) {
      setError(language === 'zh' ? '密码至少需要 6 个字符' : 'Password must be at least 6 characters');
      setLoading(false);
      return;
    }

    const { data, error: authError } = await signUpWithEmail(email, password);

    if (authError) {
      setError(language === 'zh' ? '注册失败，该邮箱可能已被使用' : 'Sign up failed. Email may already be in use.');
      setLoading(false);
      return;
    }

    if (data) {
      setSuccess(true);
    }
  };

  if (success) {
    return (
      <div className="page-container min-h-screen flex items-center justify-center">
        <div className="w-full max-w-md px-4">
          <div className="card p-8 text-center">
            <div className="w-16 h-16 bg-primary-50 dark:bg-primary-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <Mail className="w-8 h-8 text-primary-600 dark:text-primary-400" />
            </div>
            <h2 className="text-2xl font-bold text-dark-900 dark:text-dark-50 mb-2">
              {language === 'zh' ? '验证邮箱' : 'Check Your Email'}
            </h2>
            <p className="text-dark-600 dark:text-dark-400 mb-6">
              {language === 'zh' 
                ? '我们已向您的邮箱发送了验证链接，请点击链接完成注册。' 
                : 'We sent a verification link to your email. Click the link to complete your registration.'}
            </p>
            <Link href="/auth/login" className="btn-primary">
              {language === 'zh' ? '前往登录' : 'Go to Login'}
            </Link>
          </div>
        </div>
      </div>
    );
  }

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
              {language === 'zh' ? '创建账户' : 'Create Account'}
            </h1>
            <p className="text-dark-600 dark:text-dark-400">
              {language === 'zh' ? '开始你的 AI 创作之旅' : 'Start your AI creation journey'}
            </p>
          </div>

          {/* Social Sign Up */}
          <div className="space-y-3 mb-6">
            <button
              onClick={handleGoogleLogin}
              disabled={loading}
              className="btn-secondary w-full"
            >
              <Chrome className="w-5 h-5" />
              {language === 'zh' ? '使用 Google 注册' : 'Sign up with Google'}
            </button>
            <button
              onClick={handleGitHubLogin}
              disabled={loading}
              className="btn-secondary w-full"
            >
              <Github className="w-5 h-5" />
              {language === 'zh' ? '使用 GitHub 注册' : 'Sign up with GitHub'}
            </button>
          </div>

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full divider" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white dark:bg-dark-900 text-dark-500">
                {language === 'zh' ? '或使用邮箱注册' : 'OR'}
              </span>
            </div>
          </div>

          {/* Email Sign Up Form */}
          <form onSubmit={handleEmailSignUp} className="space-y-4">
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
                  placeholder={language === 'zh' ? '至少 6 个字符' : 'At least 6 characters'}
                  className="input pl-10"
                  required
                  minLength={6}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-dark-700 dark:text-dark-300 mb-2">
                {language === 'zh' ? '确认密码' : 'Confirm Password'}
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-dark-400" />
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder={language === 'zh' ? '再次输入密码' : 'Re-enter password'}
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
                ? (language === 'zh' ? '注册中...' : 'Signing up...') 
                : (language === 'zh' ? '注册账户' : 'Create Account')}
            </button>
          </form>

          {/* Terms */}
          <p className="mt-4 text-xs text-center text-dark-500">
            {language === 'zh' 
              ? '注册即表示您同意我们的服务条款和隐私政策' 
              : 'By signing up, you agree to our Terms of Service and Privacy Policy'}
          </p>

          {/* Footer */}
          <div className="mt-6 text-center text-sm text-dark-600 dark:text-dark-400">
            {language === 'zh' ? '已有账户？' : 'Already have an account?'}{' '}
            <Link href="/auth/login" className="text-primary-600 dark:text-primary-400 hover:underline font-medium">
              {language === 'zh' ? '登录' : 'Sign In'}
            </Link>
          </div>
        </div>

        {/* Free Trial Notice */}
        <div className="mt-6 card p-4 bg-primary-50 dark:bg-primary-900/20 border-primary-200 dark:border-primary-800">
          <p className="text-sm text-center text-dark-700 dark:text-dark-300">
            {language === 'zh' 
              ? '🎉 注册即送：每天 10 次免费 AI 生成额度' 
              : '🎉 Free trial: 10 AI generations per day'}
          </p>
        </div>
      </div>
    </div>
  );
}

