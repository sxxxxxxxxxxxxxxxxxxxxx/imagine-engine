'use client';

import { useEffect, useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { getRecentTools } from '@/lib/recentTools';
import { getFavorites } from '@/lib/favorites';
import { BarChart3, Clock, Heart, Zap } from 'lucide-react';
import SpotlightCard from './SpotlightCard';

interface UsageStatsProps {
  className?: string;
}

export default function UsageStats({ className = '' }: UsageStatsProps) {
  const { language } = useLanguage();
  const [stats, setStats] = useState({
    recentToolsCount: 0,
    favoritesCount: 0,
    totalUsage: 0
  });

  useEffect(() => {
    const recentTools = getRecentTools();
    const favorites = getFavorites();
    
    const totalUsage = recentTools.reduce((sum, tool) => sum + tool.usageCount, 0);
    
    setStats({
      recentToolsCount: recentTools.length,
      favoritesCount: favorites.length,
      totalUsage
    });
  }, []);

  const statsItems = [
    {
      icon: Clock,
      label: language === 'zh' ? '最近使用' : 'Recent Tools',
      value: stats.recentToolsCount,
      color: 'text-blue-600 dark:text-blue-400',
      bgColor: 'bg-blue-50 dark:bg-blue-900/20'
    },
    {
      icon: Heart,
      label: language === 'zh' ? '收藏' : 'Favorites',
      value: stats.favoritesCount,
      color: 'text-red-600 dark:text-red-400',
      bgColor: 'bg-red-50 dark:bg-red-900/20'
    },
    {
      icon: Zap,
      label: language === 'zh' ? '总使用次数' : 'Total Usage',
      value: stats.totalUsage,
      color: 'text-primary-600 dark:text-primary-400',
      bgColor: 'bg-primary-50 dark:bg-primary-900/20'
    }
  ];

  return (
    <SpotlightCard className={`p-6 ${className}`}>
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 rounded-lg bg-primary-500/20 flex items-center justify-center">
          <BarChart3 className="w-5 h-5 text-primary-500" />
        </div>
        <h3 className="text-lg font-semibold text-dark-900 dark:text-dark-50">
          {language === 'zh' ? '使用统计' : 'Usage Statistics'}
        </h3>
      </div>
      
      <div className="grid grid-cols-3 gap-4">
        {statsItems.map((item, index) => {
          const Icon = item.icon;
          return (
            <div key={index} className="text-center">
              <div className={`inline-flex w-12 h-12 rounded-xl ${item.bgColor} items-center justify-center mb-2`}>
                <Icon className={`w-6 h-6 ${item.color}`} />
              </div>
              <div className="text-2xl font-bold text-dark-900 dark:text-dark-50 mb-1">
                {item.value}
              </div>
              <div className="text-xs text-dark-600 dark:text-dark-400">
                {item.label}
              </div>
            </div>
          );
        })}
      </div>
    </SpotlightCard>
  );
}

