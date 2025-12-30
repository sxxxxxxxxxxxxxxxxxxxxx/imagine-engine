/**
 * 配置提示组件
 * 当 .env.local 未配置时显示醒目提示
 */

'use client';

import { useState, useEffect } from 'react';
import { AlertCircle, X } from 'lucide-react';

export default function ConfigAlert() {
  const [show, setShow] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    // 检查环境变量是否配置
    const hasSupabaseUrl = !!process.env.NEXT_PUBLIC_SUPABASE_URL;
    const hasSupabaseKey = !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    
    // 检查是否已关闭提示
    const wasDismissed = sessionStorage.getItem('config_alert_dismissed');
    
    if ((!hasSupabaseUrl || !hasSupabaseKey) && !wasDismissed) {
      setShow(true);
    }
  }, []);

  const handleDismiss = () => {
    setDismissed(true);
    setShow(false);
    sessionStorage.setItem('config_alert_dismissed', 'true');
  };

  if (!show || dismissed) return null;

  return (
    <div className="fixed top-20 left-1/2 -translate-x-1/2 z-40 w-full max-w-2xl mx-4 animate-slide-up">
      <div className="bg-amber-50 dark:bg-amber-900/20 border-2 border-amber-400 dark:border-amber-600 rounded-lg p-4 shadow-xl">
        <div className="flex items-start gap-3">
          <AlertCircle className="w-6 h-6 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
          
          <div className="flex-1">
            <h3 className="font-bold text-amber-900 dark:text-amber-100 mb-2">
              ⚠️ 需要配置环境变量
            </h3>
            <p className="text-sm text-amber-800 dark:text-amber-200 mb-3">
              注册/登录功能需要配置 <code className="px-2 py-0.5 bg-amber-100 dark:bg-amber-900 rounded">.env.local</code> 文件才能使用。
            </p>
            
            <div className="text-sm text-amber-700 dark:text-amber-300 space-y-2">
              <p className="font-semibold">📝 快速配置（3分钟）：</p>
              <ol className="list-decimal list-inside space-y-1 ml-2">
                <li>在项目根目录创建 <code className="px-1.5 py-0.5 bg-amber-100 dark:bg-amber-900 rounded text-xs">.env.local</code> 文件</li>
                <li>复制 <code className="px-1.5 py-0.5 bg-amber-100 dark:bg-amber-900 rounded text-xs">.env.local.example</code> 的内容</li>
                <li>重启开发服务器（Ctrl+C 然后 npm run dev）</li>
              </ol>
              <p className="mt-2">
                <strong>详细步骤</strong>: 查看 <code className="px-1.5 py-0.5 bg-amber-100 dark:bg-amber-900 rounded text-xs">🎯_最后2步配置.md</code>
              </p>
            </div>
          </div>

          <button
            onClick={handleDismiss}
            className="p-1 hover:bg-amber-200 dark:hover:bg-amber-800 rounded transition-colors flex-shrink-0"
          >
            <X className="w-5 h-5 text-amber-600 dark:text-amber-400" />
          </button>
        </div>
      </div>
    </div>
  );
}

