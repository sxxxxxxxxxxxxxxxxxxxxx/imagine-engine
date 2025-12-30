import { useState, useEffect, useCallback } from 'react';
import { cacheService } from '@/services/cacheService';

export interface HistoryItem {
  id: string;
  type: 'generate' | 'edit' | 'fusion';
  imageUrl: string;
  prompt: string;
  timestamp: number;
  parentId?: string;
  metadata?: {
    style?: string;
    aspectRatio?: string;
    seed?: number;
    originalSize?: { width: number; height: number };
  };
}

export function useImageHistory() {
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // 从IndexedDB加载历史记录
  useEffect(() => {
    loadHistory();
  }, []);

  const loadHistory = async () => {
    try {
      setIsLoading(true);
      const records = await cacheService.getAllHistory();
      
      // 转换为HistoryItem格式
      const items: HistoryItem[] = records.map(record => ({
        id: record.id,
        type: record.type,
        imageUrl: '', // 需要从blob转换
        prompt: record.prompt,
        timestamp: record.timestamp,
        metadata: record.metadata
      }));

      setHistory(items);
    } catch (error) {
      console.error('Failed to load history:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // 添加历史记录
  const addHistory = useCallback(async (item: Omit<HistoryItem, 'id' | 'timestamp'>) => {
    const newItem: HistoryItem = {
      ...item,
      id: `history-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      timestamp: Date.now()
    };

    // 保存到IndexedDB
    try {
      await cacheService.saveHistory({
        id: newItem.id,
        type: newItem.type,
        imageId: newItem.id,
        prompt: newItem.prompt,
        timestamp: newItem.timestamp,
        metadata: newItem.metadata
      });

      setHistory(prev => [newItem, ...prev]);
    } catch (error) {
      console.error('Failed to save history:', error);
    }

    return newItem;
  }, []);

  // 删除历史记录
  const deleteHistory = useCallback(async (id: string) => {
    try {
      await cacheService.deleteHistory(id);
      setHistory(prev => prev.filter(item => item.id !== id));
    } catch (error) {
      console.error('Failed to delete history:', error);
    }
  }, []);

  // 清空所有历史
  const clearHistory = useCallback(async () => {
    try {
      await cacheService.clearAllHistory();
      setHistory([]);
    } catch (error) {
      console.error('Failed to clear history:', error);
    }
  }, []);

  // 获取历史统计
  const getStats = useCallback(() => {
    const stats = {
      total: history.length,
      generate: history.filter(h => h.type === 'generate').length,
      edit: history.filter(h => h.type === 'edit').length,
      fusion: history.filter(h => h.type === 'fusion').length,
      today: history.filter(h => {
        const today = new Date().setHours(0, 0, 0, 0);
        return h.timestamp >= today;
      }).length,
    };
    return stats;
  }, [history]);

  // 搜索历史
  const searchHistory = useCallback((query: string) => {
    if (!query.trim()) return history;
    
    const lowercaseQuery = query.toLowerCase();
    return history.filter(item =>
      item.prompt.toLowerCase().includes(lowercaseQuery) ||
      item.type.toLowerCase().includes(lowercaseQuery)
    );
  }, [history]);

  // 按日期分组
  const groupByDate = useCallback(() => {
    const groups: Record<string, HistoryItem[]> = {};
    
    history.forEach(item => {
      const date = new Date(item.timestamp);
      const dateKey = date.toLocaleDateString('zh-CN');
      
      if (!groups[dateKey]) {
        groups[dateKey] = [];
      }
      groups[dateKey].push(item);
    });

    return groups;
  }, [history]);

  return {
    history,
    isLoading,
    addHistory,
    deleteHistory,
    clearHistory,
    getStats,
    searchHistory,
    groupByDate,
    reloadHistory: loadHistory
  };
}

