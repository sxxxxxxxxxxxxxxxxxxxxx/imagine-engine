// 高级图片处理工具集

/**
 * 图片质量增强
 */
export async function enhanceImageQuality(
  imageUrl: string,
  options: {
    brightness?: number;    // -100 to 100
    contrast?: number;      // -100 to 100
    saturation?: number;    // -100 to 100
    sharpness?: number;     // 0 to 100
  } = {}
): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext('2d');
      
      if (!ctx) {
        reject(new Error('Failed to get canvas context'));
        return;
      }

      // 应用滤镜
      ctx.filter = `
        brightness(${100 + (options.brightness || 0)}%)
        contrast(${100 + (options.contrast || 0)}%)
        saturate(${100 + (options.saturation || 0)}%)
      `;
      
      ctx.drawImage(img, 0, 0);

      // 锐化处理（如果需要）
      if (options.sharpness && options.sharpness > 0) {
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const sharpened = applySharpen(imageData, options.sharpness / 100);
        ctx.putImageData(sharpened, 0, 0);
      }

      resolve(canvas.toDataURL('image/png'));
    };

    img.onerror = () => reject(new Error('Failed to load image'));
    img.src = imageUrl;
  });
}

/**
 * 锐化算法
 */
function applySharpen(imageData: ImageData, amount: number): ImageData {
  const data = imageData.data;
  const width = imageData.width;
  const height = imageData.height;
  const output = new ImageData(width, height);

  // 锐化卷积核
  const kernel = [
    0, -amount, 0,
    -amount, 1 + 4 * amount, -amount,
    0, -amount, 0
  ];

  for (let y = 1; y < height - 1; y++) {
    for (let x = 1; x < width - 1; x++) {
      for (let c = 0; c < 3; c++) {
        let sum = 0;
        for (let ky = -1; ky <= 1; ky++) {
          for (let kx = -1; kx <= 1; kx++) {
            const idx = ((y + ky) * width + (x + kx)) * 4 + c;
            const kernelIdx = (ky + 1) * 3 + (kx + 1);
            sum += data[idx] * kernel[kernelIdx];
          }
        }
        const outIdx = (y * width + x) * 4 + c;
        output.data[outIdx] = Math.max(0, Math.min(255, sum));
      }
      output.data[(y * width + x) * 4 + 3] = 255; // Alpha
    }
  }

  return output;
}

/**
 * 批量调整图片尺寸
 */
export async function batchResizeImages(
  imageUrls: string[],
  targetSize: { width: number; height: number }
): Promise<string[]> {
  return Promise.all(
    imageUrls.map(url => resizeImage(url, targetSize.width, targetSize.height))
  );
}

/**
 * 单张图片调整尺寸（高质量）
 */
export async function resizeImage(
  imageUrl: string,
  targetWidth: number,
  targetHeight: number
): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    
    img.onload = () => {
      // 使用两步缩放算法提升质量
      if (img.width > targetWidth * 2 || img.height > targetHeight * 2) {
        resolve(twoStepResize(img, targetWidth, targetHeight));
      } else {
        resolve(directResize(img, targetWidth, targetHeight));
      }
    };

    img.onerror = () => reject(new Error('Failed to load image'));
    img.src = imageUrl;
  });
}

/**
 * 两步缩放（大图优化）
 */
function twoStepResize(img: HTMLImageElement, targetWidth: number, targetHeight: number): string {
  // 第一步：缩放到中间尺寸
  const intermediateWidth = Math.max(targetWidth, img.width / 2);
  const intermediateHeight = Math.max(targetHeight, img.height / 2);

  const tempCanvas = document.createElement('canvas');
  tempCanvas.width = intermediateWidth;
  tempCanvas.height = intermediateHeight;
  const tempCtx = tempCanvas.getContext('2d', { 
    alpha: false, 
    desynchronized: true 
  });
  
  if (!tempCtx) throw new Error('Failed to get canvas context');
  
  tempCtx.imageSmoothingEnabled = true;
  tempCtx.imageSmoothingQuality = 'high';
  tempCtx.drawImage(img, 0, 0, intermediateWidth, intermediateHeight);

  // 第二步：缩放到目标尺寸
  return directResize(tempCanvas as any, targetWidth, targetHeight);
}

/**
 * 直接缩放
 */
function directResize(img: HTMLImageElement | HTMLCanvasElement, targetWidth: number, targetHeight: number): string {
  const canvas = document.createElement('canvas');
  canvas.width = targetWidth;
  canvas.height = targetHeight;
  const ctx = canvas.getContext('2d', { 
    alpha: false, 
    desynchronized: true 
  });
  
  if (!ctx) throw new Error('Failed to get canvas context');
  
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = 'high';
  ctx.drawImage(img, 0, 0, targetWidth, targetHeight);
  
  return canvas.toDataURL('image/png');
}

/**
 * 图片格式转换
 */
export async function convertImageFormat(
  imageUrl: string,
  format: 'png' | 'jpeg' | 'webp',
  quality: number = 0.92
): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext('2d');
      
      if (!ctx) {
        reject(new Error('Failed to get canvas context'));
        return;
      }

      ctx.drawImage(img, 0, 0);
      
      const mimeType = `image/${format}`;
      resolve(canvas.toDataURL(mimeType, quality));
    };

    img.onerror = () => reject(new Error('Failed to load image'));
    img.src = imageUrl;
  });
}

/**
 * 提取图片主色调
 */
export async function extractDominantColor(imageUrl: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    
    img.onload = () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      
      if (!ctx) {
        reject(new Error('Failed to get canvas context'));
        return;
      }

      // 缩小到10x10以快速处理
      canvas.width = 10;
      canvas.height = 10;
      ctx.drawImage(img, 0, 0, 10, 10);

      const imageData = ctx.getImageData(0, 0, 10, 10);
      const data = imageData.data;

      let r = 0, g = 0, b = 0;
      const pixelCount = data.length / 4;

      for (let i = 0; i < data.length; i += 4) {
        r += data[i];
        g += data[i + 1];
        b += data[i + 2];
      }

      r = Math.floor(r / pixelCount);
      g = Math.floor(g / pixelCount);
      b = Math.floor(b / pixelCount);

      resolve(`rgb(${r}, ${g}, ${b})`);
    };

    img.onerror = () => reject(new Error('Failed to load image'));
    img.src = imageUrl;
  });
}

/**
 * 图片裁剪
 */
export async function cropImage(
  imageUrl: string,
  cropArea: { x: number; y: number; width: number; height: number }
): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = cropArea.width;
      canvas.height = cropArea.height;
      const ctx = canvas.getContext('2d');
      
      if (!ctx) {
        reject(new Error('Failed to get canvas context'));
        return;
      }

      ctx.drawImage(
        img,
        cropArea.x, cropArea.y, cropArea.width, cropArea.height,
        0, 0, cropArea.width, cropArea.height
      );

      resolve(canvas.toDataURL('image/png'));
    };

    img.onerror = () => reject(new Error('Failed to load image'));
    img.src = imageUrl;
  });
}

/**
 * 图片合并（网格布局）
 */
export async function mergeImages(
  imageUrls: string[],
  layout: { cols: number; rows: number },
  spacing: number = 10
): Promise<string> {
  return new Promise((resolve, reject) => {
    let loadedCount = 0;
    const images: HTMLImageElement[] = [];

    imageUrls.forEach((url, index) => {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      
      img.onload = () => {
        images[index] = img;
        loadedCount++;
        
        if (loadedCount === imageUrls.length) {
          // 所有图片加载完成，开始合并
          const cellWidth = images[0].width;
          const cellHeight = images[0].height;
          const totalWidth = cellWidth * layout.cols + spacing * (layout.cols - 1);
          const totalHeight = cellHeight * layout.rows + spacing * (layout.rows - 1);

          const canvas = document.createElement('canvas');
          canvas.width = totalWidth;
          canvas.height = totalHeight;
          const ctx = canvas.getContext('2d');
          
          if (!ctx) {
            reject(new Error('Failed to get canvas context'));
            return;
          }

          // 填充背景
          ctx.fillStyle = '#ffffff';
          ctx.fillRect(0, 0, totalWidth, totalHeight);

          // 绘制图片
          images.forEach((img, index) => {
            const col = index % layout.cols;
            const row = Math.floor(index / layout.cols);
            const x = col * (cellWidth + spacing);
            const y = row * (cellHeight + spacing);
            ctx.drawImage(img, x, y);
          });

          resolve(canvas.toDataURL('image/png'));
        }
      };

      img.onerror = () => reject(new Error(`Failed to load image ${index}`));
      img.src = url;
    });
  });
}

