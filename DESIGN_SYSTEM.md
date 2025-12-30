# Tech Minimal 设计系统规范

> 创想引擎 v3.0 专业级设计系统

## 🎯 设计理念

### 核心价值
- **极简主义**：减少视觉噪音，专注内容
- **功能优先**：每个元素都有明确用途  
- **专业感**：B端产品级别的精致与克制
- **技术感**：面向开发者和技术尝鲜者

### 设计参考
- Linear（项目管理）
- Vercel（开发部署）  
- Raycast（效率工具）
- GitHub（代码托管）

---

## 🎨 配色系统

### 主色：青绿色（Teal）
科技感、冷静、专业

```css
primary-400: #2DD4BF  /* 主要按钮、强调元素 */
primary-500: #14B8A6  /* Hover状态 */
primary-600: #0D9488  /* Active状态 */
```

**使用场景**：
- 主要操作按钮
- 链接
- 选中状态
- 进度条

---

### 强调色：琥珀色（Amber）
温暖、注意、重要

```css
accent-400: #F59E0B   /* CTA按钮、警告提示 */
accent-500: #D97706   /* Hover状态 */
accent-600: #B45309   /* Active状态 */
```

**使用场景**：
- CTA（Call to Action）按钮
- 重要提示
- 升级/付费相关
- 错误警告（替代红色）

---

### 中性色：深色系（Dark）
文字、边框、背景

```css
/* 浅色模式 */
dark-900: #0F172A    /* 主要文字 */
dark-700: #334155    /* 次要文字 */
dark-400: #94A3B8    /* 占位符、禁用 */
dark-200: #E2E8F0    /* 边框 */
dark-50:  #F8FAFC    /* 背景 */

/* 深色模式 */
dark-950: #0A0E27    /* 背景 */
dark-900: #0F172A    /* 卡片背景 */
dark-800: #1E293B    /* 边框 */
dark-50:  #F8FAFC    /* 文字 */
```

---

## 🔤 字体系统

### 字体家族

```css
/* 无衬线字体（UI） */
font-sans: Inter, SF Pro Display, -apple-system, system-ui

/* 等宽字体（代码） */
font-mono: JetBrains Mono, Menlo, Monaco, Courier New
```

### 字体大小

| 用途 | Class | 大小 | 行高 |
|------|-------|------|------|
| 大标题 | `text-3xl` | 30px | 1.2 |
| 中标题 | `text-2xl` | 24px | 1.3 |
| 小标题 | `text-xl` | 20px | 1.4 |
| 正文 | `text-base` | 16px | 1.5 |
| 小字 | `text-sm` | 14px | 1.5 |
| 极小字 | `text-xs` | 12px | 1.4 |

### 字重

| 用途 | Class | 字重 |
|------|-------|------|
| 常规 | `font-normal` | 400 |
| 中等 | `font-medium` | 500 |
| 半粗 | `font-semibold` | 600 |
| 粗体 | `font-bold` | 700 |

---

## 📦 间距系统

### 规则
- 使用 4px 的倍数
- 优先使用预设值

### 预设值

| Class | 尺寸 | 用途 |
|-------|------|------|
| `p-2` | 8px | 紧凑元素内边距 |
| `p-3` | 12px | 按钮内边距 |
| `p-4` | 16px | 卡片内边距 |
| `p-6` | 24px | 区块内边距 |
| `p-8` | 32px | 大区块内边距 |
| `gap-2` | 8px | 元素间距（紧凑） |
| `gap-3` | 12px | 元素间距（标准） |
| `gap-4` | 16px | 元素间距（宽松） |

---

## 🔘 组件规范

### 按钮（Button）

#### Primary Button
```tsx
<button className="btn-primary">
  生成图片
</button>
```
- 青绿色实心
- 白色文字
- 圆角 6px
- 阴影效果
- Hover时加深

#### Secondary Button
```tsx
<button className="btn-secondary">
  取消
</button>
```
- 透明背景
- 灰色描边
- 灰色文字
- Hover时浅灰背景

#### Danger Button
```tsx
<button className="btn-danger">
  删除
</button>
```
- 琥珀色实心（替代红色）
- 白色文字
- 用于重要警告操作

#### Ghost Button
```tsx
<button className="btn-ghost">
  <Icon />
</button>
```
- 完全透明
- 仅在 Hover 时显示背景
- 适合工具栏图标按钮

---

### 卡片（Card）

#### 标准卡片
```tsx
<div className="card p-6">
  内容
</div>
```
- 白色/深色背景
- 1px 边框
- 8px 圆角
- 微小阴影

#### 可交互卡片
```tsx
<div className="card-hover p-6 cursor-pointer">
  点击我
</div>
```
- Hover时边框变青绿色
- 阴影加深
- 适合可点击的卡片

#### 浮起卡片
```tsx
<div className="card-elevated p-6">
  重要内容
</div>
```
- 更明显的阴影
- 适合模态框、下拉菜单

---

### 输入框（Input）

#### 文本输入
```tsx
<input 
  type="text" 
  className="input"
  placeholder="请输入..."
/>
```

#### 文本域
```tsx
<textarea 
  className="textarea"
  rows={4}
/>
```

#### 选择框
```tsx
<select className="select">
  <option>选项1</option>
</select>
```

**规范**：
- 圆角 6px
- 聚焦时青绿色边框高亮
- placeholder 使用灰色文字

---

### 徽章（Badge）

```tsx
<span className="badge-primary">New</span>
<span className="badge-accent">Pro</span>
<span className="badge-neutral">Beta</span>
```

**规范**：
- 小写或首字母大写
- 不超过 6 个字符
- 圆角 99px（完全圆润）

---

## 🎭 图标系统

### 来源
- Lucide Icons（推荐）
- Heroicons（备选）

### 规范
- 统一使用 20px × 20px（text-sm 时用 16px）
- 线条粗细：1.5px
- 颜色跟随文字颜色
- 使用 `stroke-current`

### 示例
```tsx
import { Search, Settings, User } from 'lucide-react';

<Search className="w-5 h-5 text-dark-600" />
```

---

## 🌓 暗黑模式

### 切换方式
```tsx
import { useTheme } from '@/contexts/ThemeContext';

const { theme, toggleTheme } = useTheme();

<button onClick={toggleTheme}>
  {theme === 'light' ? '🌙' : '☀️'}
</button>
```

### CSS 编写
```css
/* 使用 dark: 前缀 */
.card {
  @apply bg-white dark:bg-dark-900 
         border-dark-200 dark:border-dark-800 
         text-dark-900 dark:text-dark-50;
}
```

### 原则
- 深色模式优先（Dark First）
- 避免纯黑 (#000000)
- 保持足够对比度
- 边框颜色也要调整

---

## 📐 布局规范

### 页面容器
```tsx
<div className="page-container">
  <div className="content-wrapper">
    {/* 内容区域 */}
  </div>
</div>
```

### 最大宽度
- 内容区：`max-w-7xl`（1280px）
- 阅读区：`max-w-3xl`（768px）
- 窄栏：`max-w-md`（448px）

### 断点
```css
sm: 640px   /* 手机横屏 */
md: 768px   /* 平板 */
lg: 1024px  /* 桌面 */
xl: 1280px  /* 大屏 */
2xl: 1536px /* 超大屏 */
```

---

## ✨ 动画效果

### 使用原则
- 快速（200-300ms）
- 流畅（ease-out, ease-in-out）
- 有意义（不为动画而动画）
- 可禁用（尊重 prefers-reduced-motion）

### 预设动画

#### 淡入
```tsx
<div className="animate-fade-in">
  内容
</div>
```

#### 上滑
```tsx
<div className="animate-slide-up">
  内容
</div>
```

#### 加载旋转
```tsx
<div className="loading-spinner" />
```

---

## 🚫 禁止事项

### ❌ 不要使用

1. **过度渐变**
   - ❌ `bg-gradient-to-r from-purple-500 to-pink-500`
   - ✅ 单色或微妙渐变

2. **彩虹色Emoji**
   - ❌ 功能性按钮中使用 emoji
   - ✅ 使用标准图标

3. **过度动画**
   - ❌ 无意义的旋转、缩放、跳动
   - ✅ 简单的淡入、滑动

4. **花哨字体**
   - ❌ Orbitron、Pacifico 等装饰性字体
   - ✅ Inter、SF Pro 等无衬线字体

5. **低对比度**
   - ❌ 浅灰色文字 + 白色背景
   - ✅ 深色文字 + 白色背景

---

## 📱 响应式设计

### 移动优先
```tsx
// ❌ 错误
<div className="lg:hidden md:block">

// ✅ 正确  
<div className="block lg:hidden">
```

### 断点使用
```tsx
<div className="
  grid 
  grid-cols-1 
  md:grid-cols-2 
  lg:grid-cols-3
">
```

---

## 🎯 可访问性

### 对比度
- 正文文字：至少 4.5:1
- 大号文字：至少 3:1
- 图形元素：至少 3:1

### 焦点状态
- 所有交互元素必须有明确的焦点样式
- 使用 `focus:ring-2 focus:ring-primary-400`

### 语义化
- 使用正确的 HTML 标签
- 按钮用 `<button>`，链接用 `<a>`
- 表单标签用 `<label>`

---

## 📚 代码示例

### 完整页面布局
```tsx
export default function ExamplePage() {
  return (
    <div className="page-container">
      <div className="content-wrapper">
        {/* 页头 */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-dark-900 dark:text-dark-50">
            页面标题
          </h1>
          <p className="text-dark-600 dark:text-dark-400 mt-2">
            页面描述文字
          </p>
        </div>

        {/* 内容区域 */}
        <div className="grid md:grid-cols-2 gap-6">
          <div className="card p-6">
            <h2 className="text-xl font-semibold mb-4">卡片标题</h2>
            <p className="text-dark-600 dark:text-dark-400">
              卡片内容
            </p>
            <button className="btn-primary mt-4">
              操作按钮
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
```

---

## 🔄 更新日志

### v3.0.0 (2025-01-16)
- ✅ 建立 Tech Minimal 设计系统
- ✅ 定义青绿色 + 琥珀色双主色方案
- ✅ 规范组件库（按钮、卡片、输入框等）
- ✅ 完善暗黑模式支持
- ✅ 移除 AI 味道的装饰性元素

---

## 📧 反馈

设计系统是活文档，欢迎提出改进建议！

