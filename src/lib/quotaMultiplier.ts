/**
 * 配额倍数计算工具
 * 根据模型ID计算配额扣费的倍数
 */

/**
 * 根据模型ID计算配额倍数
 * @param modelId 模型ID（如 'gemini-3-pro-image-preview'）
 * @returns 配额倍数（1, 2, 或 4）
 */
export function getQuotaMultiplier(modelId: string | undefined | null): number {
  if (!modelId) {
    return 1; // 默认1倍
  }

  const model = modelId.toLowerCase();

  // gemini-3-pro-image-preview-4k: 4倍配额
  if (model.includes('gemini-3') && model.includes('4k')) {
    return 4;
  }

  // 其他 gemini-3.0 系列模型: 2倍配额
  // 包括: gemini-3-pro-image-preview, gemini-3-pro-image-preview-2k 等
  if (model.includes('gemini-3')) {
    return 2;
  }

  // 其他模型: 1倍配额
  return 1;
}

/**
 * 计算实际需要扣减的配额数量
 * @param baseAmount 基础配额数量（通常是1）
 * @param modelId 模型ID
 * @returns 实际需要扣减的配额数量
 */
export function calculateQuotaCost(baseAmount: number, modelId: string | undefined | null): number {
  const multiplier = getQuotaMultiplier(modelId);
  return baseAmount * multiplier;
}

/**
 * 获取模型配额倍数的描述文本
 * @param modelId 模型ID
 * @returns 描述文本（如 "消耗1张配额" 或 "消耗2张配额"）
 */
export function getQuotaCostDescription(modelId: string | undefined | null, language: 'zh' | 'en' = 'zh'): string {
  const multiplier = getQuotaMultiplier(modelId);
  
  if (language === 'zh') {
    if (multiplier === 1) {
      return '消耗1张配额';
    } else if (multiplier === 2) {
      return '消耗2张配额';
    } else if (multiplier === 4) {
      return '消耗4张配额';
    }
    return `消耗${multiplier}张配额`;
  } else {
    if (multiplier === 1) {
      return 'Consumes 1 quota';
    } else if (multiplier === 2) {
      return 'Consumes 2 quota';
    } else if (multiplier === 4) {
      return 'Consumes 4 quota';
    }
    return `Consumes ${multiplier} quota`;
  }
}

