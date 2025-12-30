# Microsoft Clarity 集成指南

## 设置步骤

### 1. 注册Clarity项目
1. 访问 https://clarity.microsoft.com/
2. 使用Microsoft账号登录
3. 创建新项目
4. 项目名称：Imagine Engine
5. 网站URL：你的域名
6. 复制项目ID

### 2. 配置环境变量
在 `.env.local` 文件中添加：
```
NEXT_PUBLIC_CLARITY_PROJECT_ID=your_project_id_here
```

### 3. 验证
- 访问网站并进行一些操作
- 30分钟后登录Clarity仪表板
- 查看是否有数据采集

## 已集成的跟踪
✅ 代码已添加到 `src/app/layout.tsx`
✅ 仅在设置了环境变量时加载
✅ 自动跟踪所有页面访问
✅ 自动录制用户会话
✅ 自动生成热力图

## 关键指标监控
在Clarity中重点关注：
- Basic定价卡片的点击率
- 注册转化漏斗
- 工具页面的使用率
- 配额用完后的行为路径

