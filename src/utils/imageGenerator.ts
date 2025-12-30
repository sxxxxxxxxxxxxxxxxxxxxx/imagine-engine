/**
 * 图片生成工具函数
 * 用于创建指定尺寸的空白图片，以控制AI生成的图片比例
 */

export interface AspectRatioDimensions {
  width: number;
  height: number;
  ratio: string;
}

/**
 * 根据比例获取对应的尺寸
 */
export function getAspectRatioDimensions(ratio: string): AspectRatioDimensions {
  const ratioMap: Record<string, AspectRatioDimensions> = {
    '1:1': { width: 1024, height: 1024, ratio: '1:1' },
    '16:9': { width: 1920, height: 1080, ratio: '16:9' },
    '9:16': { width: 1080, height: 1920, ratio: '9:16' },
    '4:3': { width: 1024, height: 768, ratio: '4:3' },
    '3:4': { width: 768, height: 1024, ratio: '3:4' },
  };

  return ratioMap[ratio] || ratioMap['1:1'];
}

/**
 * 创建指定尺寸的空白图片（白色背景）
 * @param width - 图片宽度
 * @param height - 图片高度
 * @param backgroundColor - 背景颜色（默认白色）
 * @returns Base64 格式的图片数据
 */
export function createBlankImage(
  width: number,
  height: number,
  backgroundColor: string = '#FFFFFF'
): string {
  // 创建离屏 canvas
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;

  const ctx = canvas.getContext('2d');
  if (!ctx) {
    throw new Error('无法创建 Canvas 上下文');
  }

  // 填充背景色
  ctx.fillStyle = backgroundColor;
  ctx.fillRect(0, 0, width, height);

  // 转换为 Base64 格式（JPEG 格式，减小数据量）
  return canvas.toDataURL('image/jpeg', 0.95);
}

/**
 * 根据比例创建空白基础图片（画布）
 * @param ratio - 比例字符串 ('1:1', '16:9' 等)
 * @param backgroundColor - 背景颜色（默认浅灰色，让AI更容易识别）
 * @returns Base64 格式的空白图片
 */
export function createBlankImageByRatio(
  ratio: string,
  backgroundColor: string = '#F5F5F5'  // 使用浅灰色而非纯白，便于AI识别
): string {
  const dimensions = getAspectRatioDimensions(ratio);
  console.log(`🎨 创建空白画布: ${dimensions.width}×${dimensions.height} (${ratio})`);
  
  const canvas = document.createElement('canvas');
  canvas.width = dimensions.width;
  canvas.height = dimensions.height;

  const ctx = canvas.getContext('2d');
  if (!ctx) {
    throw new Error('无法创建 Canvas 上下文');
  }

  // 填充浅灰色背景
  ctx.fillStyle = backgroundColor;
  ctx.fillRect(0, 0, dimensions.width, dimensions.height);

  // 🎯 添加细微的边框，让AI明确识别这是一个画布边界
  ctx.strokeStyle = '#E0E0E0';
  ctx.lineWidth = 2;
  ctx.strokeRect(1, 1, dimensions.width - 2, dimensions.height - 2);

  const blankImage = canvas.toDataURL('image/jpeg', 0.95);
  
  console.log(`✅ 空白画布创建成功 (${dimensions.width}×${dimensions.height})，用于控制AI生成比例`);
  return blankImage;
}

/**
 * 创建带提示文字的空白图片（可选，方便调试）
 * @param ratio - 比例字符串
 * @returns Base64 格式的图片
 */
export function createBlankImageWithText(ratio: string): string {
  const dimensions = getAspectRatioDimensions(ratio);
  const canvas = document.createElement('canvas');
  canvas.width = dimensions.width;
  canvas.height = dimensions.height;

  const ctx = canvas.getContext('2d');
  if (!ctx) {
    throw new Error('无法创建 Canvas 上下文');
  }

  // 白色背景
  ctx.fillStyle = '#FFFFFF';
  ctx.fillRect(0, 0, dimensions.width, dimensions.height);

  // 添加浅灰色提示文字（可选，调试用）
  ctx.fillStyle = '#F0F0F0';
  ctx.font = `${Math.floor(dimensions.width / 20)}px Arial`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(
    `${dimensions.width}×${dimensions.height}`,
    dimensions.width / 2,
    dimensions.height / 2
  );

  return canvas.toDataURL('image/jpeg', 0.95);
}

/**
 * 验证图片尺寸是否符合预期比例
 * @param imageUrl - 图片 URL
 * @param expectedRatio - 期望的比例
 * @returns Promise<boolean>
 */
export async function validateImageRatio(
  imageUrl: string,
  expectedRatio: string
): Promise<boolean> {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      const actualRatio = (img.naturalWidth / img.naturalHeight).toFixed(2);
      const expected = getAspectRatioDimensions(expectedRatio);
      const expectedRatioValue = (expected.width / expected.height).toFixed(2);
      
      const isValid = actualRatio === expectedRatioValue;
      console.log(`📐 比例验证: 实际=${actualRatio}, 期望=${expectedRatioValue}, 结果=${isValid ? '✅' : '❌'}`);
      resolve(isValid);
    };
    img.onerror = () => resolve(false);
    img.src = imageUrl;
  });
}

