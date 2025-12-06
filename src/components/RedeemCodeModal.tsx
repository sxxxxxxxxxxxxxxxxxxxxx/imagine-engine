'use client';

import { useState } from 'react';
import { X, Gift, Loader2 } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { supabase } from '@/lib/supabase';

interface RedeemCodeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function RedeemCodeModal({ isOpen, onClose, onSuccess }: RedeemCodeModalProps) {
  const { language } = useLanguage();
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  if (!isOpen) return null;

  const handleRedeem = async () => {
    if (!code.trim()) {
      setError(language === 'zh' ? '请输入卡密' : 'Please enter code');
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        setError(language === 'zh' ? '请先登录' : 'Please login first');
        return;
      }

      const res = await fetch('/api/redeem', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({ code: code.trim() }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        const errorMsg = data.error || data.message || '兑换失败';
        if (errorMsg.includes('不存在') || errorMsg.includes('INVALID')) {
          setError(language === 'zh' ? '卡密不存在或无效' : 'Invalid code');
        } else if (errorMsg.includes('已使用') || errorMsg.includes('ALREADY')) {
          setError(language === 'zh' ? '卡密已被使用' : 'Code already used');
        } else if (errorMsg.includes('过期') || errorMsg.includes('EXPIRED')) {
          setError(language === 'zh' ? '卡密已过期' : 'Code expired');
        } else {
          setError(errorMsg);
        }
        return;
      }

      setSuccess(data.message || (language === 'zh' ? '兑换成功！' : 'Redeemed successfully!'));
      
      setTimeout(() => {
        onSuccess();
        onClose();
        setCode('');
      }, 2000);

    } catch (err: any) {
      setError(err.message || (language === 'zh' ? '兑换失败' : 'Failed to redeem'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="bg-white dark:bg-dark-900 rounded-2xl p-6 w-full max-w-md shadow-2xl">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-dark-900 dark:text-dark-50 flex items-center gap-2">
            <Gift className="w-6 h-6 text-primary-500" />
            {language === 'zh' ? '兑换卡密' : 'Redeem Code'}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-dark-100 dark:hover:bg-dark-800 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-red-600 dark:text-red-400 text-sm">
            {error}
          </div>
        )}

        {success && (
          <div className="mb-4 p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg text-green-600 dark:text-green-400 text-sm">
            {success}
          </div>
        )}

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-dark-700 dark:text-dark-300 mb-2">
              {language === 'zh' ? '卡密码' : 'Activation Code'}
            </label>
            <input
              type="text"
              value={code}
              onChange={(e) => setCode(e.target.value.toUpperCase())}
              placeholder="XXXX-XXXX-XXXX-XXXX"
              className="w-full px-4 py-3 border border-dark-300 dark:border-dark-700 rounded-lg focus:ring-2 focus:ring-primary-500 bg-white dark:bg-dark-800 text-dark-900 dark:text-dark-50 font-mono"
              disabled={loading}
              maxLength={19}
            />
            <p className="mt-2 text-xs text-dark-500">
              {language === 'zh' ? '请输入16位卡密（格式：XXXX-XXXX-XXXX-XXXX）' : 'Enter 16-digit code (Format: XXXX-XXXX-XXXX-XXXX)'}
            </p>
          </div>

          <div className="flex gap-3 pt-2">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-3 border border-dark-300 dark:border-dark-700 rounded-lg hover:bg-dark-100 dark:hover:bg-dark-800 transition-colors"
              disabled={loading}
            >
              {language === 'zh' ? '取消' : 'Cancel'}
            </button>
            <button
              onClick={handleRedeem}
              disabled={loading || !code.trim()}
              className="flex-1 px-4 py-3 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  {language === 'zh' ? '兑换中...' : 'Redeeming...'}
                </>
              ) : (
                <>{language === 'zh' ? '立即兑换' : 'Redeem'}</>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
