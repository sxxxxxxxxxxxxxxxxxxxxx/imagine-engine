/**
 * 转换脚本：将 gpt4o-image-prompts 的 prompts.json 转换为 ShowcaseCase 格式
 */

const fs = require('fs');
const path = require('path');

// 标签到分类的映射
function tagToCategory(tags) {
  const tagStr = tags.join(' ').toLowerCase();
  
  if (tagStr.includes('portrait') || tagStr.includes('character') || tagStr.includes('fashion')) {
    return 'portrait';
  }
  if (tagStr.includes('landscape') || tagStr.includes('nature') || tagStr.includes('interior') || tagStr.includes('architecture')) {
    return 'landscape';
  }
  if (tagStr.includes('product') || tagStr.includes('branding') || tagStr.includes('logo')) {
    return 'product';
  }
  if (tagStr.includes('art') || tagStr.includes('illustration') || tagStr.includes('cartoon') || tagStr.includes('creative')) {
    return 'art';
  }
  if (tagStr.includes('fusion') || tagStr.includes('mix')) {
    return 'fusion';
  }
  if (tagStr.includes('edit') || tagStr.includes('photography') || tagStr.includes('retro')) {
    return 'edit';
  }
  
  return 'art';
}

// 根据提示词长度和复杂度判断难度
function determineDifficulty(prompt) {
  const length = prompt.length;
  const hasComplexInstructions = prompt.includes('{') || prompt.includes('[') || prompt.includes('instruction');
  
  if (length < 200 && !hasComplexInstructions) {
    return 'easy';
  }
  if (length < 800 && !hasComplexInstructions) {
    return 'medium';
  }
  return 'hard';
}

// 提取英文和中文提示词
function extractPrompts(prompts) {
  if (prompts.length >= 2) {
    const hasChinese = (str) => /[\u4e00-\u9fa5]/.test(str);
    
    const first = prompts[0];
    const second = prompts[1];
    
    if (hasChinese(first) && !hasChinese(second)) {
      return { prompt: first, promptEn: second };
    } else if (!hasChinese(first) && hasChinese(second)) {
      return { promptEn: first, prompt: second };
    } else {
      return { promptEn: first, prompt: second };
    }
  }
  
  const single = prompts[0] || '';
  const isChinese = /[\u4e00-\u9fa5]/.test(single);
  
  if (isChinese) {
    return { prompt: single, promptEn: single };
  } else {
    return { promptEn: single, prompt: single };
  }
}

// GitHub Raw URL 基础路径
// 使用正确的仓库地址: https://github.com/songguoxs/gpt4o-image-prompts
const GITHUB_RAW_BASE = 'https://raw.githubusercontent.com/songguoxs/gpt4o-image-prompts/master';

// 转换单个项目
function convertItem(item, startId) {
  const { prompt, promptEn } = extractPrompts(item.prompts);
  
  // 处理图片路径
  const inputImages = item.images
    .filter(img => img !== item.coverImage)
    .map(img => {
      if (img.startsWith('http')) return img;
      if (img.startsWith('images/')) {
        return `${GITHUB_RAW_BASE}/${img}`;
      }
      return `${GITHUB_RAW_BASE}/images/${img}`;
    });
  
  const outputImage = item.coverImage
    ? (item.coverImage.startsWith('http') 
        ? item.coverImage 
        : item.coverImage.startsWith('images/')
          ? `${GITHUB_RAW_BASE}/${item.coverImage}`
          : `${GITHUB_RAW_BASE}/images/${item.coverImage}`)
    : (item.images[0] 
        ? (item.images[0].startsWith('http')
            ? item.images[0]
            : item.images[0].startsWith('images/')
              ? `${GITHUB_RAW_BASE}/${item.images[0]}`
              : `${GITHUB_RAW_BASE}/images/${item.images[0]}`)
        : '');

  const description = item.description || item.title;
  const descriptionEn = item.title;

  return {
    id: startId + item.id,
    title: item.title,
    titleEn: item.title,
    description,
    descriptionEn,
    inputImages,
    outputImage,
    prompt,
    promptEn,
    category: tagToCategory(item.tags || []),
    difficulty: determineDifficulty(prompt),
    tags: item.tags || [],
    author: item.source?.name || 'Unknown',
    modelUsed: item.model || 'Unknown',
    requiresInput: inputImages.length > 0,
    featured: false,
  };
}

// 主函数
function main() {
  const promptsPath = 'C:/Users/34023/Desktop/gpt4o-image-prompts-master/gpt4o-image-prompts-master/data/prompts.json';
  const outputPath = path.join(__dirname, '..', 'src', 'data', 'gpt4oPromptsCases.ts');
  
  if (!fs.existsSync(promptsPath)) {
    console.error(`❌ 找不到 prompts.json 文件: ${promptsPath}`);
    process.exit(1);
  }

  console.log('📖 读取 prompts.json...');
  const data = JSON.parse(fs.readFileSync(promptsPath, 'utf-8'));
  const items = data.items || [];
  
  console.log(`📊 找到 ${items.length} 个提示词案例`);
  
  // 从 111 开始(现有案例到 110)
  const START_ID = 111;
  const convertedCases = items.map(item => convertItem(item, START_ID - 1));
  
  // 生成 TypeScript 文件
  const tsContent = `/**
 * GPT-4o 图片提示词案例数据
 * 来源: https://github.com/songguoxs/gpt4o-image-prompts
 * 
 * 自动生成于: ${new Date().toISOString()}
 * 共 ${convertedCases.length} 个案例
 */

import { ShowcaseCase } from './showcaseCases';

export const gpt4oPromptsCases: ShowcaseCase[] = ${JSON.stringify(convertedCases, null, 2)};
`;

  // 确保目录存在
  const outputDir = path.dirname(outputPath);
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  fs.writeFileSync(outputPath, tsContent, 'utf-8');
  
  console.log(`✅ 转换完成! 生成 ${convertedCases.length} 个案例`);
  console.log(`📁 输出文件: ${outputPath}`);
  console.log(`\n💡 下一步: 在 showcaseCases.ts 中导入并合并这些数据`);
}

main();

