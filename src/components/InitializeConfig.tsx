'use client';

import { useEffect } from 'react';
import { initializeDefaultConfig } from '@/lib/initializeDefaults';
import { trackEvent } from '@/lib/analytics';

export default function InitializeConfig() {
  useEffect(() => {
    initializeDefaultConfig();
    try {
      const params = new URLSearchParams(window.location.search);
      const source = params.get('utm_source') || '';
      const medium = params.get('utm_medium') || '';
      const campaign = params.get('utm_campaign') || '';
      const content = params.get('utm_content') || '';
      const term = params.get('utm_term') || '';
      if (source || medium || campaign) {
        trackEvent('utm_landing', {
          utm_source: source,
          utm_medium: medium,
          utm_campaign: campaign,
          utm_content: content,
          utm_term: term
        });
      }
    } catch {}
  }, []);

  return null; // 不渲染任何内容
}

