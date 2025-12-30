'use client';

import { useState, useEffect } from 'react';
import { User, Upload, Loader2, Camera } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/hooks/useAuth';

export default function ProfileEditor() {
  const { language } = useLanguage();
  const { user } = useAuth();
  const [displayName, setDisplayName] = useState('');
  const [bio, setBio] = useState('');
  const [avatarUrl, setAvatarUrl] = useState('');
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (user) {
      loadProfile();
    }
  }, [user]);

  const loadProfile = async () => {
    try {
      const { data } = await supabase
        .from('profiles')
        .select('display_name, bio, avatar_url')
        .eq('id', user?.id)
        .single();

      if (data) {
        setDisplayName(data.display_name || '');
        setBio(data.bio || '');
        setAvatarUrl(data.avatar_url || '');
      }
    } catch (error) {
      console.error('加载资料失败:', error);
    }
  };

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;

    if (file.size > 5 * 1024 * 1024) {
      setMessage(language === 'zh' ? '图片大小不能超过5MB' : 'Image size must be under 5MB');
      return;
    }

    setUploading(true);
    setMessage('');

    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}/${Date.now()}.${fileExt}`;

      const { data, error } = await supabase.storage
        .from('avatars')
        .upload(fileName, file, { upsert: true });

      if (error) throw error;

      const { data: { publicUrl } } = supabase.storage
        .from('avatars')
        .getPublicUrl(fileName);

      setAvatarUrl(publicUrl);
      setMessage(language === 'zh' ? '头像上传成功！' : 'Avatar uploaded!');
    } catch (error: any) {
      console.error('上传头像失败:', error);
      setMessage(error.message || (language === 'zh' ? '上传失败' : 'Upload failed'));
    } finally {
      setUploading(false);
    }
  };

  const handleSave = async () => {
    if (!user) return;

    setSaving(true);
    setMessage('');

    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error('未登录');

      const res = await fetch('/api/profile/update', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({
          displayName: displayName.trim(),
          bio: bio.trim(),
          avatarUrl,
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || '保存失败');
      }

      setMessage(language === 'zh' ? '✅ 保存成功！' : '✅ Saved successfully!');
    } catch (error: any) {
      console.error('保存失败:', error);
      setMessage(error.message || (language === 'zh' ? '保存失败' : 'Failed to save'));
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-6">
        <div className="relative">
          <div className="w-24 h-24 rounded-full overflow-hidden bg-dark-200 dark:bg-dark-800 flex items-center justify-center">
            {avatarUrl ? (
              <img src={avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
            ) : (
              <User className="w-12 h-12 text-dark-400" />
            )}
          </div>
          <label className="absolute bottom-0 right-0 p-2 bg-primary-500 text-white rounded-full cursor-pointer hover:bg-primary-600 shadow-lg">
            <Camera className="w-4 h-4" />
            <input
              type="file"
              accept="image/*"
              onChange={handleAvatarUpload}
              className="hidden"
              disabled={uploading}
            />
          </label>
          {uploading && (
            <div className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center">
              <Loader2 className="w-6 h-6 text-white animate-spin" />
            </div>
          )}
        </div>

        <div className="flex-1">
          <p className="text-sm text-dark-600 dark:text-dark-400 mb-2">
            {language === 'zh' ? '点击相机图标上传头像' : 'Click camera to upload avatar'}
          </p>
          <p className="text-xs text-dark-500">
            {language === 'zh' ? '支持 JPG、PNG、GIF，最大5MB' : 'JPG, PNG, GIF, max 5MB'}
          </p>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-dark-700 dark:text-dark-300 mb-2">
          {language === 'zh' ? '显示名称' : 'Display Name'}
        </label>
        <input
          type="text"
          value={displayName}
          onChange={(e) => setDisplayName(e.target.value)}
          placeholder={language === 'zh' ? '输入您的昵称' : 'Enter your display name'}
          className="w-full px-4 py-2 border border-dark-300 dark:border-dark-700 rounded-lg focus:ring-2 focus:ring-primary-500 bg-white dark:bg-dark-800"
          maxLength={50}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-dark-700 dark:text-dark-300 mb-2">
          {language === 'zh' ? '个人简介' : 'Bio'}
        </label>
        <textarea
          value={bio}
          onChange={(e) => setBio(e.target.value)}
          placeholder={language === 'zh' ? '简单介绍一下自己' : 'Tell us about yourself'}
          className="w-full px-4 py-2 border border-dark-300 dark:border-dark-700 rounded-lg focus:ring-2 focus:ring-primary-500 bg-white dark:bg-dark-800 resize-none"
          rows={4}
          maxLength={200}
        />
        <p className="mt-1 text-xs text-dark-500 text-right">
          {bio.length}/200
        </p>
      </div>

      {message && (
        <div className={`p-3 rounded-lg text-sm ${
          message.includes('✅') || message.includes('成功') || message.includes('success')
            ? 'bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 border border-green-200 dark:border-green-800'
            : 'bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-800'
        }`}>
          {message}
        </div>
      )}

      <button
        onClick={handleSave}
        disabled={saving}
        className="w-full px-4 py-3 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
      >
        {saving ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" />
            {language === 'zh' ? '保存中...' : 'Saving...'}
          </>
        ) : (
          <>{language === 'zh' ? '保存更改' : 'Save Changes'}</>
        )}
      </button>
    </div>
  );
}
