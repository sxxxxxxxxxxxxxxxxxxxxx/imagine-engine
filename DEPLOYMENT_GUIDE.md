# 🚀 创想引擎 - 部署指南

**项目**: 创想引擎 v2.0  
**部署平台**: GitHub + 腾讯云 EdgeOne  
**部署方式**: Git仓库自动部署  

---

## 📋 部署前准备

### **确认项目完整**
```bash
# 检查项目文件
ls -la

应该包含:
✅ src/ (源代码)
✅ public/ (静态资源)
✅ package.json
✅ next.config.js
✅ tsconfig.json
✅ README_v2.md
✅ .gitignore
```

### **创建/检查 .gitignore**
```bash
# 确保以下内容在 .gitignore 中
node_modules/
.next/
out/
.env.local
.env*.local
.DS_Store
*.log
.vercel
.idea/
.vscode/
```

---

## 📤 第一步：上传到GitHub

### **1. 初始化Git仓库**
```bash
# 打开项目目录
cd C:\Users\34023\Desktop\开发\imagine-engine

# 初始化Git（如果还没初始化）
git init

# 查看状态
git status
```

### **2. 添加所有文件**
```bash
# 添加所有文件到Git
git add .

# 查看将要提交的文件
git status

# 提交
git commit -m "🎉 创想引擎 v2.0 - 完整功能版本

- 25+核心功能
- 9个模型提供商支持
- 75个提示词模板
- 60个创意案例
- 完整的设置和帮助系统
- 双主题、双语言
- 键盘快捷键支持
- 无损分辨率保持
- IndexedDB离线缓存
- 完整文档体系"
```

### **3. 在GitHub创建仓库**
```
1. 访问 https://github.com
2. 登录账号
3. 点击右上角 "+" → "New repository"
4. 填写信息:
   - Repository name: imagine-engine-v2
   - Description: 专业AI图像创作平台 - 功能强大、体验专业
   - Public/Private: 根据需要选择
   - ❌ 不要勾选 "Add README"（我们已有）
5. 点击 "Create repository"
```

### **4. 关联并推送到GitHub**
```bash
# 关联远程仓库（替换YOUR_USERNAME为你的GitHub用户名）
git remote add origin https://github.com/YOUR_USERNAME/imagine-engine-v2.git

# 推送到GitHub
git branch -M main
git push -u origin main

# 如果推送失败，可能需要先pull
git pull origin main --allow-unrelated-histories
git push -u origin main
```

### **5. 验证上传成功**
```
访问: https://github.com/YOUR_USERNAME/imagine-engine-v2
查看: 所有文件都已上传 ✅
```

---

## ☁️ 第二步：部署到腾讯云EdgeOne

### **EdgeOne部署流程**

#### **1. 登录EdgeOne控制台**
```
访问: https://console.cloud.tencent.com/edgeone
登录腾讯云账号
```

#### **2. 创建站点**
```
1. 点击"创建站点"
2. 选择"边缘函数"或"静态网站托管"
3. 输入站点名称: imagine-engine
```

#### **3. 配置Git部署**
```
在EdgeOne控制台:

1. 选择"Git仓库"部署方式
2. 点击"关联GitHub账号"
3. 授权EdgeOne访问GitHub
4. 选择仓库: YOUR_USERNAME/imagine-engine-v2
5. 选择分支: main
6. 配置构建:
   - 构建命令: npm run build
   - 输出目录: .next
   - 安装命令: npm install
```

#### **4. 配置环境变量（可选）**
```
EdgeOne控制台 → 环境变量:

注意: v2.0不需要配置环境变量
用户在应用中自行配置API密钥

可选配置:
NEXT_PUBLIC_APP_URL=https://your-domain.com
```

#### **5. 触发部署**
```
1. 点击"立即部署"
2. 等待构建完成（约2-5分钟）
3. 查看部署日志
4. 获取访问地址
```

---

## 🔧 Next.js配置优化

### **更新 next.config.js**
```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['localhost'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
      {
        protocol: 'http',
        hostname: '**',
      },
    ],
  },
  // EdgeOne部署优化
  output: 'standalone', // 推荐用于边缘部署
  
  // 环境变量
  env: {
    NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
  },
  
  // 性能优化
  compress: true,
  poweredByHeader: false,
}

module.exports = nextConfig
```

---

## 📝 创建部署配置文件

### **创建 .edgeonerc（可选）**
```json
{
  "name": "imagine-engine-v2",
  "build": {
    "command": "npm run build",
    "output": ".next",
    "install": "npm install"
  },
  "routes": [
    {
      "src": "/(.*)",
      "dest": "/$1"
    }
  ]
}
```

---

## 🌐 域名配置（可选）

### **1. 在EdgeOne绑定自定义域名**
```
1. 进入EdgeOne控制台
2. 选择站点
3. 点击"域名管理"
4. 添加自定义域名
5. 按照提示配置DNS
```

### **2. DNS配置**
```
在域名注册商（如阿里云、腾讯云）:
1. 添加CNAME记录
2. 指向EdgeOne提供的地址
3. 等待DNS生效（约10分钟）
```

---

## 🔄 持续部署

### **自动部署设置**
```
EdgeOne支持Git自动部署:

1. 推送代码到GitHub:
   git add .
   git commit -m "更新功能"
   git push

2. EdgeOne自动检测
   ↓
3. 自动构建部署
   ↓
4. 几分钟后更新上线 ✅

完全自动化！
```

---

## ⚠️ 部署注意事项

### **重要提醒**

1. **不要提交敏感信息**
   ```
   ❌ 不要提交 .env.local
   ❌ 不要提交 API密钥
   ❌ 不要提交 node_modules/
   
   ✅ 使用 .gitignore
   ✅ 环境变量在EdgeOne配置
   ```

2. **首次部署可能较慢**
   ```
   首次: 5-10分钟（下载依赖+构建）
   后续: 2-3分钟（增量构建）
   ```

3. **用户需要自行配置API**
   ```
   部署后，每个用户需要:
   1. 访问网站
   2. 点击"设置"
   3. 配置自己的API密钥
   4. 开始使用
   ```

---

## 🎯 完整部署流程

### **总流程（30分钟）**
```
第1步: 准备Git仓库（5分钟）
  ↓
第2步: 上传到GitHub（5分钟）
  ↓
第3步: 在EdgeOne创建站点（5分钟）
  ↓
第4步: 关联Git仓库（5分钟）
  ↓
第5步: 配置构建（5分钟）
  ↓
第6步: 触发部署（5分钟）
  ↓
完成！访问网站 ✅
```

---

## 📊 部署检查清单

### **部署前检查**
- [ ] 代码无错误（npm run build成功）
- [ ] .gitignore配置正确
- [ ] 无敏感信息
- [ ] package.json完整
- [ ] next.config.js优化

### **GitHub上传检查**
- [ ] 仓库创建成功
- [ ] 代码推送成功
- [ ] 所有文件可见
- [ ] README显示正常

### **EdgeOne部署检查**
- [ ] 站点创建成功
- [ ] Git仓库关联
- [ ] 构建配置正确
- [ ] 部署成功
- [ ] 网站可访问

---

## 🎨 EdgeOne部署命令

### **构建命令**
```bash
npm install
npm run build
```

### **启动命令**
```bash
npm start
```

### **输出目录**
```
.next/
```

---

## 🔍 故障排查

### **问题1: GitHub推送失败**
```bash
# 解决方案1: 检查远程仓库
git remote -v

# 解决方案2: 强制推送（慎用）
git push -u origin main --force

# 解决方案3: 使用个人访问令牌
# GitHub Settings → Developer settings → Personal access tokens
```

### **问题2: EdgeOne构建失败**
```
查看构建日志:
1. EdgeOne控制台
2. 点击"部署日志"
3. 查看错误信息
4. 根据错误修复

常见问题:
• 依赖安装失败 → 检查package.json
• 构建错误 → 本地先run build测试
• 内存不足 → 优化构建配置
```

### **问题3: 部署后无法访问**
```
检查:
1. 部署状态是否成功
2. 域名DNS是否生效
3. 浏览器缓存清除
4. 使用无痕模式测试
```

---

## 💡 最佳实践

### **版本管理**
```bash
# 开发新功能
git checkout -b feature/new-feature

# 提交更改
git add .
git commit -m "feat: 添加新功能"

# 合并到主分支
git checkout main
git merge feature/new-feature

# 推送到GitHub（自动部署）
git push
```

### **环境区分**
```
开发环境: npm run dev (本地)
预览环境: npm run build && npm start
生产环境: EdgeOne自动构建部署
```

---

## 🎉 部署成功后

### **分享您的作品**
```
访问地址:
https://your-site.edgeone.app
或
https://your-custom-domain.com

功能验证:
✅ 所有页面可访问
✅ 设置功能正常
✅ API调用正常（用户配置后）
✅ 所有功能可用
```

### **用户使用流程**
```
1. 访问网站
2. 首次引导自动显示
3. 引导配置API密钥
4. 开始创作 ✅
```

---

## 📞 需要帮助？

### **GitHub相关**
- 文档: https://docs.github.com
- Git教程: https://git-scm.com/book/zh/v2

### **EdgeOne相关**
- 文档: https://cloud.tencent.com/document/product/1552
- 控制台: https://console.cloud.tencent.com/edgeone

---

## 🎊 快速命令清单

```bash
# === GitHub上传 ===
cd C:\Users\34023\Desktop\开发\imagine-engine
git init
git add .
git commit -m "🎉 创想引擎 v2.0 完整版"
git remote add origin https://github.com/YOUR_USERNAME/imagine-engine-v2.git
git branch -M main
git push -u origin main

# === 后续更新 ===
git add .
git commit -m "更新: 描述你的更改"
git push

# EdgeOne会自动检测并部署 ✅
```

---

## 🎯 预计时间

```
GitHub上传: 5-10分钟
EdgeOne配置: 5-10分钟
首次部署: 5-10分钟
DNS生效: 10-60分钟（如果用自定义域名）

总计: 30-90分钟
```

---

**祝您部署顺利！** 🚀✨

有任何问题随时查看EdgeOne控制台的部署日志！😊

