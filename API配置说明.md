# 🔑 API 配置说明

## 📋 核心配置（2个Provider）

### 1. **Pockgo Image**（图像生成）
- **用途**：AI Studio 所有图像生成功能
- **API地址**：`https://newapi.pockgo.com/v1`
- **API密钥**：`sk-C358zCIUzlUZ7daJl4PEtu6njZz7g7k3luAWRqpS64gi0pjs`
- **支持模型**（6个）：
  - `seedream-4.0` - 标准质量
  - `seedream-4.0-2k` - 高清2K
  - `seedream-4.0-4k` - 超清4K
  - `gemini-2.5-flash-image` - 多比例支持（正式版）
  - `gemini-2.5-flash-image-preview` - 预览版
  - `qwen-image` - 文生图+图生图

### 2. **ModelScope**（AI助手聊天）
- **用途**：AI助手所有聊天功能
- **API地址**：`https://api-inference.modelscope.cn/v1`
- **API密钥**：`ms-68b498a8-97d5-4fef-9329-15587817422f`
- **支持模型**（4个，全部免费）：
  - `Qwen/Qwen3-Coder-480B-A35B-Instruct` - 代码专用（默认）
  - `Qwen/Qwen3-235B-A22B-Thinking-2507` - 推理专用
  - `moonshotai/Kimi-K2-Instruct-0905` - Kimi-K2模型
  - `deepseek-ai/DeepSeek-V3.1` - DeepSeek V3.1

---

## 🚀 快速开始

### 方法1：使用环境变量（推荐）

1. **复制示例文件**：
```bash
cp .env.local.example .env.local
```

2. **启动项目**：
```bash
npm run dev
```

3. **验证配置**：
   - 访问 `/settings`
   - 查看Provider配置状态
   - 所有核心Provider应显示 "✓ 已从环境变量读取默认配置"

### 方法2：手动配置（可选）

1. 访问 `/settings`
2. 为每个Provider输入API密钥
3. 点击"保存配置"
4. 点击"测试连接"验证

---

## 🔐 安全说明

### API密钥存储方式

**优先级**：
```
用户Settings配置 > 环境变量 > 无配置
```

**存储位置**：
- 环境变量：`.env.local`（不会提交到git）
- 用户配置：浏览器 localStorage

### 脱敏显示

Settings页面显示API密钥时会自动脱敏：
- 原始：`sk-C358zCIUzlUZ7daJl4PEtu6njZz7g7k3luAWRqpS64gi0pjs`
- 显示：`sk-C358***gi0pjs`

---

## 📖 使用指南

### AI Studio 图像生成

1. 访问 `/create`
2. 输入提示词
3. 选择模型（默认：`seedream-4.0`）
4. 选择比例（10种可选）
5. 点击"生成图片"

**默认Provider**: Pockgo Image

**可用模型**：
- SeedREAM系列：标准/2K/4K
- Gemini系列：支持10种比例
- Qwen：支持图生图

### AI助手聊天

1. 点击右下角浮动球
2. 输入问题或需求
3. AI助手实时回复

**默认Provider**: ModelScope

**默认模型**: `Qwen/Qwen3-Coder-480B-A35B-Instruct`

**可用功能**：
- 优化提示词
- 生成变体
- 解释术语
- 对话记忆

---

## 🔧 高级配置

### 切换图像模型

在 `/settings` 中：
1. 选择 Pockgo Image Provider
2. 查看6个可用模型
3. 在AI Studio中切换使用

### 切换聊天模型

AI助手支持4个ModelScope模型：
- **Qwen3-Coder-480B**（默认）- 代码能力强，适合提示词优化
- **Qwen3-Thinking-235B** - 推理能力强
- **Kimi-K2** - 月之暗面模型
- **DeepSeek-V3.1** - 最新DeepSeek模型

可在Settings中为AI助手配置不同模型ID。

### 添加自定义Provider

1. 访问 `/settings`
2. 滚动到底部
3. 点击"添加提供商"
4. 填写配置信息
5. 保存并测试

---

## 🌐 API参考

### Pockgo Image API

**端点**：`https://newapi.pockgo.com/v1/images/generations`

**请求格式**（标准OpenAI格式）：
```json
{
  "model": "seedream-4.0",
  "prompt": "a beautiful sunset",
  "n": 1,
  "size": "1024x1024"
}
```

**支持的比例控制**：
- Gemini系列模型支持通过 `extra_body` 控制比例
- 其他模型通过 `size` 参数控制

### ModelScope API

**端点**：`https://api-inference.modelscope.cn/v1/chat/completions`

**请求格式**（OpenAI兼容）：
```json
{
  "model": "Qwen/Qwen3-Coder-480B-A35B-Instruct",
  "messages": [
    {"role": "user", "content": "Hello"}
  ],
  "max_tokens": 1000,
  "temperature": 0.7
}
```

**注意事项**：
- 可能不支持 `system` role
- 部分模型免费，但有调用次数限制
- 需要绑定阿里云账号

---

## ❓ 常见问题

### Q: 图像生成失败？
A: 
1. 检查Pockgo Image的API密钥是否正确
2. 在Settings中点击"测试连接"
3. 确认模型ID正确

### Q: AI助手不响应？
A: 
1. 检查ModelScope的API密钥是否配置
2. 复制 `.env.local.example` 为 `.env.local`
3. 重启开发服务器

### Q: 如何获取API密钥？
A: 
- **Pockgo**: 联系提供商
- **ModelScope**: https://modelscope.cn/my/myaccesstoken
- **Google**: https://ai.google.dev/
- **OpenRouter**: https://openrouter.ai/

### Q: 环境变量不生效？
A: 
1. 确认文件名为 `.env.local`（注意开头的点）
2. 重启开发服务器（`npm run dev`）
3. 检查文件内容格式正确

### Q: 如何部署到生产环境？
A: 
1. 在Vercel/Netlify等平台配置环境变量
2. 使用平台提供的环境变量管理界面
3. 不要将 `.env.local` 提交到git

---

## 🎯 配置验证

### 验证清单

- [ ] `.env.local` 文件已创建
- [ ] Pockgo Image 配置正确
- [ ] ModelScope 配置正确
- [ ] Settings页面显示配置状态
- [ ] AI Studio 可以生成图片
- [ ] AI助手可以正常对话
- [ ] 连接测试全部通过

---

## 📞 技术支持

如有问题：
1. 查看 `v4.0-快速使用指南.md`
2. 查看 `v4.0-全面升级完成报告.md`
3. 检查浏览器控制台错误信息

**配置完成后，所有功能即可正常使用！** 🎉

