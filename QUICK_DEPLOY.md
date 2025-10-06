# ⚡ 快速部署指南

## 🚀 一键部署到 Vercel

### 前提条件
- GitHub 账号
- Vercel 账号（可用 GitHub 登录）

### 步骤（5分钟完成）

#### 1. 推送到 GitHub
```bash
cd C:\Users\34023\Desktop\开发\imagine-engine

# 初始化 Git（如果还没有）
git init
git add .
git commit -m "Initial commit: Imagine Engine"

# 创建 GitHub 仓库后推送
git remote add origin https://github.com/你的用户名/imagine-engine.git
git branch -M main
git push -u origin main
```

#### 2. 部署到 Vercel
1. 访问 [vercel.com](https://vercel.com)
2. 点击 "New Project"
3. 选择你的 GitHub 仓库
4. 配置环境变量（**仅聊天功能需要，可跳过**）：
   - `NANO_BANANA_API_KEY`: 你的 API 密钥
5. 点击 "Deploy"
6. 等待 2-3 分钟

#### 3. 完成！🎉
- 访问 Vercel 提供的 URL
- 在应用的"设置"页面配置你的 API
- 开始创作！

---

## 🐳 Docker 部署

### 快速启动
```bash
# 构建
docker build -t imagine-engine .

# 运行
docker run -p 3000:3000 imagine-engine

# 访问 http://localhost:3000
```

### 使用 docker-compose
创建 `docker-compose.yml`：
```yaml
version: '3.8'
services:
  app:
    build: .
    ports:
      - "3000:3000"
    environment:
      - NANO_BANANA_API_KEY=${NANO_BANANA_API_KEY}
    restart: unless-stopped
```

运行：
```bash
docker-compose up -d
```

---

## 💡 其他平台

### Netlify
1. 连接 GitHub 仓库
2. 构建命令：`npm run build`
3. 发布目录：`.next`
4. 部署

### Railway
1. 连接 GitHub 仓库
2. 自动检测 Next.js
3. 添加环境变量（可选）
4. 部署

### Render
1. 创建 Web Service
2. 连接 GitHub 仓库
3. 构建命令：`npm install && npm run build`
4. 启动命令：`npm start`
5. 部署

---

## ⚙️ 环境变量说明

### 必需（仅聊天功能）
| 变量名 | 说明 | 示例 |
|--------|------|------|
| `NANO_BANANA_API_KEY` | API 密钥 | `sk-xxx...` |

### 可选
| 变量名 | 说明 | 默认值 |
|--------|------|--------|
| `NANO_BANANA_BASE_URL` | API 基础 URL | `https://newapi.aicohere.org/v1/chat/completions` |
| `IMAGE_API_BASE_URL` | 图片 API URL | `https://newapi.pockgo.com/v1/chat/completions` |

**注意**：文生图、编辑图、融合图功能不需要服务器端环境变量，用户在应用内"设置"页面配置即可。

---

## 🎯 部署后配置

1. 访问你的部署 URL
2. 首次访问会显示引导页面
3. 点击左侧导航的"设置"
4. 配置你的 API：
   - 选择 API 提供商
   - 填写 API 密钥
   - 填写基础 URL
   - 选择模型
5. 点击"保存配置"
6. 开始创作！

---

## 📞 需要帮助？

- 查看 [README.md](./README.md) 了解功能详情
- 查看 [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md) 了解详细部署指南
- 查看 [部署清单.md](./部署清单.md) 了解部署检查清单

祝部署顺利！🚀
