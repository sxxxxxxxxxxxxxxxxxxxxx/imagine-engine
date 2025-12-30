# 🎨 Imagine Engine 设计系统 V2.0

> 统一的视觉规范 - 主推Basic版本策略

---

## 核心设计原则

### 1. 视觉层级
- **主推元素**（Basic卡片）：最大、最亮、最突出
- **次要元素**（Free/Pro）：适中大小，中性色调
- **辅助元素**（说明文字）：小字号，低对比度

### 2. 交互反馈
- **悬停**：轻微放大（scale-105）+ 阴影增强
- **点击**：立即视觉反馈
- **加载**：清晰的loading状态

### 3. 情感化设计
- **信任**：使用"✓"绿色图标、用户评价、数字证明
- **紧迫**：限时标签、剩余配额提示（谨慎使用）
- **说服**：节省金额、对比计算器

---

## 按钮设计规范

### 主按钮（用于Basic CTA）
```typescript
className="bg-gradient-to-r from-primary-500 to-purple-600 
           hover:from-primary-600 hover:to-purple-700 
           text-white font-bold
           shadow-lg hover:shadow-xl 
           hover:scale-105 
           transition-all duration-200
           py-4 px-8 rounded-xl"
```

**使用场景**：
- Basic版本订阅按钮
- 重要的转化行动按钮
- 工具页面的"开始使用"按钮

### 次要按钮（用于Free/Pro）
```typescript
className="border-2 border-dark-300 dark:border-dark-700 
           text-dark-700 dark:text-dark-300
           hover:bg-dark-100 dark:hover:bg-dark-800 
           font-semibold
           py-3 px-6 rounded-lg
           transition-all"
```

### 禁用按钮
```typescript
className="bg-dark-200 dark:bg-dark-800 
           text-dark-500 
           cursor-not-allowed 
           opacity-50
           py-3 px-6 rounded-lg"
```

---

## 卡片设计规范

### 标准卡片
```typescript
className="bg-white dark:bg-dark-900 
           border-2 border-dark-200 dark:border-dark-800 
           rounded-xl 
           p-6
           shadow-md hover:shadow-lg 
           transition-shadow"
```

### 突出卡片（用于Basic）
```typescript
className="bg-gradient-to-br from-white via-primary-50/30 to-white 
           dark:from-dark-900 dark:via-primary-950/30 dark:to-dark-900
           border-4 border-primary-500 
           rounded-2xl 
           p-8
           shadow-2xl
           relative
           scale-110  /* 放大10% */
           z-10"
```

**特殊效果**：
- 脉冲动画边框
- 渐变背景
- 更大的内边距

---

## 配色系统

### 主色调
```css
Primary（主推色）:
  - 500: #3B82F6 (用于Basic)
  - 600: #2563EB
  
Accent（强调色）:
  - 紫色: #8B5CF6 (用于渐变)
  - 红色: #EF4444 (用于徽章)
```

### 功能色
```css
Success（成功/节省）:
  - 500: #10B981
  - 使用场景："节省93%"标签

Warning（警告/紧急）:
  - 500: #F59E0B
  - 使用场景："剩余配额"提示

Error（错误）:
  - 500: #EF4444
  - 使用场景：配额耗尽、错误提示
```

### 中性色
```css
Dark系列（深色模式适配）:
  - 50: #F9FAFB (浅色背景)
  - 900: #111827 (深色背景)
  - 950: #030712 (最深背景)
```

---

## 徽章/标签设计

### 推荐徽章（Basic专用）
```typescript
<div className="px-6 py-2 
                bg-gradient-to-r from-red-500 to-orange-500 
                text-white text-sm font-bold 
                rounded-full shadow-lg">
  🔥 最受欢迎
</div>
```

### 节省标签
```typescript
<div className="px-3 py-1 
                bg-green-100 dark:bg-green-900/30 
                text-green-700 dark:text-green-400 
                text-xs font-bold rounded-full">
  💰 节省93%
</div>
```

### 权限标签
```typescript
<span className="px-2 py-1 
                 bg-purple-100 dark:bg-purple-900/30 
                 text-purple-700 dark:text-purple-400 
                 text-xs rounded-full 
                 flex items-center gap-1">
  <Lock className="w-3 h-3" />
  Basic及以上
</span>
```

---

## 动画效果

### 卡片悬停
```css
transition: all 0.2s ease;

&:hover {
  transform: translateY(-4px) scale(1.02);
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
}
```

### Basic卡片脉冲
```css
@keyframes pulse-border {
  0%, 100% {
    box-shadow: 0 0 0 0 rgba(59, 130, 246, 0.7);
  }
  50% {
    box-shadow: 0 0 0 10px rgba(59, 130, 246, 0);
  }
}

animation: pulse-border 2s infinite;
```

### 加载动画
```typescript
<Loader2 className="w-6 h-6 animate-spin" />
```

---

## 排版规范

### 标题层级
```css
H1（页面主标题）: text-5xl font-bold
H2（区域标题）: text-3xl font-bold  
H3（卡片标题）: text-2xl font-bold
H4（小标题）: text-lg font-semibold
```

### 正文
```css
大号正文: text-xl (Hero副标题)
标准正文: text-base
小号正文: text-sm (说明文字)
极小文字: text-xs (标签、提示)
```

### 字重
```css
特别强调: font-bold (700)
标题/按钮: font-semibold (600)
正文: font-medium (500)
次要文字: font-normal (400)
```

---

## 间距系统

### 内边距
```css
卡片内边距: p-6 (标准), p-8 (大卡片)
按钮内边距: py-3 px-6 (标准), py-4 px-8 (大按钮)
```

### 外边距
```css
区域间距: mb-12 (页面区域)
元素间距: gap-6 (网格), gap-4 (卡片内)
```

---

## 响应式断点

### 移动端（<768px）
- 单列布局
- 字体缩小一级
- 底部固定CTA按钮
- Basic卡片不放大（保持100%）

### 平板（768px-1024px）
- 双列布局
- 标准字体
- Basic卡片略微放大（105%）

### 桌面（>1024px）
- 三列或四列布局
- 完整效果
- Basic卡片放大110%

---

## 特殊组件

### 成本计算器
```typescript
- 滑块范围：50-500张
- 实时计算节省金额
- 突出显示差价
- 底部CTA："立即订阅Basic省钱"
```

### 转化引导CTA
```typescript
位置：工具页面底部
样式：渐变背景卡片（primary到purple）
文案："升级Basic获得200张配额"
按钮：大号主按钮
```

---

## 实施检查清单

### 定价相关
- [x] Basic卡片最大化显示
- [x] "最受欢迎"徽章
- [x] 节省百分比标签
- [x] 成本对比计算器
- [x] 用户评价展示
- [x] 引导文案（90%选择）

### 工具页面
- [x] 极简UI（3步流程）
- [x] 配额消耗明确提示
- [x] 即来即走体验
- [x] 引导注册/订阅Basic

### 分析系统
- [x] Clarity集成
- [x] 行为数据库
- [x] 转化漏斗
- [x] 工具使用统计

---

**🎨 所有核心设计规范已制定！**

