/**
 * 认证模态框组件
 * 支持注册、登录、OAuth 第三方登录
 */

'use client';

import { useState } from 'react';
import { X, Mail, Lock, Github, Loader2 } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useLanguage } from '@/contexts/LanguageContext';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  initialMode?: 'signin' | 'signup';
}

export default function AuthModal({ 
  isOpen, 
  onClose, 
  onSuccess,
  initialMode = 'signup' 
}: AuthModalProps) {
  const { language } = useLanguage();
  const [mode, setMode] = useState<'signin' | 'signup'>(initialMode);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const { signUp, signIn, signInWithOAuth } = useAuth();

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      const { data, error: authError } = mode === 'signup'
        ? await signUp(email, password)
        : await signIn(email, password);

      if (authError) {
        throw authError;
      }

      // 注册成功提示
      if (mode === 'signup') {
        setSuccess(language === 'zh' 
          ? '🎉 注册成功！\n📧 验证邮件已发送到 ' + email + '\n请查收邮件并点击验证链接，验证后即可获得20张免费配额' 
          : '🎉 Sign up successful!\n📧 Verification email sent to ' + email + '\nPlease check your email and click the link to get 20 free images');
      } else {
        setSuccess(language === 'zh' ? '✅ 登录成功！' : '✅ Login successful!');
      }

      // 延迟关闭，让用户看到成功提示
      setTimeout(() => {
        onSuccess?.();
        onClose();
      }, 1500);

    } catch (err: any) {
      console.error('认证错误:', err);
      
      // 错误信息本地化
      const errorMessages: Record<string, string> = {
        'Invalid login credentials': language === 'zh' ? '邮箱或密码错误' : 'Invalid email or password',
        'User already registered': language === 'zh' ? '该邮箱已注册' : 'Email already registered',
        'Email not confirmed': language === 'zh' ? '请先验证邮箱' : 'Please verify your email first',
      };

      setError(errorMessages[err.message] || err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleOAuth = async (provider: 'github' | 'google') => {
    setError('');
    setLoading(true);
    
    try {
      const { error: oauthError } = await signInWithOAuth(provider);
      if (oauthError) throw oauthError;
      
      // OAuth 会重定向，不需要关闭模态框
    } catch (err: any) {
      console.error('OAuth 错误:', err);
      setError(err.message);
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="card relative w-full max-w-md mx-4 p-8 animate-slide-up">
        {/* 关闭按钮 */}
        <button
          onClick={onClose}
          disabled={loading}
          className="absolute top-4 right-4 p-2 hover:bg-dark-100 dark:hover:bg-dark-800 rounded-lg transition-colors disabled:opacity-50"
          aria-label={language === 'zh' ? '关闭' : 'Close'}
        >
          <X className="w-5 h-5 text-dark-600 dark:text-dark-400" />
        </button>

        {/* 标题 */}
        <div className="text-center mb-6">
          <div className="text-5xl mb-3">✨</div>
          <h2 className="text-2xl font-bold text-dark-900 dark:text-dark-50 mb-2">
            {mode === 'signup' 
              ? (language === 'zh' ? '开始您的 AI 创作之旅' : 'Start Your AI Journey')
              : (language === 'zh' ? '欢迎回来' : 'Welcome Back')}
          </h2>
          <p className="text-dark-600 dark:text-dark-400">
            {mode === 'signup' 
              ? (language === 'zh' ? '🎁 注册即送 20 张免费图片' : '🎁 Get 20 free images upon signup')
              : (language === 'zh' ? '登录继续您的创作' : 'Login to continue creating')}
          </p>
        </div>

        {/* 错误提示 */}
        {error && (
          <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-red-600 dark:text-red-400 text-sm animate-fade-in">
            ⚠️ {error}
          </div>
        )}

        {/* 成功提示 */}
        {success && (
          <div className="mb-4 p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg text-green-600 dark:text-green-400 text-sm animate-fade-in">
            {success}
          </div>
        )}

        {/* 邮箱验证说明（注册模式） */}
        {mode === 'signup' && (
          <div className="mb-4 p-3 bg-primary-50 dark:bg-primary-900/20 border border-primary-200 dark:border-primary-800 rounded-lg">
            <p className="text-sm text-primary-700 dark:text-primary-300">
              📧 {language === 'zh' 
                ? '注册后请查收验证邮件，验证后即可获得20张免费配额' 
                : 'Please verify your email to get 20 free images'}
            </p>
          </div>
        )}

        {/* 表单 */}
        <form onSubmit={handleSubmit} className="space-y-4 mb-6">
          {/* 邮箱 */}
          <div>
            <label className="block text-sm font-medium mb-2 text-dark-700 dark:text-dark-300">
              📧 {language === 'zh' ? '邮箱' : 'Email'}
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-dark-400" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={loading}
                className="w-full pl-10 pr-4 py-3 border border-dark-300 dark:border-dark-700 rounded-lg focus:ring-2 focus:ring-primary-500 dark:bg-dark-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                placeholder="your@email.com"
              />
            </div>
          </div>

          {/* 密码 */}
          <div>
            <label className="block text-sm font-medium mb-2 text-dark-700 dark:text-dark-300">
              🔒 {language === 'zh' ? '密码' : 'Password'}
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-dark-400" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
                disabled={loading}
                className="w-full pl-10 pr-4 py-3 border border-dark-300 dark:border-dark-700 rounded-lg focus:ring-2 focus:ring-primary-500 dark:bg-dark-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                placeholder={language === 'zh' ? '至少 6 个字符' : 'At least 6 characters'}
              />
            </div>
            {mode === 'signup' && (
              <p className="mt-1 text-xs text-dark-500">
                {language === 'zh' ? '密码长度至少 6 个字符' : 'Minimum 6 characters'}
              </p>
            )}
          </div>

          {/* 提交按钮 */}
          <button
            type="submit"
            disabled={loading}
            className="w-full btn-primary py-3 text-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {loading && <Loader2 className="w-5 h-5 animate-spin" />}
            {loading ? (
              language === 'zh' ? '处理中...' : 'Processing...'
            ) : mode === 'signup' ? (
              language === 'zh' ? '立即注册并生成' : 'Sign Up & Generate'
            ) : (
              language === 'zh' ? '登录' : 'Sign In'
            )}
          </button>
        </form>

        {/* OAuth 登录 */}
        <div>
          <div className="relative mb-4">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-dark-300 dark:border-dark-700"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white dark:bg-dark-900 text-dark-500">
                {language === 'zh' ? '或使用第三方登录' : 'Or continue with'}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => handleOAuth('github')}
              disabled={loading}
              className="btn-outline py-3 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Github className="w-5 h-5" />
              GitHub
            </button>
            <button
              onClick={() => handleOAuth('google')}
              disabled={loading}
              className="btn-outline py-3 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              Google
            </button>
          </div>
        </div>

        {/* 切换登录/注册 */}
        <div className="mt-6 text-center text-sm">
          <span className="text-dark-600 dark:text-dark-400">
            {mode === 'signup' 
              ? (language === 'zh' ? '已有账号？' : 'Already have an account?')
              : (language === 'zh' ? '还没有账号？' : "Don't have an account?")}
          </span>
          <button
            onClick={() => {
              setMode(mode === 'signup' ? 'signin' : 'signup');
              setError('');
              setSuccess('');
            }}
            disabled={loading}
            className="ml-2 text-primary-500 hover:text-primary-600 font-medium disabled:opacity-50 transition-colors"
          >
            {mode === 'signup' 
              ? (language === 'zh' ? '登录' : 'Sign In')
              : (language === 'zh' ? '注册' : 'Sign Up')}
          </button>
        </div>

        {/* 服务条款 */}
        {mode === 'signup' && (
          <p className="mt-4 text-xs text-center text-dark-500">
            {language === 'zh' 
              ? '注册即表示您同意我们的服务条款和隐私政策' 
              : 'By signing up, you agree to our Terms of Service and Privacy Policy'}
          </p>
        )}
      </div>
    </div>
  );
}

