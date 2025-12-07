/**
 * 转换脚本：将 gpt4o-image-prompts 的 prompts.json 转换为 ShowcaseCase 格式
 * 
 * 使用方法：
 * 1. 将 prompts.json 放在项目根目录
 * 2. 运行: npx tsx scripts/convert-prompts-to-showcase.ts
 * 3. 输出文件: src/data/gpt4oPromptsCases.ts
 */

import * as fs from 'fs';
import * as path from 'path';

interface PromptItem {
  id: number;
  title: string;
  source: { name: string; url: string };
  model: string;
  images: string[];
  prompts: string[];
  tags: string[];
  coverImage: string;
  description?: string;
}

interface ShowcaseCase {
  id: number;
  title: string;
  titleEn: string;
  description: string;
  descriptionEn: string;
  inputImages: string[];
  outputImage: string;
  prompt: string;
  promptEn: string;
  category: 'portrait' | 'landscape' | 'product' | 'art' | 'fusion' | 'edit';
  difficulty: 'easy' | 'medium' | 'hard';
  tags: string[];
  author: string;
  modelUsed: string;
  requiresInput: boolean;
  featured: boolean;
}

// 标签到分类的映射
const tagToCategory = (tags: string[]): 'portrait' | 'landscape' | 'product' | 'art' | 'fusion' | 'edit' => {
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
  
  // 默认返回 art
  return 'art';
};

// 根据提示词长度和复杂度判断难度
const determineDifficulty = (prompt: string): 'easy' | 'medium' | 'hard' => {
  const length = prompt.length;
  const hasComplexInstructions = prompt.includes('{') || prompt.includes('[') || prompt.includes('instruction');
  
  if (length < 200 && !hasComplexInstructions) {
    return 'easy';
  }
  if (length < 800 && !hasComplexInstructions) {
    return 'medium';
  }
  return 'hard';
};

// 提取英文和中文提示词
const extractPrompts = (prompts: string[]): { promptEn: string; prompt: string } => {
  // 通常第一个是英文,第二个是中文
  if (prompts.length >= 2) {
    // 判断哪个是中文(包含中文字符)
    const hasChinese = (str: string) => /[\u4e00-\u9fa5]/.test(str);
    
    const first = prompts[0];
    const second = prompts[1];
    
    if (hasChinese(first) && !hasChinese(second)) {
      // 第一个是中文,第二个是英文
      return { prompt: first, promptEn: second };
    } else if (!hasChinese(first) && hasChinese(second)) {
      // 第一个是英文,第二个是中文
      return { promptEn: first, prompt: second };
    } else {
      // 默认第一个是英文,第二个是中文
      return { promptEn: first, prompt: second };
    }
  }
  
  // 只有一个提示词,判断语言
  const single = prompts[0] || '';
  const isChinese = /[\u4e00-\u9fa5]/.test(single);
  
  if (isChinese) {
    return { prompt: single, promptEn: single }; // 如果没有英文,使用中文
  } else {
    return { promptEn: single, prompt: single }; // 如果没有中文,使用英文
  }
};

// GitHub Raw URL 基础路径
const GITHUB_RAW_BASE = 'https://raw.githubusercontent.com/HisMax/gpt4o-image-prompts/main';

// 转换单个项目
const convertItem = (item: PromptItem, startId: number): ShowcaseCase => {
  const { prompt, promptEn } = extractPrompts(item.prompts);
  
  // 处理图片路径
  const inputImages = item.images
    .filter(img => img !== item.coverImage) // 排除封面图
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

  // 生成描述(从标题和提示词提取)
  const description = item.description || item.title;
  const descriptionEn = item.title; // 如果没有英文描述,使用标题

  return {
    id: startId + item.id,
    title: item.title,
    titleEn: item.title, // 如果没有英文标题,使用中文标题
    description,
    descriptionEn,
    inputImages,
    outputImage,
    prompt,
    promptEn,
    category: tagToCategory(item.tags),
    difficulty: determineDifficulty(prompt),
    tags: item.tags,
    author: item.source.name,
    modelUsed: item.model,
    requiresInput: inputImages.length > 0,
    featured: false, // 默认不精选,可以后续手动调整
  };
};

// 主函数
const main = () => {
  const promptsPath = path.join(process.cwd(), 'prompts.json');
  const outputPath = path.join(process.cwd(), 'src', 'data', 'gpt4oPromptsCases.ts');
  
  if (!fs.existsSync(promptsPath)) {
    console.error(`❌ 找不到 prompts.json 文件: ${promptsPath}`);
    console.log('💡 请将 prompts.json 放在项目根目录');
    process.exit(1);
  }

  console.log('📖 读取 prompts.json...');
  const data = JSON.parse(fs.readFileSync(promptsPath, 'utf-8'));
  const items: PromptItem[] = data.items || [];
  
  console.log(`📊 找到 ${items.length} 个提示词案例`);
  
  // 从 111 开始(现有案例到 110)
  const START_ID = 111;
  const convertedCases = items.map(item => convertItem(item, START_ID - 1));
  
  // 生成 TypeScript 文件
  const tsContent = `/**
 * GPT-4o 图片提示词案例数据
 * 来源: https://github.com/HisMax/gpt4o-image-prompts
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
};

main();

