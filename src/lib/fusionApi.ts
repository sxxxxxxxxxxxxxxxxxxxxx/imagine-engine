/**
 * 多图像融合API封装函数
 * 基于OpenAI兼容的API格式实现
 */

// API配置
const API_BASE_URL = process.env.NANO_BANANA_BASE_URL || 'https://newapi.aicohere.org/v1/chat/completions';
const IMAGE_API_BASE_URL = process.env.IMAGE_API_BASE_URL || 'https://newapi.pockgo.com/v1/chat/completions';
const API_KEY = process.env.NANO_BANANA_API_KEY;

// 默认模型
const DEFAULT_FUSION_MODEL = 'google/gemini-2.5-flash-image-preview';

// 类型定义
export interface FusionRequest {
  images: string[]; // Base64 encoded images
  prompt: string;
  style?: string;
  quality?: 'standard' | 'high';
}

export interface FusionResponse {
  imageUrl?: string;
  error?: string;
}

/**
 * 多图像融合API调用
 * 使用OpenAI兼容的API格式
 */
export async function fusionImages(request: FusionRequest): Promise<FusionResponse> {
  try {
    if (!API_KEY) {
      throw new Error('API密钥未配置，请检查环境变量NANO_BANANA_API_KEY');
    }

    if (!request.images || request.images.length < 2) {
      throw new Error('至少需要2张图片进行融合');
    }

    if (!request.prompt || !request.prompt.trim()) {
      throw new Error('请提供融合提示词');
    }

    if (request.images.length > 6) {
      throw new Error('最多支持6张图片融合');
    }

    // 构建图片数据URL数组
    const imageDataUrls = request.images.map(image => {
      if (!image.startsWith('data:image/')) {
        return `data:image/png;base64,${image}`;
      }
      return image;
    });

    // 构建专业的融合提示词
    const stylePrompts = {
      realistic: '写实风格，真实感强，细节丰富，高质量摄影效果',
      anime: '日式动漫风格，色彩鲜艳，二次元画风',
      oil_painting: '古典油画风格，艺术感强，油画质感',
      watercolor: '水彩风格，清新淡雅，朦胧美感，水彩画效果',
      cyberpunk: '赛博朋克风格，未来科技，霓虹色彩，科幻感',
      minimalist: '极简风格，简洁明了，突出主体，简约设计',
    };

    const styleDescription = stylePrompts[request.style as keyof typeof stylePrompts] || stylePrompts.realistic;
    
    // 构建多图像融合提示词
    const fusionPrompt = `多图像AI融合任务：

输入图片数量：${request.images.length}张

用户要求：${request.prompt}

风格要求：${styleDescription}

任务要求：
1. 智能分析所有输入图片的内容、风格、色彩和构图
2. 根据用户描述精准融合多张图片的特征
3. 保持高质量的视觉效果和艺术表现力
4. 确保融合结果自然和谐，符合用户期望
5. 创造独特的艺术效果，避免简单叠加
6. 保持图像的清晰度和细节完整性

融合策略：
- 优先保留用户强调的元素和风格
- 平衡各图片的视觉权重
- 创造和谐统一的视觉效果
- 避免过度处理导致的失真
- 确保光影和色彩的自然过渡

输出要求：生成高质量的单张融合图像，确保所有输入图片的特征都被合理融合`;

    console.log('发送多图像融合请求:', { 
      imagesCount: request.images.length, 
      prompt: request.prompt, 
      style: request.style || 'realistic',
      model: DEFAULT_FUSION_MODEL 
    });

    // 构建消息内容
    const messageContent = [
      {
        type: 'text',
        text: fusionPrompt,
      },
      ...imageDataUrls.map(imageUrl => ({
        type: 'image_url' as const,
        image_url: {
          url: imageUrl,
        },
      }))
    ];

    const response = await fetch(IMAGE_API_BASE_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: DEFAULT_FUSION_MODEL,
        messages: [
          {
            role: 'user',
            content: messageContent,
          }
        ],
        max_tokens: 2048,
        temperature: 0.3, // 适中温度，平衡创造性和一致性
        top_p: 0.9,
        frequency_penalty: 0.1,
        presence_penalty: 0.1,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error('融合API请求失败:', errorData);
      throw new Error(errorData.error?.message || `API请求失败: ${response.status} - ${response.statusText}`);
    }

    const data = await response.json();
    console.log('融合API响应:', data);

    // 从OpenAI格式的响应中提取内容
    const message = data.choices?.[0]?.message;
    
    if (!message) {
      throw new Error('API响应格式错误：缺少message字段');
    }

    // 检查消息内容
    let content = message.content;
    if (typeof content !== 'string') {
      content = JSON.stringify(content);
    }

    console.log('融合API返回内容:', content);

    // 首先检查是否有images字段中的图片URL
    if (message?.images?.[0]?.image_url?.url) {
      console.log('检测到images字段中的图片URL:', message.images[0].image_url.url);
      return { imageUrl: message.images[0].image_url.url };
    }

    // 检查内容是否包含图片数据URL
    if (typeof content === 'string' && content.startsWith('data:image/')) {
      return { imageUrl: content };
    }

    // 检查是否有base64编码的图片
    if (typeof content === 'string' && content.includes('data:image/')) {
      const imageMatch = content.match(/data:image\/[^;]+;base64,[^"]+/);
      if (imageMatch) {
        return { imageUrl: imageMatch[0] };
      }
    }

    // 尝试从内容中提取图片URL
    const urlPatterns = [
      // Markdown格式的图片链接
      /!\[.*?\]\((https?:\/\/[^)]+)\)/gi,
      // 直接的图片URL
      /https?:\/\/[^\s\)]+\.(jpg|jpeg|png|gif|webp)/gi,
      // 任何HTTP URL
      /https?:\/\/[^\s\)"']+/gi,
      // JSON格式的URL
      /"url":\s*"([^"]+)"/gi,
      /'url':\s*'([^']+)'/gi
    ];

    for (const pattern of urlPatterns) {
      const matches = [...content.matchAll(pattern)];
      if (matches && matches.length > 0) {
        // 取第一个匹配的URL
        let imageUrl = matches[0][1] || matches[0][0]; // 使用捕获组或完整匹配
        
        // 清理URL（移除可能的引号、括号等）
        imageUrl = imageUrl.replace(/["'\)]/g, '');
        
        console.log('提取到融合图片URL:', imageUrl);
        return { imageUrl: imageUrl };
      }
    }

    // 如果没有找到图片URL，返回错误信息
    throw new Error(`API未返回有效的图片URL。API响应内容: ${content.substring(0, 200)}...`);
    
  } catch (error) {
    console.error('多图像融合失败:', error);
    return { 
      error: error instanceof Error ? error.message : '多图像融合时发生未知错误' 
    };
  }
}