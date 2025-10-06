/**
 * 分辨率保持工具库
 * 借鉴 nanobanana 项目的无损修图技术
 * 
 * 核心功能：
 * 1. 记录原始图片尺寸
 * 2. AI编辑后自动调整回原始尺寸
 * 3. 两步缩放算法（速度+质量优化）
 * 4. 下载时确保分辨率一致
 */

export interface ImageDimensions {
  width: number;
  height: number;
}

/**
 * 获取图片的原始尺寸
 * @param imageDataUrl - 图片的 Data URL
 * @returns Promise<ImageDimensions>
 */
export function getImageDimensions(imageDataUrl: string): Promise<ImageDimensions> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    
    img.onload = () => {
      resolve({
        width: img.naturalWidth,
        height: img.naturalHeight
      });
    };
    
    img.onerror = () => {
      reject(new Error('无法加载图片'));
    };
    
    img.src = imageDataUrl;
  });
}

/**
 * 快速调整图片尺寸到目标分辨率
 * 使用 Canvas API 实现高质量缩放
 * 
 * @param imageUrl - 图片URL（Data URL 或 HTTP URL）
 * @param targetWidth - 目标宽度
 * @param targetHeight - 目标高度
 * @returns Promise<string> - 调整后的 Data URL
 */
export async function resizeImageToOriginal(
  imageUrl: string,
  targetWidth: number,
  targetHeight: number
): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    
    // 超时处理
    const timeout = setTimeout(() => {
      reject(new Error('图片加载超时'));
    }, 10000);
    
    img.onload = () => {
      clearTimeout(timeout);
      
      try {
        // 快速检查：尺寸已匹配，无需调整
        if (img.naturalWidth === targetWidth && img.naturalHeight === targetHeight) {
          console.log('✅ 图片尺寸已匹配，无需调整');
          resolve(imageUrl);
          return;
        }
        
        console.log(`📐 调整图片尺寸: ${img.naturalWidth}×${img.naturalHeight} → ${targetWidth}×${targetHeight}`);
        
        // 判断是否需要两步缩放（大尺寸变化时使用）
        const needsTwoStep = 
          img.naturalWidth > targetWidth * 2 || 
          img.naturalHeight > targetHeight * 2;
        
        let resizedDataUrl: string;
        
        if (needsTwoStep) {
          // 🚀 两步缩放：先快速缩放到中间尺寸，再精细缩放到目标尺寸
          resizedDataUrl = twoStepResize(img, targetWidth, targetHeight);
        } else {
          // 直接缩放
          resizedDataUrl = directResize(img, targetWidth, targetHeight);
        }
        
        console.log('✅ 图片尺寸调整完成');
        resolve(resizedDataUrl);
        
      } catch (error) {
        console.error('❌ 图片处理失败:', error);
        reject(error);
      }
    };
    
    img.onerror = () => {
      clearTimeout(timeout);
      reject(new Error('图片加载失败'));
    };
    
    img.src = imageUrl;
  });
}

/**
 * 两步缩放算法（质量+速度优化）
 * 适用于大尺寸变化
 */
function twoStepResize(
  img: HTMLImageElement,
  targetWidth: number,
  targetHeight: number
): string {
  // 第一步：快速缩放到中间尺寸
  const intermediateWidth = Math.max(targetWidth, Math.floor(img.naturalWidth / 2));
  const intermediateHeight = Math.max(targetHeight, Math.floor(img.naturalHeight / 2));
  
  const tempCanvas = document.createElement('canvas');
  tempCanvas.width = intermediateWidth;
  tempCanvas.height = intermediateHeight;
  
  const tempCtx = tempCanvas.getContext('2d', {
    alpha: true,
    desynchronized: true,
    willReadFrequently: false
  });
  
  if (!tempCtx) {
    throw new Error('无法创建 Canvas 上下文');
  }
  
  tempCtx.imageSmoothingEnabled = true;
  tempCtx.imageSmoothingQuality = 'medium'; // 中等质量，速度快
  tempCtx.drawImage(img, 0, 0, intermediateWidth, intermediateHeight);
  
  // 第二步：精细缩放到目标尺寸
  const finalCanvas = document.createElement('canvas');
  finalCanvas.width = targetWidth;
  finalCanvas.height = targetHeight;
  
  const finalCtx = finalCanvas.getContext('2d', {
    alpha: true,
    desynchronized: true,
    willReadFrequently: false
  });
  
  if (!finalCtx) {
    throw new Error('无法创建 Canvas 上下文');
  }
  
  finalCtx.imageSmoothingEnabled = true;
  finalCtx.imageSmoothingQuality = 'high'; // 高质量
  finalCtx.drawImage(tempCanvas, 0, 0, targetWidth, targetHeight);
  
  // 返回高质量 JPEG（95%质量）
  return finalCanvas.toDataURL('image/png', 0.95);
}

/**
 * 直接缩放（适用于小尺寸变化）
 */
function directResize(
  img: HTMLImageElement,
  targetWidth: number,
  targetHeight: number
): string {
  const canvas = document.createElement('canvas');
  canvas.width = targetWidth;
  canvas.height = targetHeight;
  
  const ctx = canvas.getContext('2d', {
    alpha: true,
    desynchronized: true,
    willReadFrequently: false
  });
  
  if (!ctx) {
    throw new Error('无法创建 Canvas 上下文');
  }
  
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = 'high';
  ctx.drawImage(img, 0, 0, targetWidth, targetHeight);
  
  return canvas.toDataURL('image/png', 0.95);
}

/**
 * 下载图片并保持原始分辨率
 * @param imageUrl - 图片URL
 * @param originalDimensions - 原始尺寸
 * @param filename - 文件名（可选）
 */
export async function downloadWithOriginalResolution(
  imageUrl: string,
  originalDimensions?: ImageDimensions,
  filename?: string
): Promise<void> {
  try {
    let downloadUrl = imageUrl;
    
    // 如果有原始尺寸信息，先调整尺寸
    if (originalDimensions) {
      console.log(`📥 下载前调整到原始尺寸: ${originalDimensions.width}×${originalDimensions.height}`);
      downloadUrl = await resizeImageToOriginal(
        imageUrl,
        originalDimensions.width,
        originalDimensions.height
      );
    }
    
    // 执行下载
    if (downloadUrl.startsWith('data:')) {
      // Data URL 直接下载
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = filename || generateFilename(originalDimensions);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } else {
      // HTTP URL 先转换为 Blob
      const response = await fetch(downloadUrl);
      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(blob);
      
      const link = document.createElement('a');
      link.href = blobUrl;
      link.download = filename || generateFilename(originalDimensions);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      // 清理
      setTimeout(() => window.URL.revokeObjectURL(blobUrl), 1000);
    }
    
    console.log('✅ 下载完成');
  } catch (error) {
    console.error('❌ 下载失败:', error);
    // 降级：直接打开图片
    window.open(imageUrl, '_blank');
  }
}

/**
 * 生成文件名（类似相机拍摄）
 */
function generateFilename(dimensions?: ImageDimensions): string {
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
  
  if (dimensions) {
    return `IMG_${timestamp}_${dimensions.width}x${dimensions.height}.png`;
  }
  
  return `IMG_${timestamp}.png`;
}

/**
 * 检查图片尺寸是否需要调整
 */
export async function needsResizing(
  imageUrl: string,
  targetDimensions: ImageDimensions
): Promise<boolean> {
  try {
    const actualDimensions = await getImageDimensions(imageUrl);
    return (
      actualDimensions.width !== targetDimensions.width ||
      actualDimensions.height !== targetDimensions.height
    );
  } catch {
    return false;
  }
}
