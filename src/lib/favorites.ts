/**
 * 收藏功能管理
 * 使用 localStorage 存储用户收藏的图片
 */

export interface FavoriteImage {
  id: string;
  url: string;
  prompt?: string;
  timestamp: number;
  tags?: string[];
}

const STORAGE_KEY = 'imagine-engine-favorites';

/**
 * 获取所有收藏
 */
export function getFavorites(): FavoriteImage[] {
  if (typeof window === 'undefined') return [];
  
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return [];
    
    const favorites: FavoriteImage[] = JSON.parse(stored);
    // 按时间倒序排列
    return favorites.sort((a, b) => b.timestamp - a.timestamp);
  } catch (error) {
    console.error('获取收藏失败:', error);
    return [];
  }
}

/**
 * 检查是否已收藏
 */
export function isFavorite(imageId: string): boolean {
  if (typeof window === 'undefined') return false;
  
  try {
    const favorites = getFavorites();
    return favorites.some(f => f.id === imageId);
  } catch (error) {
    console.error('检查收藏状态失败:', error);
    return false;
  }
}

/**
 * 添加收藏
 */
export function addFavorite(image: FavoriteImage): boolean {
  if (typeof window === 'undefined') return false;
  
  try {
    const favorites = getFavorites();
    
    // 检查是否已存在
    if (favorites.some(f => f.id === image.id)) {
      return false; // 已收藏
    }
    
    favorites.push({
      ...image,
      timestamp: Date.now()
    });
    
    localStorage.setItem(STORAGE_KEY, JSON.stringify(favorites));
    return true;
  } catch (error) {
    console.error('添加收藏失败:', error);
    return false;
  }
}

/**
 * 移除收藏
 */
export function removeFavorite(imageId: string): boolean {
  if (typeof window === 'undefined') return false;
  
  try {
    const favorites = getFavorites();
    const filtered = favorites.filter(f => f.id !== imageId);
    
    if (filtered.length === favorites.length) {
      return false; // 未找到
    }
    
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
    return true;
  } catch (error) {
    console.error('移除收藏失败:', error);
    return false;
  }
}

/**
 * 切换收藏状态
 */
export function toggleFavorite(image: FavoriteImage): boolean {
  if (isFavorite(image.id)) {
    return removeFavorite(image.id);
  } else {
    return addFavorite(image);
  }
}

/**
 * 清除所有收藏
 */
export function clearFavorites() {
  if (typeof window === 'undefined') return;
  
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.error('清除收藏失败:', error);
  }
}

