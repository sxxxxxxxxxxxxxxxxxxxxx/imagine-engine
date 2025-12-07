# Imagine Engine - 专业AI图像创作平台

> 开箱即用的AI图像生成和编辑平台，支持多图融合、智能助手、批量处理

**当前版本**：v3.1.0  
**状态**：✅ 生产就绪  
**部署**：Vercel自动部署  

---

## ✨ 核心价值

- 🚀 **开箱即用** - 预配置API，立即可用，无需配置
- 🎨 **8+专业工具** - 证件照、去背景、图片放大、风格转换、画质增强、黑白上色等
- 🧪 **AI实验室** - Playground模型对比、参数调优、性能分析
- 🎭 **多图融合** - 支持6张图片智能融合，行业领先
- 🤖 **AI智能助手** - 浮动助手，Markdown格式，拖拽调整
- 📐 **精确比例控制** - 双重保险，输出比例100%准确
- 🎨 **110+案例库** - 丰富的学习资源和灵感
- 🌍 **完整中英文** - 262个翻译键，全面支持
- ⚡ **高性能** - 代码分割、请求队列、双层缓存

---

## 🎯 核心功能

### 🎭 多图融合（v4.1新增）⭐

**上传2-6张图片，AI智能融合生成全新作品**

- 点击或拖拽上传（自动压缩）
- 3列缩略图预览
- 拖拽排序调整顺序
- 6种专业融合模板
- 支持所有主流比例

**使用场景**：
- 🎨 风格融合（如：现代+复古+极简）
- 🧩 元素合成（如：人物+场景+道具）
- 🛍️ 商品图合成（多角度合成主图）
- ✨ 艺术创作（超现实主义融合）

---

### 🤖 AI智能助手⭐

**浮动球式智能助手，随时提供创作建议**

- 可拖拽到任意位置（自动保存位置）
- 可调整窗口大小（8方向调整）
- Markdown格式回答（代码块、列表、加粗）
- 点击浮动球Toggle开关
- 点击面板图标关闭
- ModelScope DeepSeek V3.1驱动

---

### 🎨 AI Studio - 图片生成

**三列布局，操作流程清晰**

- **纯文生图** - 描述即可生成
- **单图参考** - 基于参考图生成
- **多图融合** - 2-6张图智能融合
- 6种艺术风格（写实、动漫、油画、水彩、赛博朋克、极简）
- 智能比例控制（自动检测或强制指定）
- 批量生成（1/2/4张）
- 110+提示词模板库（与Showcase同步）
- 下载成功率98%（4重下载策略）
- 完整缩略图显示（object-contain）

---

### ✂️ Editor - 图片编辑

**三列并排布局，对比直观**

- **工具栏**（25%）- 编辑工具和参数
- **原图**（37.5%）- 实时预览
- **结果**（37.5%）- 编辑效果

**编辑功能**：
- 智能背景移除
- AI精确修复（Inpaint）
- 证件照制作

---

### 🛠️ Tools - AI工具箱（v3.1.0新增）⭐

**8+专业工具，即来即走，无需复杂配置**

#### 核心工具
- **证件照生成** (`/tools/id-photo`) - 5秒生成标准证件照，支持红/蓝/白背景
- **智能去背景** (`/tools/remove-bg`) - 1秒抠图，发丝级细节保留
- **图片放大** (`/tools/upscale`) - 无损放大4倍，保持画质清晰

#### 专业工具（v3.1.0新增）
- **艺术风格转换** (`/tools/style-transfer`) - 6种艺术风格：印象派、水彩画、油画、铅笔素描、波普艺术、抽象艺术
- **AI画质增强** (`/tools/enhance`) - 智能提升清晰度、优化色彩、减少噪点
- **黑白照片上色** (`/tools/colorize`) - AI智能上色，真实自然的色彩还原

**工具特点**：
- ✅ 统一的设计语言和主题色
- ✅ 极简UI，直达核心功能
- ✅ 明确的配额消耗说明
- ✅ 免费用户可用（每月20张配额）
- ✅ 一键下载，支持跨域图片

---

### 🧪 Playground - AI实验室（v3.1.0完善）⭐

**模型对比、参数调优、性能分析一站式平台**

- **模型对比** - 同时选择两个模型，并排对比生成效果
- **参数调优** - 自定义提示词、宽高比、艺术风格
- **API调试** - 查看API请求JSON，调试API调用
- **性能分析** - 对比生成时间、成本、Token使用量

**适用场景**：
- 🔬 测试不同模型的效果差异
- ⚙️ 优化生成参数
- 💰 对比不同模型的成本
- 🐛 调试API调用问题

---

### 📚 其他功能

- **Gallery** - 作品画廊（支持下载和编辑）
- **Showcase** - 110个精选案例（图生图/纯文生图分组）
- **Templates** - 提示词模板库（与Showcase数据同步）
- **Settings** - 商业化设置（开箱即用，支持自定义）
- **Docs** - 完整文档中心（完全汉化）
- **Pricing** - 定价页面（Free/Basic/Pro/Enterprise）

---

## 🚀 5分钟快速开始

### 1. 克隆项目

```bash
git clone https://github.com/yourusername/imagine-engine.git
cd imagine-engine
```

### 2. 安装依赖

```bash
npm install
```

### 3. 启动开发服务器

```bash
npm run dev
```

访问：**http://localhost:3000**

### 4. 开始使用

✅ **无需配置** - 默认API已预设，立即可用  
✅ **上传图片** - 支持拖拽，自动压缩  
✅ **开始创作** - 输入提示词，点击生成  

**就这么简单！** 🎉

---

## 🏗️ 技术栈

### 前端

- **框架**: Next.js 14（App Router）
- **语言**: TypeScript 5
- **样式**: Tailwind CSS 3
- **图标**: Lucide React
- **状态**: React Hooks + Zustand
- **Markdown**: react-markdown + syntax-highlighter

### 后端

- **API**: Next.js API Routes
- **图片生成**: Google Gemini 2.5 Flash Image
- **AI聊天**: ModelScope DeepSeek V3.1
- **缓存**: 双层缓存（内存+localStorage）
- **队列**: 请求队列管理（最多3并发）
- **限流**: 客户端速率限制

### 性能优化

- ✅ 代码分割和懒加载
- ✅ 图片自动压缩（最大1920px，质量80%）
- ✅ 请求队列管理
- ✅ 双层缓存系统
- ✅ 超时控制（30-60秒）
- ✅ 速率限制保护

**性能指标**：
- 首屏加载：2.2s（提升37%）
- LCP：1.6s
- Bundle大小：550KB（减少31%）
- 下载成功率：98%
- 整体健康度：4.8/5.0

---

## 📦 部署

### Vercel（推荐）⭐

1. 连接GitHub仓库
2. 自动部署
3. ✅ **无需配置环境变量**（API密钥在客户端自动初始化）

**就这么简单！**

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/yourusername/imagine-engine)

### Docker

```bash
docker build -t imagine-engine .
docker run -p 3000:3000 imagine-engine
```

### 手动部署

```bash
npm run build
npm start
```

---

## 📖 文档

### 用户指南

- 📘 [项目交接文档](./PROJECT_HANDOVER.md) - 完整技术文档和架构说明
- 🎭 [多图融合指南](./🎭%20多图融合功能完整指南.md) - 多图融合功能详解
- 🎮 [AI助手指南](./🎮%20AI助手完整使用指南.md) - AI助手使用教程
- 🎉 [v4.0完整报告](./🎉%20v4.0完全就绪-最终报告.md) - 版本说明
- 🚀 [快速测试指南](./🚀%20立即测试指南.md) - 功能快速测试
- ⚡ [多图融合快速参考](./⚡%20多图融合快速参考.md) - 速查卡

### 开发文档

- 📝 [Git命令参考](./GIT_COMMANDS.md) - Git操作指南
- 🔧 [API配置说明](./API配置说明.md) - API详细配置
- 📊 [清理总结](./CLEANUP_SUMMARY.md) - 项目清理记录
- 🎨 [设计系统](./DESIGN_SYSTEM.md) - UI/UX设计规范
- 📋 [变更日志](./CHANGELOG.md) - 版本历史

---

## 💡 核心特性详解

### 多图融合工作原理

1. **上传多张图片**（自动压缩到1920px，质量80%）
2. **AI分析**：提取每张图的风格、元素、构图
3. **智能融合**：根据提示词融合成全新作品
4. **精确输出**：保持用户指定的比例和风格

### 比例控制机制

**自动模式**（selectedRatio = 'auto'）：
- 单图：检测图片比例，使用最接近的标准比例
- 多图/无图：默认使用1:1

**强制模式**（用户选择具体比例）：
- 创建对应尺寸的空白画布（如16:9 = 1920x1080）
- 增强提示词加入比例信息
- 双重保险确保输出准确

### 图片下载策略

**4重下载保障**：
1. 服务端代理下载（主要，98%成功）
2. CORS直接fetch（备用）
3. 新窗口打开（兜底）
4. 友好错误提示

---

## 🎓 新人上手

### 3天上手计划

**Day 1**：环境搭建
1. 克隆项目 → 安装依赖 → 启动服务器
2. 浏览所有功能页面
3. 阅读 README.md 和 v4.0报告

**Day 2**：理解架构
1. 查看项目结构（`src/`目录）
2. 理解核心组件（AIAssistant, PromptGallery等）
3. 理解API调用流程
4. 阅读 PROJECT_HANDOVER.md

**Day 3**：开始开发
1. 修改简单功能（文案、样式）
2. 理解状态管理
3. 学习核心功能实现
4. 开始独立开发

---

## 🎨 功能亮点

### 用户体验

- ✅ **无配置启动** - 新用户无需任何设置
- ✅ **统一设计语言** - 所有工具页面统一主题色和视觉风格
- ✅ **即来即走** - 工具页面极简设计，直达核心功能
- ✅ **智能提示** - 网络状态监控、错误智能识别
- ✅ **完整缩略图** - 所有图片完整显示（object-contain）
- ✅ **拖拽排序** - 图片顺序可随意调整
- ✅ **跨域下载** - 支持跨域图片下载，使用服务端代理
- ✅ **响应式设计** - 完美适配各种屏幕

### 开发体验

- ✅ **TypeScript严格类型** - 代码质量保证
- ✅ **0 Linter错误** - 代码规范统一
- ✅ **完整注释** - 核心函数都有说明
- ✅ **模块化设计** - 组件复用性高
- ✅ **性能优化** - 内置最佳实践

---

## 📊 项目统计

| 指标 | 数值 |
|------|------|
| 源代码行数 | ~14,500+ |
| 组件数量 | 35+ |
| API路由 | 7个 |
| 工具页面 | 8+ |
| 提示词模板 | 110+ |
| 多语言支持 | 中文+英文 |
| 性能评分 | 4.8/5.0 |

---

## 🔐 安全和隐私

- ✅ API密钥存储在客户端localStorage（可自定义）
- ✅ 图片域名白名单（防止恶意图片）
- ✅ 速率限制（防止API滥用）
- ✅ 超时控制（防止无限等待）
- ✅ 错误恢复机制（友好提示）

---

## 🤝 贡献指南

欢迎提交Issue和Pull Request！

### 开发流程

1. Fork项目
2. 创建特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'feat: 添加某某功能'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 提交Pull Request

### 提交信息规范

遵循 [Conventional Commits](https://www.conventionalcommits.org/)：

- `feat:` 新功能
- `fix:` Bug修复
- `docs:` 文档更新
- `style:` 代码格式
- `refactor:` 重构
- `perf:` 性能优化
- `test:` 测试
- `chore:` 构建/工具

---

## 📄 许可证

MIT License - 详见 [LICENSE](./LICENSE) 文件

---

## 🙏 致谢

### AI服务提供商

- [Google Gemini](https://ai.google.dev/) - 图片生成（Gemini 2.5 Flash Image）
- [ModelScope](https://modelscope.cn/) - AI聊天（DeepSeek V3.1）
- [Pockgo](https://pockgo.com/) - API服务

### 技术框架

- [Next.js](https://nextjs.org/) - React框架
- [Tailwind CSS](https://tailwindcss.com/) - CSS框架
- [Lucide](https://lucide.dev/) - 图标库
- [Vercel](https://vercel.com/) - 部署平台

### 开源项目

- [Awesome-Nano-Banana-images](https://github.com/PicoTrex/Awesome-Nano-Banana-images) - 110+精选案例
- 所有开源贡献者

---

## 📞 联系方式

- **项目主页**: https://github.com/yourusername/imagine-engine
- **问题反馈**: [GitHub Issues](https://github.com/yourusername/imagine-engine/issues)
- **文档**: 查看 [PROJECT_HANDOVER.md](./PROJECT_HANDOVER.md)

---

## 🎉 开始创作

访问 **http://localhost:3000**，体验专业的AI图像创作！

**无需配置，立即可用！** 🚀✨

---

*最后更新：2025-12-06*  
*版本：v3.1.0*  
*Made with ❤️ by Imagine Engine Team*

---

## 📋 版本历史

查看 [CHANGELOG.md](./CHANGELOG.md) 了解详细的版本更新历史。

### 最新版本 v3.1.0 (2025-12-06)

**主要更新**：
- 🎨 UI/UX全面优化：统一主题色，移除渐变效果
- 🆕 新增3个专业工具：风格转换、画质增强、黑白上色
- 🧪 Playground功能完善：模型对比、参数调优、API调试、性能分析
- 🔧 技术改进：API调用统一化、下载功能优化
- 🐛 Bug修复：修复部署问题、下载跳转问题、API路径问题

**详细更新日志**：查看 [CHANGELOG.md](./CHANGELOG.md)
