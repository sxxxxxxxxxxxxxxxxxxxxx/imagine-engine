/**
 * AI API 封装函数
 * 支持多个主流生图模型提供商
 * 配置通过localStorage动态获取
 */

// 从localStorage获取用户设置
function getUserSettings() {
  if (typeof window === 'undefined') {
    // 服务端渲染时使用默认值
    return {
      apiKey: '',
      baseUrl: 'https://newapi.aicohere.org/v1/chat/completions',
      model: 'gemini-2.5-flash-image-preview',
      provider: 'nano-banana'
    };
  }

  return {
    apiKey: localStorage.getItem('imagine-engine-api-key') || '',
    baseUrl: localStorage.getItem('imagine-engine-base-url') || 'https://newapi.aicohere.org/v1/chat/completions',
    model: localStorage.getItem('imagine-engine-model') || 'gemini-2.5-flash-image-preview',
    provider: localStorage.getItem('imagine-engine-provider') || 'nano-banana'
  };
}

// 类型定义
export interface GenerateImageRequest {
  prompt: string;
  style?: string;
  baseImage?: string; // Base64格式的基础图片，用于控制生成比例
  referenceImages?: string[]; // ✅ 多图融合：多张参考图的Base64数组
  aspectRatio?: string; // 期望的图片比例
}

export interface EditImageRequest {
  tool: 'inpaint' | 'remove_bg' | 'id_photo';
  image: string; // Base64 encoded
  mask?: string; // Base64 encoded, optional for inpaint
  instruction?: string; // For inpaint tool
  bgColor?: 'red' | 'blue' | 'white'; // For id_photo tool
  originalDimensions?: { width: number; height: number };
}

export interface ApiResponse {
  imageUrl?: string;
  error?: string;
  needsResize?: boolean;
  backendResized?: boolean;
  originalDimensions?: { width: number; height: number };
  aspectRatio?: string; // 生成图片的比例信息
}

/**
 * 文生图API调用
 * 使用OpenAI兼容的API格式
 */
export async function generateImage(
  request: GenerateImageRequest, 
  config?: { apiKey?: string; baseUrl?: string; model?: string }
): Promise<ApiResponse> {
  try {
    // 优先使用传入的配置，否则从localStorage获取
    const userSettings = getUserSettings();
    const settings = {
      apiKey: config?.apiKey || userSettings.apiKey,
      baseUrl: config?.baseUrl || userSettings.baseUrl,
      model: config?.model || userSettings.model
    };
    
    if (!settings.apiKey) {
      throw new Error('请先在设置中配置API密钥（点击左侧导航栏"设置"按钮）');
    }

    // 构建符合风格的提示词
    const stylePrompts = {
      realistic: '写实风格，真实感强，细节丰富，高质量摄影效果',
      anime: '日式动漫风格，色彩鲜艳，二次元画风',
      oil_painting: '古典油画风格，艺术感强，油画质感',
      watercolor: '水彩风格，清新淡雅，朦胧美感，水彩画效果',
      cyberpunk: '赛博朋克风格，未来科技，霓虹色彩，科幻感',
      minimalist: '极简风格，简洁明了，突出主体，简约设计',
    };

    const styleDescription = stylePrompts[request.style as keyof typeof stylePrompts] || stylePrompts.realistic;
    
    // 🎯 根据是否有参考图片，使用不同的提示词策略
    let strictPrompt: string;
    
    // ✅ 多图融合模式
    if (request.referenceImages && request.referenceImages.length > 1) {
      strictPrompt = `[MULTI-IMAGE FUSION MODE]

I am providing ${request.referenceImages.length} reference images. Your task: FUSE/BLEND these images to create: ${request.prompt}

FUSION REQUIREMENTS:
1. Analyze all ${request.referenceImages.length} reference images
2. Extract key elements, styles, compositions from each image
3. Intelligently blend/fuse them into ONE cohesive new image
4. Maintain the style: ${styleDescription}
${request.aspectRatio ? `5. Output aspect ratio: ${request.aspectRatio}` : ''}

USER INSTRUCTION: ${request.prompt}

【FUSION RULES - MUST FOLLOW】
- Study ALL reference images carefully
- Extract complementary elements from each
- Create a harmonious blend, not a simple collage
- Maintain visual coherence and professional quality
- Follow the user's specific fusion instruction

Style: ${styleDescription}
Quality: Professional, seamless fusion, high detail`;

      console.log(`🎭 使用多图融合模式: ${request.referenceImages.length}张参考图`);
    } else if (request.baseImage) {
      // 单图图生图模式：使用明确的画布编辑指令
      strictPrompt = `[CANVAS EDITING MODE - FILL COMPLETELY]

I am providing a blank canvas. Your job: COMPLETELY FILL this canvas edge-to-edge with: ${request.prompt}

CANVAS: ${request.aspectRatio} aspect ratio
STYLE: ${styleDescription}

【CRITICAL RULES - MUST FOLLOW】
1. ⚠️ EDIT the canvas image (NOT generate new)
2. ⚠️ FILL 100% of canvas - EDGE TO EDGE, NO EMPTY SPACE
3. ⚠️ Content must COVER entire canvas completely
4. ⚠️ MAINTAIN exact canvas dimensions (${request.aspectRatio})
5. ⚠️ No borders, no margins, FILL COMPLETELY
6. Output size = Input canvas size (EXACT SAME)

INSTRUCTION: Paint/draw "${request.prompt}" on the entire canvas. Fill it completely from edge to edge. Keep canvas dimensions.

Style: ${styleDescription}
Quality: Professional, detailed, sharp`;

      console.log(`🎨 使用画布编辑模式控制比例: ${request.aspectRatio}`);
    } else {
      // 纯文生图模式
      strictPrompt = `Generate an image based on this prompt: ${request.prompt}. 

Style requirements: ${styleDescription}

【严格规则 - 必须遵守】
1. 只生成用户明确描述的内容，不添加任何额外元素
2. 保持简洁明了，避免过度装饰
3. 确保图像质量高，细节丰富
4. 严格按照指定风格生成
5. 不得添加用户未提及的物体、人物或背景元素
6. 保持构图简洁，突出主体
${request.aspectRatio ? `7. Generate image with aspect ratio ${request.aspectRatio}` : ''}

High quality, detailed, professional.`;
    }

    console.log('发送文生图请求:', { 
      prompt: strictPrompt.substring(0, 150), 
      model: settings.model, 
      baseUrl: settings.baseUrl,
      hasBaseImage: !!request.baseImage,
      multiImageCount: request.referenceImages?.length || 0,  // ✅ 多图数量
      aspectRatio: request.aspectRatio,
      mode: (request.referenceImages && request.referenceImages.length > 1) ? 'multi-image-fusion' : (request.baseImage ? 'image-to-image' : 'text-to-image')
    });

    // 🎯 构建消息内容 - 图片在前，文字在后（让AI首先看到所有参考）
    const messageContent: Array<{type: string; text?: string; image_url?: {url: string}}> = [];

    // ✅ 多图融合模式：先添加所有参考图
    if (request.referenceImages && request.referenceImages.length > 0) {
      console.log(`🎭 添加${request.referenceImages.length}张参考图到请求中`);
      request.referenceImages.forEach((img, index) => {
        messageContent.push({
          type: 'image_url',
          image_url: {
            url: img
          }
        });
        console.log(`   ├─ 参考图${index + 1}: ${img.substring(0, 30)}...`);
      });
      console.log(`   └─ 模式: 多图融合`);
    }
    // 单图图生图模式
    else if (request.baseImage) {
      console.log('📐 添加基础画布到请求中');
      console.log(`   ├─ 比例: ${request.aspectRatio}`);
      console.log(`   ├─ 图片格式: ${request.baseImage.substring(0, 30)}...`);
      console.log(`   └─ 模式: 画布编辑（图生图）`);
      
      messageContent.push({
        type: 'image_url',
        image_url: {
          url: request.baseImage
        }
      });
    }
    
    // 然后添加文字提示
    messageContent.push({
      type: 'text',
      text: strictPrompt,
    });
    
    console.log(`📤 消息内容构建完成:`, {
      imageCount: messageContent.filter(m => m.type === 'image_url').length,
      contentParts: messageContent.length,
      hasImage: messageContent.some(m => m.type === 'image_url'),
      hasText: messageContent.some(m => m.type === 'text')
    });

    const response = await fetch(settings.baseUrl || 'https://newapi.aicohere.org/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${settings.apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: settings.model,
        messages: [
          {
            role: 'user',
            content: messageContent,
          }
        ],
        max_tokens: 150,
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error('API请求失败:', errorData);
      throw new Error(errorData.error?.message || `API请求失败: ${response.status} - ${response.statusText}`);
    }

    const data = await response.json();
    console.log('API响应:', data);

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

    console.log('API返回内容:', content);

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
        
        console.log('✅ 提取到图片URL:', imageUrl);
        
        // 🎯 如果使用了基础图片（比例控制），验证输出尺寸
        if (request.baseImage && request.aspectRatio) {
          console.log(`🔍 验证生成图片的比例是否符合预期 (${request.aspectRatio})...`);
          // 返回标记，让前端知道这是通过画布控制的图片
          return {
            imageUrl: imageUrl,
            needsResize: false,
            backendResized: true,
            aspectRatio: request.aspectRatio,
          };
        }
        
        return {
          imageUrl: imageUrl,
          needsResize: false,
          backendResized: true,
        };
      }
    }

    // 如果没有找到图片URL，返回错误信息
    throw new Error(`API未返回有效的图片URL。API响应内容: ${content.substring(0, 200)}...`);
  } catch (error) {
    console.error('生成图片失败:', error);
    return { 
      error: error instanceof Error ? error.message : '生成图片时发生未知错误' 
    };
  }
}

/**
 * 图片编辑API调用
 * 使用OpenAI兼容的API格式
 */
export async function editImage(
  request: EditImageRequest,
  config?: { apiKey?: string; baseUrl?: string; model?: string }
): Promise<ApiResponse> {
  try {
    // 优先使用传入的配置
    const userSettings = getUserSettings();
    const settings = {
      apiKey: config?.apiKey || userSettings.apiKey,
      baseUrl: config?.baseUrl || userSettings.baseUrl,
      model: config?.model || userSettings.model
    };
    
    if (!settings.apiKey) {
      throw new Error('请先在设置中配置API密钥');
    }

    // 构建图片数据URL
    let imageDataUrl = request.image;
    if (!imageDataUrl.startsWith('data:image/')) {
      imageDataUrl = `data:image/png;base64,${request.image}`;
    }
    
    // 构建严格的编辑提示词
    const bgColors = {
      red: '#FF0000',
      blue: '#0000FF',
      white: '#FFFFFF'
    };

    const editPrompts = {
      remove_bg: `Remove the background from this image while keeping the main subject intact.

【绝对规则 - 必须严格遵守】
1. 只移除背景，保持主体完全不变
2. 保持原图的所有细节：构图、角度、透视、光线、阴影、纹理
3. 保持主体的所有元素：表情、姿势、服装、配饰等
4. 保持原图的色彩风格、色调、饱和度、对比度
5. 不得添加任何新元素、物体或装饰
6. 不得删除主体的任何部分
7. 确保背景完全透明或纯色

Return the edited image with transparent background.`,

      inpaint: `${request.instruction ? `Edit this image: ${request.instruction}` : 'Edit this image to remove unwanted elements while maintaining the original style and composition.'}

【绝对规则 - 必须严格遵守】
1. 只修改用户指令中明确指定的内容，其他任何部分都不得改变
2. 保持原图的所有细节：构图、角度、透视、光线、阴影、纹理
3. 保持原图的所有元素：人物表情、姿势、服装、配饰、背景物体
4. 保持原图的色彩风格、色调、饱和度、对比度
5. 不得添加任何新元素、物体或装饰
6. 不得删除任何现有元素（除非明确要求删除）
7. 修改区域要与周围环境自然融合

Return the edited image maintaining original quality and dimensions.`,

      id_photo: `Replace the background of this portrait photo with a solid ${request.bgColor || 'red'} color (${bgColors[request.bgColor as keyof typeof bgColors] || '#FF0000'}).

【证件照处理规则】
1. 保持人物主体完全不变
2. 移除原始背景，替换为纯色背景
3. 确保边缘干净、自然
4. 保持原始图片的分辨率和质量
5. 背景颜色必须均匀一致
6. 不得修改人物的任何特征

Return a professional ID photo with solid color background.`,
    };

    const editPrompt = editPrompts[request.tool];

    console.log('发送图片编辑请求:', { tool: request.tool, model: settings.model, baseUrl: settings.baseUrl });

    const response = await fetch(settings.baseUrl || 'https://newapi.aicohere.org/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${settings.apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: settings.model,
        messages: [
          {
            role: 'user',
            content: [
              {
                type: 'text',
                text: editPrompt,
              },
              {
                type: 'image_url',
                image_url: {
                  url: imageDataUrl,
                },
              }
            ],
          }
        ],
        max_tokens: 150,
        temperature: 0.1, // 低温度确保一致性
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error('编辑API请求失败:', errorData);
      throw new Error(errorData.error?.message || `API请求失败: ${response.status} - ${response.statusText}`);
    }

    const data = await response.json();
    console.log('编辑API响应:', data);

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

    console.log('编辑API返回内容:', content);

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
        
        console.log('提取到编辑后图片URL:', imageUrl);
        
        return {
          imageUrl: imageUrl,
          needsResize: false,
          backendResized: true,
        };
      }
    }

    // 如果没有找到图片URL，返回错误信息
    throw new Error(`API未返回有效的图片URL。API响应内容: ${content.substring(0, 200)}...`);
    
  } catch (error) {
    console.error('编辑图片失败:', error);
    return { 
      error: error instanceof Error ? error.message : '编辑图片时发生未知错误' 
    };
  }
}

/**
 * 检查API密钥状态
 * 通过简单的API调用来验证密钥有效性
 */
export async function checkApiKeyStatus(): Promise<{ valid: boolean; error?: string }> {
  try {
    const settings = getUserSettings();
    
    if (!settings.apiKey) {
      return { valid: false, error: 'API密钥未配置，请在设置中配置' };
    }

    // 使用一个简单的测试请求来验证API密钥
    const response = await fetch(settings.baseUrl, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${settings.apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: settings.model,
        messages: [
          {
            role: 'user',
            content: [{ type: 'text', text: 'Hello' }],
          }
        ],
        max_tokens: 10,
      }),
    });

    // 如果返回401，说明密钥无效
    if (response.status === 401) {
      return { valid: false, error: 'API密钥无效' };
    }

    // 其他错误码也认为密钥有效，可能是其他问题
    return { valid: true };
  } catch (error) {
    return { 
      valid: false, 
      error: error instanceof Error ? error.message : 'API密钥验证时发生网络错误' 
    };
  }
}

/**
 * 将文件转换为Base64格式
 */
export function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      // 移除data:image/...;base64,前缀，只保留base64数据
      const base64Data = result.split(',')[1];
      resolve(base64Data);
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}