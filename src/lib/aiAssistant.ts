/**
 * AI助手后端逻辑
 * 调用OpenRouter免费模型提供智能提示词优化
 */

import { ProviderManager } from './apiProviders';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

const SYSTEM_PROMPT_ZH = `你是专业的AI图像提示词专家，请用Markdown格式回答。

## 回答格式要求

- 使用 **加粗** 强调重点
- 用列表组织要点（- 或 1.）
- 代码或提示词用 \`反引号\` 包裹
- 分段清晰，每段2-3行
- 使用 ## 标题组织结构

## 优化原则

1. **主体明确**：清晰描述主要对象
2. **场景丰富**：环境、光线、氛围
3. **风格专业**：参考艺术家或摄影流派
4. **细节到位**：质感、色调、构图

## 示例回答

当用户问"优化：一只猫"时，你应该这样回答：

## 优化建议

**原提示词**：一只猫

**问题分析**：
- 缺少场景描述
- 没有艺术风格
- 细节不足

**优化后的提示词**：

\`\`\`
一只优雅的橘色长毛猫，蓝眼睛，坐在洒满阳光的窗台上，毛发蓬松柔软，光线从侧面照射，温暖的金色调，浅景深，专业摄影，高清细节，柔和阴影
\`\`\`

**关键改进**：
- ✅ 添加了具体特征（橘色、长毛、蓝眼睛）
- ✅ 增加了场景（窗台、阳光）
- ✅ 指定了光线和色调
- ✅ 加入专业术语（浅景深、柔和阴影）

请用这种格式回答所有问题。保持简洁、美观、实用。`;

const SYSTEM_PROMPT_EN = `You are a professional AI image prompt expert. Please respond in Markdown format.

## Response Format Requirements

- Use **bold** for emphasis
- Organize with lists (- or 1.)
- Wrap code/prompts in \`backticks\`
- Keep paragraphs 2-3 lines
- Use ## headings for structure

## Optimization Principles

1. **Clear Subject**: Describe main object precisely
2. **Rich Scene**: Environment, lighting, atmosphere
3. **Professional Style**: Reference artists or photography styles
4. **Detailed Elements**: Texture, tone, composition

## Example Response

When user asks "optimize: a cat", respond like this:

## Optimization Suggestions

**Original Prompt**: a cat

**Issues**:
- Missing scene context
- No artistic style
- Insufficient details

**Optimized Prompt**:

\`\`\`
An elegant orange long-haired cat with blue eyes, sitting on a sunlit windowsill, fluffy soft fur, side lighting, warm golden tones, shallow depth of field, professional photography, high detail, soft shadows
\`\`\`

**Key Improvements**:
- ✅ Added specific traits (orange, long-haired, blue eyes)
- ✅ Included scene (windowsill, sunlight)
- ✅ Specified lighting and tone
- ✅ Used professional terms (shallow DOF, soft shadows)

Use this format for all answers. Keep it concise, beautiful, practical.`;

export async function chatWithAssistant(
  userMessage: string,
  conversationHistory: Message[] = [],
  selectedModel?: string
): Promise<string> {
  try {
    // 使用ModelScope作为AI助手的唯一Provider
    const modelscopeProvider = ProviderManager.getProviderById('modelscope');
    
    if (!modelscopeProvider) {
      throw new Error('ModelScope provider not found');
    }

    // 获取API密钥（优先用户配置，其次环境变量）
    let apiKey = ProviderManager.getApiKey('modelscope');
    
    // 服务端尝试从环境变量读取
    if (!apiKey && typeof window === 'undefined') {
      apiKey = process.env.MODELSCOPE_API_KEY || '';
    }

    if (!apiKey) {
      return navigator.language.startsWith('zh')
        ? '❌ 请先在设置中配置 ModelScope 的 API 密钥。\n\n提示：复制 .env.local.example 为 .env.local 即可使用默认配置。'
        : '❌ Please configure ModelScope API key in Settings first.\n\nTip: Copy .env.local.example to .env.local to use default configuration.';
    }

    const provider = modelscopeProvider;
    
    // 构建消息历史（仅保留最近5条）
    const recentHistory = conversationHistory.slice(-5);
    
    // 将system prompt合并到第一条user消息中（ModelScope兼容性更好）
    const systemPrompt = navigator.language.startsWith('zh') ? SYSTEM_PROMPT_ZH : SYSTEM_PROMPT_EN;
    
    const messages = [
      ...recentHistory.map(msg => ({
        role: msg.role === 'assistant' ? ('assistant' as const) : ('user' as const),
        content: msg.content,
      })),
      {
        role: 'user' as const,
        content: recentHistory.length === 0 
          ? `${systemPrompt}\n\n${userMessage}` 
          : userMessage,
      },
    ];

    // 调用ModelScope API
    const url = `${provider.baseUrl}/chat/completions`;

    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`,
    };

    // 如果用户指定了模型，优先使用；否则尝试多个支持的模型
    const preferredModel = selectedModel || localStorage.getItem('ai-assistant-model');
    const modelsToTry = preferredModel 
      ? [preferredModel] 
      : [
          'Qwen/Qwen2.5-72B-Instruct',  // 首选项：Qwen 2.5 系列，ModelScope 广泛支持
          'qwen/Qwen2.5-72B-Instruct',   // 小写版本
          'deepseek-ai/DeepSeek-V3.1',   // 备用：DeepSeek V3.1
        ];

    let lastError: Error | null = null;

    for (const modelId of modelsToTry) {
      try {
        const requestBody = {
          model: modelId,
          messages: messages,
          max_tokens: 2000,
          temperature: 0.7,
          top_p: 0.8,
        };

        // 添加调试日志
        console.log(`🔍 尝试模型: ${modelId}`);

        const response = await fetch(url, {
          method: 'POST',
          headers,
          body: JSON.stringify(requestBody),
        });

        const responseText = await response.text();
        console.log(`📊 模型 ${modelId} 响应状态: ${response.status}`);

        if (!response.ok) {
          let errorMessage = `API调用失败: ${response.status}`;
          try {
            const errorJson = JSON.parse(responseText);
            if (errorJson.errors?.message) {
              errorMessage = errorJson.errors.message;
            } else if (errorJson.error?.message) {
              errorMessage = errorJson.error.message;
            }
            
            // 如果模型不支持，尝试下一个
            if (errorMessage.includes('has no provider supported')) {
              console.log(`⚠️ 模型 ${modelId} 不支持，尝试下一个...`);
              lastError = new Error(errorMessage);
              continue; // 尝试下一个模型
            }
          } catch {
            // 如果不是JSON，直接使用文本
            if (responseText) {
              errorMessage = `${errorMessage} - ${responseText.substring(0, 200)}`;
            }
          }
          
          // 记录请求详情用于调试
          console.error('ModelScope API Request Details:', {
            url,
            model: modelId,
            hasApiKey: !!apiKey,
            apiKeyPrefix: apiKey ? `${apiKey.substring(0, 10)}...` : 'none',
            errorMessage,
          });
          
          // 如果不是"不支持"错误，直接抛出
          throw new Error(errorMessage);
        }

        const data = JSON.parse(responseText);
        
        // 提取回复内容
        const content = data.choices?.[0]?.message?.content || '';

        if (!content) {
          throw new Error('No response content');
        }

        console.log(`✅ 模型 ${modelId} 调用成功`);
        return content;

      } catch (error: any) {
        // 如果是"不支持"错误，继续尝试下一个模型
        if (error.message?.includes('has no provider supported')) {
          lastError = error;
          continue;
        }
        // 其他错误直接抛出
        throw error;
      }
    }

    // 所有模型都失败了
    throw lastError || new Error('所有尝试的模型都不支持。请检查 ModelScope API 支持情况或联系技术支持。');

  } catch (error: any) {
    console.error('AI Assistant error:', error);
    
    // 返回友好的错误提示
    if (error.message.includes('API key') || error.message.includes('密钥')) {
      return navigator.language.startsWith('zh')
        ? '❌ 请先配置 ModelScope API 密钥。\n\n方法1：复制 .env.local.example 为 .env.local\n方法2：在Settings页面手动配置\n\n提示：默认配置已包含可用的API密钥。'
        : '❌ Please configure ModelScope API key first.\n\nMethod 1: Copy .env.local.example to .env.local\nMethod 2: Configure manually in Settings\n\nTip: Default config includes working API keys.';
    }

    return navigator.language.startsWith('zh')
      ? `❌ AI助手暂时无法响应。\n\n错误: ${error.message}\n\n建议：\n1. 检查网络连接\n2. 确认 ModelScope API 密钥正确\n3. 尝试切换其他聊天模型（Kimi-K2或DeepSeek-V3.1）`
      : `❌ AI assistant is temporarily unavailable.\n\nError: ${error.message}\n\nSuggestions:\n1. Check network connection\n2. Verify ModelScope API key\n3. Try switching to other chat models (Kimi-K2 or DeepSeek-V3.1)`;
  }
}

// 便捷方法：优化提示词
export async function optimizePrompt(originalPrompt: string): Promise<string> {
  const message = navigator.language.startsWith('zh')
    ? `请帮我优化这个AI图像生成提示词，使其更专业、更详细：\n\n${originalPrompt}`
    : `Please optimize this AI image generation prompt to make it more professional and detailed:\n\n${originalPrompt}`;
  
  return chatWithAssistant(message, []);
}

// 便捷方法：生成提示词变体
export async function generateVariants(basePrompt: string, count: number = 3): Promise<string> {
  const message = navigator.language.startsWith('zh')
    ? `基于这个提示词，请生成${count}个不同风格的变体：\n\n${basePrompt}`
    : `Based on this prompt, generate ${count} variants with different styles:\n\n${basePrompt}`;
  
  return chatWithAssistant(message, []);
}
