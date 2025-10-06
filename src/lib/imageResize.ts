/**
 * 图像尺寸调整工具
 * 基于nanobanana项目的实现，支持比例控制和尺寸保持
 */

// 比例配置
export const ASPECT_RATIOS = {
  '1:1': { width: 1024, height: 1024 },
  '4:3': { width: 1024, height: 768 },
  '3:4': { width: 768, height: 1024 },
  '16:9': { width: 1024, height: 576 }
};

/**
 * 根据比例生成白色背景图片
 * 实现nanobanana中提到的比例控制逻辑
 */
export function generateWhiteBackgroundImage(aspectRatio: string): string {
  const dimensions = ASPECT_RATIOS[aspectRatio as keyof typeof ASPECT_RATIOS] || ASPECT_RATIOS['1:1'];
  
  // 创建Canvas
  const canvas = document.createElement('canvas');
  canvas.width = dimensions.width;
  canvas.height = dimensions.height;
  
  const ctx = canvas.getContext('2d');
  if (!ctx) {
    throw new Error('无法创建Canvas上下文');
  }
  
  // 填充白色背景
  ctx.fillStyle = '#FFFFFF';
  ctx.fillRect(0, 0, dimensions.width, dimensions.height);
  
  // 返回data URL
  return canvas.toDataURL('image/png');
}

/**
 * 客户端图像尺寸调整
 * 基于nanobanana的前端回退策略
 */
export function resizeImageOnClient(
  imageDataUrl: string, 
  targetWidth: number, 
  targetHeight: number
): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    
    img.onload = () => {
      try {
        const canvas = document.createElement('canvas');
        canvas.width = targetWidth;
        canvas.height = targetHeight;
        
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          reject(new Error('无法创建Canvas上下文'));
          return;
        }
        
        // 计算缩放比例，保持宽高比
        const scaleX = targetWidth / img.width;
        const scaleY = targetHeight / img.height;
        const scale = Math.min(scaleX, scaleY);
        
        const scaledWidth = img.width * scale;
        const scaledHeight = img.height * scale;
        
        // 居中绘制
        const offsetX = (targetWidth - scaledWidth) / 2;
        const offsetY = (targetHeight - scaledHeight) / 2;
        
        // 填充白色背景
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(0, 0, targetWidth, targetHeight);
        
        // 绘制调整后的图像
        ctx.drawImage(img, offsetX, offsetY, scaledWidth, scaledHeight);
        
        // 返回调整后的data URL
        resolve(canvas.toDataURL('image/png', 0.9));
        
      } catch (error) {
        reject(error);
      }
    };
    
    img.onerror = () => {
      reject(new Error('图像加载失败'));
    };
    
    img.src = imageDataUrl;
  });
}

/**
 * 检测图像尺寸
 */
export function getImageDimensions(imageDataUrl: string): Promise<{width: number, height: number}> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    
    img.onload = () => {
      resolve({
        width: img.width,
        height: img.height
      });
    };
    
    img.onerror = () => {
      reject(new Error('无法获取图像尺寸'));
    };
    
    img.src = imageDataUrl;
  });
}

/**
 * 下载图像文件
 * 基于nanobanana的简化下载逻辑
 */
export function downloadImage(imageUrl: string, filename: string = 'image.png'): void {
  try {
    if (imageUrl.startsWith('data:')) {
      // 直接下载data URL
      const link = document.createElement('a');
      link.href = imageUrl;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } else {
      // 下载外部URL
      fetch(imageUrl)
        .then(response => response.blob())
        .then(blob => {
          const blobUrl = URL.createObjectURL(blob);
          const link = document.createElement('a');
          link.href = blobUrl;
          link.download = filename;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          URL.revokeObjectURL(blobUrl);
        })
        .catch(error => {
          console.error('下载失败:', error);
          // 回退到直接打开链接
          window.open(imageUrl, '_blank');
        });
    }
  } catch (error) {
    console.error('下载失败:', error);
    // 最后的回退方案
    window.open(imageUrl, '_blank');
  }
}

/**
 * 图像质量优化
 * 基于nanobanana的图像预处理逻辑
 */
export function optimizeImageForProcessing(imageDataUrl: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    
    img.onload = () => {
      try {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        
        if (!ctx) {
          reject(new Error('无法创建Canvas上下文'));
          return;
        }
        
        // 限制最大尺寸以提高处理速度
        const maxSize = 2048;
        let { width, height } = img;
        
        if (width > maxSize || height > maxSize) {
          const scale = Math.min(maxSize / width, maxSize / height);
          width *= scale;
          height *= scale;
        }
        
        canvas.width = width;
        canvas.height = height;
        
        // 绘制优化后的图像
        ctx.drawImage(img, 0, 0, width, height);
        
        // 返回优化后的data URL
        resolve(canvas.toDataURL('image/jpeg', 0.85));
        
      } catch (error) {
        reject(error);
      }
    };
    
    img.onerror = () => {
      reject(new Error('图像优化失败'));
    };
    
    img.src = imageDataUrl;
  });
}