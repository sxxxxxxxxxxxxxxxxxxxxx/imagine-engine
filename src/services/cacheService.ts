// IndexedDB 离线缓存服务
// 用于存储历史记录、生成的图片等数据

const DB_NAME = 'ImagineEngineDB';
const DB_VERSION = 1;
const IMAGES_STORE = 'images';
const HISTORY_STORE = 'history';
const PROJECTS_STORE = 'projects';

interface CachedImage {
  id: string;
  blob: Blob;
  timestamp: number;
  metadata?: {
    prompt?: string;
    size?: { width: number; height: number };
  };
}

interface HistoryRecord {
  id: string;
  type: 'generate' | 'edit' | 'fusion';
  imageId: string;
  prompt: string;
  timestamp: number;
  metadata?: any;
}

interface Project {
  id: string;
  name: string;
  createdAt: number;
  updatedAt: number;
  historyIds: string[];
}

class CacheService {
  private db: IDBDatabase | null = null;
  private initPromise: Promise<IDBDatabase> | null = null;

  // 初始化数据库
  async init(): Promise<IDBDatabase> {
    if (this.db) return this.db;
    if (this.initPromise) return this.initPromise;

    this.initPromise = new Promise((resolve, reject) => {
      const request = indexedDB.open(DB_NAME, DB_VERSION);

      request.onerror = () => {
        reject(new Error('Failed to open IndexedDB'));
      };

      request.onsuccess = () => {
        this.db = request.result;
        resolve(this.db);
      };

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;

        // 创建 images 存储
        if (!db.objectStoreNames.contains(IMAGES_STORE)) {
          const imageStore = db.createObjectStore(IMAGES_STORE, { keyPath: 'id' });
          imageStore.createIndex('timestamp', 'timestamp', { unique: false });
        }

        // 创建 history 存储
        if (!db.objectStoreNames.contains(HISTORY_STORE)) {
          const historyStore = db.createObjectStore(HISTORY_STORE, { keyPath: 'id' });
          historyStore.createIndex('timestamp', 'timestamp', { unique: false });
          historyStore.createIndex('type', 'type', { unique: false });
        }

        // 创建 projects 存储
        if (!db.objectStoreNames.contains(PROJECTS_STORE)) {
          const projectStore = db.createObjectStore(PROJECTS_STORE, { keyPath: 'id' });
          projectStore.createIndex('updatedAt', 'updatedAt', { unique: false });
        }
      };
    });

    return this.initPromise;
  }

  // === 图片缓存 ===

  async saveImage(id: string, imageBlob: Blob, metadata?: CachedImage['metadata']): Promise<void> {
    const db = await this.init();
    const transaction = db.transaction([IMAGES_STORE], 'readwrite');
    const store = transaction.objectStore(IMAGES_STORE);

    const cachedImage: CachedImage = {
      id,
      blob: imageBlob,
      timestamp: Date.now(),
      metadata
    };

    return new Promise((resolve, reject) => {
      const request = store.put(cachedImage);
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  async getImage(id: string): Promise<Blob | null> {
    const db = await this.init();
    const transaction = db.transaction([IMAGES_STORE], 'readonly');
    const store = transaction.objectStore(IMAGES_STORE);

    return new Promise((resolve, reject) => {
      const request = store.get(id);
      request.onsuccess = () => {
        const result = request.result as CachedImage | undefined;
        resolve(result?.blob || null);
      };
      request.onerror = () => reject(request.error);
    });
  }

  async deleteImage(id: string): Promise<void> {
    const db = await this.init();
    const transaction = db.transaction([IMAGES_STORE], 'readwrite');
    const store = transaction.objectStore(IMAGES_STORE);

    return new Promise((resolve, reject) => {
      const request = store.delete(id);
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  // === 历史记录 ===

  async saveHistory(record: HistoryRecord): Promise<void> {
    const db = await this.init();
    const transaction = db.transaction([HISTORY_STORE], 'readwrite');
    const store = transaction.objectStore(HISTORY_STORE);

    return new Promise((resolve, reject) => {
      const request = store.put(record);
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  async getAllHistory(): Promise<HistoryRecord[]> {
    const db = await this.init();
    const transaction = db.transaction([HISTORY_STORE], 'readonly');
    const store = transaction.objectStore(HISTORY_STORE);

    return new Promise((resolve, reject) => {
      const request = store.getAll();
      request.onsuccess = () => resolve(request.result || []);
      request.onerror = () => reject(request.error);
    });
  }

  async deleteHistory(id: string): Promise<void> {
    const db = await this.init();
    const transaction = db.transaction([HISTORY_STORE], 'readwrite');
    const store = transaction.objectStore(HISTORY_STORE);

    return new Promise((resolve, reject) => {
      const request = store.delete(id);
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  async clearAllHistory(): Promise<void> {
    const db = await this.init();
    const transaction = db.transaction([HISTORY_STORE], 'readwrite');
    const store = transaction.objectStore(HISTORY_STORE);

    return new Promise((resolve, reject) => {
      const request = store.clear();
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  // === 项目管理 ===

  async saveProject(project: Project): Promise<void> {
    const db = await this.init();
    const transaction = db.transaction([PROJECTS_STORE], 'readwrite');
    const store = transaction.objectStore(PROJECTS_STORE);

    return new Promise((resolve, reject) => {
      const request = store.put(project);
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  async getAllProjects(): Promise<Project[]> {
    const db = await this.init();
    const transaction = db.transaction([PROJECTS_STORE], 'readonly');
    const store = transaction.objectStore(PROJECTS_STORE);

    return new Promise((resolve, reject) => {
      const request = store.getAll();
      request.onsuccess = () => resolve(request.result || []);
      request.onerror = () => reject(request.error);
    });
  }

  async deleteProject(id: string): Promise<void> {
    const db = await this.init();
    const transaction = db.transaction([PROJECTS_STORE], 'readwrite');
    const store = transaction.objectStore(PROJECTS_STORE);

    return new Promise((resolve, reject) => {
      const request = store.delete(id);
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  // === 工具方法 ===

  // 获取存储使用情况
  async getStorageStats(): Promise<{
    imagesCount: number;
    historyCount: number;
    projectsCount: number;
  }> {
    const db = await this.init();
    
    const getCount = (storeName: string): Promise<number> => {
      return new Promise((resolve, reject) => {
        const transaction = db.transaction([storeName], 'readonly');
        const store = transaction.objectStore(storeName);
        const request = store.count();
        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error);
      });
    };

    const [imagesCount, historyCount, projectsCount] = await Promise.all([
      getCount(IMAGES_STORE),
      getCount(HISTORY_STORE),
      getCount(PROJECTS_STORE)
    ]);

    return { imagesCount, historyCount, projectsCount };
  }

  // 清理旧数据（保留最近30天）
  async cleanupOldData(daysToKeep: number = 30): Promise<number> {
    const db = await this.init();
    const cutoffTime = Date.now() - (daysToKeep * 24 * 60 * 60 * 1000);
    let deletedCount = 0;

    // 清理旧图片
    const imageTransaction = db.transaction([IMAGES_STORE], 'readwrite');
    const imageStore = imageTransaction.objectStore(IMAGES_STORE);
    const imageIndex = imageStore.index('timestamp');
    const imageRange = IDBKeyRange.upperBound(cutoffTime);

    await new Promise<void>((resolve, reject) => {
      const request = imageIndex.openCursor(imageRange);
      request.onsuccess = () => {
        const cursor = request.result;
        if (cursor) {
          imageStore.delete(cursor.primaryKey);
          deletedCount++;
          cursor.continue();
        } else {
          resolve();
        }
      };
      request.onerror = () => reject(request.error);
    });

    return deletedCount;
  }
}

// 导出单例
export const cacheService = new CacheService();

// 辅助函数：将 URL 转换为 Blob
export async function urlToBlob(url: string): Promise<Blob> {
  const response = await fetch(url);
  return await response.blob();
}

// 辅助函数：将 Blob 转换为 URL
export function blobToUrl(blob: Blob): string {
  return URL.createObjectURL(blob);
}

