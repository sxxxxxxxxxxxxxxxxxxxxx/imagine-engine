/**
 * 最近使用的工具管理
 * 使用 localStorage 存储用户最近使用的工具列表
 */

export interface RecentTool {
  id: string;
  name: string;
  path: string;
  timestamp: number;
  usageCount: number;
}

const STORAGE_KEY = 'imagine-engine-recent-tools';
const MAX_RECENT_TOOLS = 5; // 最多保存5个最近使用的工具

/**
 * 获取最近使用的工具列表
 */
export function getRecentTools(): RecentTool[] {
  if (typeof window === 'undefined') return [];
  
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return [];
    
    const tools: RecentTool[] = JSON.parse(stored);
    // 按使用时间倒序排列
    return tools.sort((a, b) => b.timestamp - a.timestamp).slice(0, MAX_RECENT_TOOLS);
  } catch (error) {
    console.error('获取最近使用的工具失败:', error);
    return [];
  }
}

/**
 * 记录工具使用
 */
export function recordToolUsage(toolId: string, toolName: string, toolPath: string) {
  if (typeof window === 'undefined') return;
  
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    let tools: RecentTool[] = stored ? JSON.parse(stored) : [];
    
    // 查找是否已存在
    const existingIndex = tools.findIndex(t => t.id === toolId);
    
    if (existingIndex >= 0) {
      // 更新现有工具
      tools[existingIndex].timestamp = Date.now();
      tools[existingIndex].usageCount += 1;
    } else {
      // 添加新工具
      tools.push({
        id: toolId,
        name: toolName,
        path: toolPath,
        timestamp: Date.now(),
        usageCount: 1
      });
    }
    
    // 按时间排序并限制数量
    tools = tools.sort((a, b) => b.timestamp - a.timestamp).slice(0, MAX_RECENT_TOOLS);
    
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tools));
  } catch (error) {
    console.error('记录工具使用失败:', error);
  }
}

/**
 * 清除最近使用的工具
 */
export function clearRecentTools() {
  if (typeof window === 'undefined') return;
  
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.error('清除最近使用的工具失败:', error);
  }
}

