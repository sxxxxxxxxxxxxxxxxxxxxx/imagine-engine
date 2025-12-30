import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// 类型定义
export interface GeneratedImage {
  id: string;
  url: string;
  prompt: string;
  model: string;
  aspectRatio: string;
  timestamp: number;
  thumbnail?: string;
}

export interface User {
  id: string;
  email: string;
  name?: string;
  avatar?: string;
  createdAt: number;
}

export interface Subscription {
  tier: 'free' | 'pro' | 'team';
  status: 'active' | 'canceled' | 'expired';
  currentPeriodEnd?: number;
}

export interface UsageQuota {
  generate: { used: number; limit: number };
  edit: { used: number; limit: number };
  resetAt: number;
}

interface AppState {
  // 用户状态
  user: User | null;
  subscription: Subscription;
  quota: UsageQuota;
  
  // 创作状态
  prompt: string;
  selectedModel: string;
  aspectRatio: string;
  selectedStyle: string;
  batchCount: number;
  generatedImages: GeneratedImage[];
  
  // UI 状态
  theme: 'light' | 'dark';
  language: 'zh' | 'en';
  
  // Actions - 用户
  setUser: (user: User | null) => void;
  setSubscription: (subscription: Subscription) => void;
  updateQuota: (action: 'generate' | 'edit') => void;
  
  // Actions - 创作
  setPrompt: (prompt: string) => void;
  setSelectedModel: (model: string) => void;
  setAspectRatio: (ratio: string) => void;
  setSelectedStyle: (style: string) => void;
  setBatchCount: (count: number) => void;
  addGeneratedImage: (image: GeneratedImage) => void;
  removeGeneratedImage: (id: string) => void;
  clearGeneratedImages: () => void;
  
  // Actions - UI
  setTheme: (theme: 'light' | 'dark') => void;
  toggleTheme: () => void;
  setLanguage: (language: 'zh' | 'en') => void;
}

// 默认配额
const DEFAULT_QUOTA: UsageQuota = {
  generate: { used: 0, limit: 20 }, // 免费版每月 20 次
  edit: { used: 0, limit: 5 },     // 免费版每天 5 次
  resetAt: Date.now() + 24 * 60 * 60 * 1000 // 24小时后重置
};

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      // 初始状态 - 用户
      user: null,
      subscription: {
        tier: 'free',
        status: 'active'
      },
      quota: DEFAULT_QUOTA,
      
      // 初始状态 - 创作
      prompt: '',
      selectedModel: 'gemini-2.5-flash-image-preview',
      aspectRatio: '1:1',
      selectedStyle: 'realistic',
      batchCount: 1,
      generatedImages: [],
      
      // 初始状态 - UI
      theme: 'dark', // 默认深色模式
      language: 'zh', // 默认中文
      
      // 实现 - 用户
      setUser: (user) => set({ user }),
      
      setSubscription: (subscription) => set({ subscription }),
      
      updateQuota: (action) => {
        const { quota, subscription } = get();
        
        // 检查是否需要重置配额
        if (Date.now() > quota.resetAt) {
          // 重置配额
          const newQuota = { ...DEFAULT_QUOTA, resetAt: Date.now() + 24 * 60 * 60 * 1000 };
          
          // 根据订阅等级调整限制
          if (subscription.tier === 'pro') {
            newQuota.generate.limit = 500 / 30; // 每月500次，约每天16次
            newQuota.edit.limit = 200 / 30;     // 每月200次，约每天6次
          } else if (subscription.tier === 'team') {
            newQuota.generate.limit = 9999; // 无限（实际会有公平使用限制）
            newQuota.edit.limit = 9999;
          }
          
          set({ quota: newQuota });
          return;
        }
        
        // 增加使用量
        set((state) => ({
          quota: {
            ...state.quota,
            [action]: {
              ...state.quota[action],
              used: state.quota[action].used + 1
            }
          }
        }));
      },
      
      // 实现 - 创作
      setPrompt: (prompt) => set({ prompt }),
      
      setSelectedModel: (model) => set({ selectedModel: model }),
      
      setAspectRatio: (ratio) => set({ aspectRatio: ratio }),
      
      setSelectedStyle: (style) => set({ selectedStyle: style }),
      
      setBatchCount: (count) => set({ batchCount: count }),
      
      addGeneratedImage: (image) => 
        set((state) => ({
          generatedImages: [image, ...state.generatedImages].slice(0, 50) // 限制50张
        })),
      
      removeGeneratedImage: (id) =>
        set((state) => ({
          generatedImages: state.generatedImages.filter((img) => img.id !== id)
        })),
      
      clearGeneratedImages: () => set({ generatedImages: [] }),
      
      // 实现 - UI
      setTheme: (theme) => set({ theme }),
      
      toggleTheme: () =>
        set((state) => ({
          theme: state.theme === 'light' ? 'dark' : 'light'
        })),
      
      setLanguage: (language) => set({ language }),
    }),
    {
      name: 'imagine-engine-store',
      // 只持久化部分状态
      partialize: (state) => ({
        theme: state.theme,
        language: state.language,
        selectedModel: state.selectedModel,
        aspectRatio: state.aspectRatio,
        selectedStyle: state.selectedStyle,
        batchCount: state.batchCount,
        // 不持久化：user, subscription, quota, generatedImages（这些从 IndexedDB 加载）
      })
    }
  )
);

// 便捷的 hooks
export const useUser = () => useAppStore((state) => state.user);
export const useSubscription = () => useAppStore((state) => state.subscription);
export const useQuota = () => useAppStore((state) => state.quota);
export const useThemeStore = () => ({
  theme: useAppStore((state) => state.theme),
  setTheme: useAppStore((state) => state.setTheme),
  toggleTheme: useAppStore((state) => state.toggleTheme),
});

