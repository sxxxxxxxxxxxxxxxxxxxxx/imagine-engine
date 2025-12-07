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
  tool: 'inpaint' | 'remove_bg' | 'id_photo' | 'upscale' | 'style_transfer' | 'enhance' | 'colorize';
  image: string; // Base64 encoded
  mask?: string; // Base64 encoded, optional for inpaint
  instruction?: string; // For inpaint tool
  bgColor?: 'red' | 'blue' | 'white'; // For id_photo tool
  scale?: number; // For upscale tool (2, 3, or 4)
  style?: string; // For style_transfer tool (artistic style name)
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

    // 确保 baseUrl 包含完整的路径
    let apiUrl = settings.baseUrl || 'https://newapi.aicohere.org/v1/chat/completions';
    // 如果 baseUrl 不包含 /chat/completions，则自动添加
    if (apiUrl && !apiUrl.includes('/chat/completions')) {
      // 移除末尾的斜杠（如果有）
      apiUrl = apiUrl.replace(/\/$/, '');
      // 添加 /chat/completions 路径
      apiUrl = `${apiUrl}/chat/completions`;
    }

    const response = await fetch(apiUrl, {
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
      remove_bg: `You are a professional image editing AI. Your task is to remove the background from this image while preserving the main subject with pixel-perfect accuracy.

【CRITICAL RULES - MUST FOLLOW STRICTLY】
1. Remove ONLY the background - keep the main subject 100% unchanged
2. Preserve ALL details: composition, angles, perspective, lighting, shadows, textures, fine edges
3. Maintain ALL subject elements: facial expressions, poses, clothing, accessories, hair strands
4. Keep original color style: hue, saturation, brightness, contrast - exactly as original
5. DO NOT add any new elements, objects, or decorations
6. DO NOT remove any part of the main subject
7. Ensure background is completely transparent (alpha channel = 0)
8. Handle complex edges carefully: hair, fur, transparent objects, fine details
9. Maintain original image resolution and quality
10. Output format: PNG with transparent background

Return the edited image with perfect transparent background, maintaining all original subject details.`,

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

      id_photo: `You are a professional ID photo editor. Replace the background of this portrait with a solid ${request.bgColor || 'red'} color (${bgColors[request.bgColor as keyof typeof bgColors] || '#FF0000'}) while maintaining professional photo standards.

【ID PHOTO PROCESSING RULES - STRICT】
1. Keep the person's subject 100% unchanged - no modifications to face, body, clothing, or appearance
2. Remove original background completely and replace with uniform solid color
3. Ensure clean, natural edges with proper anti-aliasing
4. Maintain original image resolution and quality (no compression artifacts)
5. Background color must be perfectly uniform and consistent (no gradients, patterns, or variations)
6. DO NOT modify any facial features, expressions, or body characteristics
7. Center the subject properly in the frame
8. Ensure professional lighting and color balance
9. Follow standard ID photo specifications (proper framing, no shadows on background)
10. Output format: High-quality image with solid color background

Return a professional, standard-compliant ID photo with perfect solid color background.`,

      upscale: `You are an AI image upscaling expert. Upscale this image by exactly ${request.scale || 2}x using advanced super-resolution technology while maintaining perfect quality and authenticity.

【IMAGE UPSCALING RULES - CRITICAL】
1. Upscale to exactly ${request.scale || 2}x resolution (width × ${request.scale || 2}, height × ${request.scale || 2})
2. Use AI super-resolution algorithms to enhance details and sharpness intelligently
3. Preserve ALL original details: composition, angles, perspective, lighting, shadows, textures, fine patterns
4. Maintain ALL original elements: facial expressions, poses, clothing, accessories, background objects, text
5. Keep original color style: hue, saturation, brightness, contrast - exactly as original
6. DO NOT add any new elements, objects, decorations, or artifacts
7. DO NOT remove or modify any existing elements
8. Ensure upscaled image is sharp, clear, and free from blur, artifacts, or distortion
9. Use advanced AI algorithms to intelligently enhance details (not invent new ones)
10. Make the upscaled image look like native high-resolution, not artificially enhanced
11. Maintain natural appearance - avoid over-sharpening or artificial-looking enhancements
12. Preserve original image quality and characteristics

Return the upscaled image with ${request.scale || 2}x resolution, maintaining perfect quality and authenticity.`,

      style_transfer: `You are an AI artistic style transfer expert. Apply the artistic style "${request.style || 'impressionist'}" to this image while preserving the original content and composition.

【ARTISTIC STYLE TRANSFER RULES - CRITICAL】
1. Apply the specified artistic style (${request.style || 'impressionist'}) to the entire image
2. Preserve the original content: subjects, objects, composition, layout - all must remain recognizable
3. Transform visual style: colors, brush strokes, textures, lighting effects according to the artistic style
4. Maintain original image structure: proportions, perspective, spatial relationships
5. Apply style consistently across the entire image
6. Enhance artistic elements: brushwork, color palette, texture patterns characteristic of the style
7. DO NOT change the subject matter or add/remove objects
8. DO NOT distort proportions or perspective
9. Ensure the result looks like a professional artistic interpretation, not a filter
10. Maintain high image quality and resolution

Return the stylized image with the artistic style applied while preserving all original content.`,

      enhance: `You are an AI image enhancement expert. Enhance the quality, sharpness, colors, and overall visual appeal of this image using advanced image processing techniques.

【IMAGE ENHANCEMENT RULES - CRITICAL】
1. Enhance image sharpness and clarity intelligently (reduce blur, improve edge definition)
2. Optimize color balance: improve saturation, contrast, brightness for natural and vibrant colors
3. Reduce noise and artifacts while preserving important details
4. Enhance details in shadows and highlights (improve dynamic range)
5. Maintain original composition, perspective, and all image elements
6. Preserve natural appearance - avoid over-processing or artificial-looking results
7. DO NOT add new elements, objects, or modify the subject matter
8. DO NOT change the overall color tone dramatically (maintain original mood)
9. Apply subtle, professional-grade enhancements
10. Maintain original image resolution and aspect ratio
11. Ensure the enhanced image looks natural and professional, not over-processed

Return the enhanced image with improved quality, sharpness, and colors while maintaining natural appearance.`,

      colorize: `You are an AI colorization expert. Add realistic, historically accurate colors to this black and white or grayscale photograph.

【IMAGE COLORIZATION RULES - CRITICAL】
1. Add realistic, natural colors to the black and white image
2. Use historically and contextually appropriate colors (e.g., skin tones, clothing colors, environment colors)
3. Maintain realistic color relationships: shadows, highlights, mid-tones should have appropriate color variations
4. Preserve all original details: composition, lighting, textures, fine details
5. Apply colors consistently: similar objects should have similar colors
6. Use natural color palettes: avoid overly saturated or unrealistic colors
7. Maintain original image structure: do not modify composition, perspective, or subject matter
8. Enhance realism: colors should look natural and believable
9. Preserve original contrast and tonal relationships
10. DO NOT add new elements or modify the subject matter
11. Ensure the colorized image looks like an authentic color photograph, not artificially colored

Return the colorized image with realistic, natural colors while preserving all original details and structure.`,
    };

    const editPrompt = editPrompts[request.tool];

    // 确保 baseUrl 包含完整的路径
    let apiUrl = settings.baseUrl || 'https://newapi.aicohere.org/v1/chat/completions';
    // 如果 baseUrl 不包含 /chat/completions，则自动添加
    if (apiUrl && !apiUrl.includes('/chat/completions')) {
      // 移除末尾的斜杠（如果有）
      apiUrl = apiUrl.replace(/\/$/, '');
      // 添加 /chat/completions 路径
      apiUrl = `${apiUrl}/chat/completions`;
    }

    console.log('发送图片编辑请求:', { tool: request.tool, model: settings.model, baseUrl: apiUrl });

    const response = await fetch(apiUrl, {
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

    // 确保 baseUrl 包含完整的路径
    let apiUrl = settings.baseUrl || 'https://newapi.aicohere.org/v1/chat/completions';
    // 如果 baseUrl 不包含 /chat/completions，则自动添加
    if (apiUrl && !apiUrl.includes('/chat/completions')) {
      // 移除末尾的斜杠（如果有）
      apiUrl = apiUrl.replace(/\/$/, '');
      // 添加 /chat/completions 路径
      apiUrl = `${apiUrl}/chat/completions`;
    }

    // 使用一个简单的测试请求来验证API密钥
    const response = await fetch(apiUrl, {
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