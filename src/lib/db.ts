/**
 * IndexedDB 数据库封装
 * 使用 Dexie 进行本地数据持久化
 */

import Dexie, { Table } from 'dexie';

// 作品接口
export interface Artwork {
  id?: number;
  userId: string | null; // null 表示未登录用户
  prompt: string;
  model: string;
  aspectRatio: string;
  style: string;
  imageUrl: string;
  thumbnail?: string; // 缩略图（小尺寸，快速加载）
  blurHash?: string;  // 模糊占位符
  parameters?: Record<string, any>; // 其他参数
  timestamp: number;
  syncedToCloud: boolean;
  tags?: string[];
}

// 模板接口
export interface Template {
  id?: number;
  userId: string | null;
  title: string;
  prompt: string;
  category: string;
  featured: boolean;
  uses: number;
  createdAt: number;
  updatedAt: number;
}

// 数据库类
export class ImagineDB extends Dexie {
  artworks!: Table<Artwork, number>;
  templates!: Table<Template, number>;

  constructor() {
    super('ImagineEngineDB');
    
    // 定义数据库结构（版本 1）
    this.version(1).stores({
      artworks: '++id, userId, timestamp, model, aspectRatio, [userId+timestamp]',
      templates: '++id, userId, category, featured, createdAt'
    });
  }
}

// 创建数据库实例
export const db = new ImagineDB();

// === 作品相关操作 ===

/**
 * 保存作品到本地数据库
 */
export async function saveArtwork(artwork: Omit<Artwork, 'id' | 'syncedToCloud'>): Promise<number> {
  try {
    const id = await db.artworks.add({
      ...artwork,
      syncedToCloud: false,
      timestamp: artwork.timestamp || Date.now()
    });
    
    console.log(`💾 作品已保存到 IndexedDB (ID: ${id})`);
    
    // 异步同步到云端（如果用户已登录）
    if (artwork.userId) {
      syncArtworkToCloud(id).catch(err => 
        console.warn('云端同步失败（后台重试）:', err)
      );
    }
    
    return id;
  } catch (error) {
    console.error('保存作品失败:', error);
    throw error;
  }
}

/**
 * 获取所有作品（分页）
 */
export async function getArtworks(
  userId: string | null,
  limit: number = 50,
  offset: number = 0
): Promise<Artwork[]> {
  try {
    const query = userId 
      ? db.artworks.where('userId').equals(userId)
      : db.artworks.where('userId').equals(null);
    
    const artworks = await query
      .reverse() // 最新的在前
      .offset(offset)
      .limit(limit)
      .toArray();
    
    console.log(`📚 加载了 ${artworks.length} 张作品`);
    return artworks;
  } catch (error) {
    console.error('加载作品失败:', error);
    return [];
  }
}

/**
 * 删除作品
 */
export async function deleteArtwork(id: number): Promise<void> {
  try {
    await db.artworks.delete(id);
    console.log(`🗑️ 作品已删除 (ID: ${id})`);
  } catch (error) {
    console.error('删除作品失败:', error);
    throw error;
  }
}

/**
 * 清空所有作品
 */
export async function clearAllArtworks(userId: string | null): Promise<void> {
  try {
    const query = userId
      ? db.artworks.where('userId').equals(userId)
      : db.artworks.where('userId').equals(null);
    
    const count = await query.delete();
    console.log(`🗑️ 已清空 ${count} 张作品`);
  } catch (error) {
    console.error('清空作品失败:', error);
    throw error;
  }
}

/**
 * 生成缩略图
 */
export async function generateThumbnail(
  imageUrl: string,
  maxWidth: number = 200,
  maxHeight: number = 200
): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    
    img.onload = () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      
      if (!ctx) {
        reject(new Error('无法创建 Canvas 上下文'));
        return;
      }
      
      // 计算缩放比例
      const scale = Math.min(maxWidth / img.width, maxHeight / img.height);
      canvas.width = img.width * scale;
      canvas.height = img.height * scale;
      
      // 绘制缩略图
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      
      // 转换为 Data URL（低质量，减小体积）
      const thumbnailUrl = canvas.toDataURL('image/jpeg', 0.6);
      resolve(thumbnailUrl);
    };
    
    img.onerror = () => reject(new Error('图片加载失败'));
    img.src = imageUrl;
  });
}

// === 模板相关操作 ===

/**
 * 保存模板
 */
export async function saveTemplate(template: Omit<Template, 'id'>): Promise<number> {
  try {
    const id = await db.templates.add(template);
    console.log(`💾 模板已保存 (ID: ${id})`);
    return id;
  } catch (error) {
    console.error('保存模板失败:', error);
    throw error;
  }
}

/**
 * 获取模板列表
 */
export async function getTemplates(
  userId: string | null,
  category?: string
): Promise<Template[]> {
  try {
    let query = userId
      ? db.templates.where('userId').equals(userId)
      : db.templates.toCollection();
    
    if (category && category !== 'all') {
      query = query.filter(t => t.category === category);
    }
    
    const templates = await query.toArray();
    return templates;
  } catch (error) {
    console.error('加载模板失败:', error);
    return [];
  }
}

/**
 * 删除模板
 */
export async function deleteTemplate(id: number): Promise<void> {
  try {
    await db.templates.delete(id);
    console.log(`🗑️ 模板已删除 (ID: ${id})`);
  } catch (error) {
    console.error('删除模板失败:', error);
    throw error;
  }
}

// === 云端同步（占位，待 Supabase 集成） ===

/**
 * 同步作品到云端
 */
async function syncArtworkToCloud(artworkId: number): Promise<void> {
  // TODO: 实现 Supabase 同步逻辑
  console.log(`☁️ 作品同步到云端 (ID: ${artworkId}) - 待实现`);
}

// === 数据迁移工具 ===

/**
 * 从 localStorage 迁移作品到 IndexedDB
 */
export async function migrateFromLocalStorage(): Promise<void> {
  try {
    const oldData = localStorage.getItem('imagine-engine-generated-images');
    if (!oldData) {
      console.log('📝 没有需要迁移的旧数据');
      return;
    }
    
    const oldImages = JSON.parse(oldData) as Array<{ url: string; prompt: string; timestamp: number }>;
    
    console.log(`🔄 开始迁移 ${oldImages.length} 张作品...`);
    
    for (const oldImage of oldImages) {
      // 生成缩略图
      let thumbnail: string | undefined;
      try {
        thumbnail = await generateThumbnail(oldImage.url);
      } catch (err) {
        console.warn('缩略图生成失败，跳过:', err);
      }
      
      await db.artworks.add({
        userId: null,
        prompt: oldImage.prompt,
        model: 'unknown',
        aspectRatio: '1:1',
        style: 'realistic',
        imageUrl: oldImage.url,
        thumbnail,
        timestamp: oldImage.timestamp,
        syncedToCloud: false
      });
    }
    
    console.log(`✅ 迁移完成！已迁移 ${oldImages.length} 张作品`);
    
    // 备份旧数据
    localStorage.setItem('imagine-engine-generated-images-backup', oldData);
    // 清除旧数据
    localStorage.removeItem('imagine-engine-generated-images');
    
    console.log('📦 旧数据已备份并清除');
  } catch (error) {
    console.error('数据迁移失败:', error);
  }
}

// === 数据统计 ===

/**
 * 获取数据库统计信息
 */
export async function getDBStats() {
  const artworkCount = await db.artworks.count();
  const templateCount = await db.templates.count();
  const dbSize = await estimateDBSize();
  
  return {
    artworks: artworkCount,
    templates: templateCount,
    size: dbSize
  };
}

/**
 * 估算数据库大小
 */
async function estimateDBSize(): Promise<number> {
  if ('storage' in navigator && 'estimate' in navigator.storage) {
    const estimate = await navigator.storage.estimate();
    return estimate.usage || 0;
  }
  return 0;
}

