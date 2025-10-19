'use client';

import { useEffect } from 'react';
import { initializeDefaultConfig } from '@/lib/initializeDefaults';

export default function InitializeConfig() {
  useEffect(() => {
    // 在客户端初始化默认配置
    initializeDefaultConfig();
  }, []);

  return null; // 不渲染任何内容
}

