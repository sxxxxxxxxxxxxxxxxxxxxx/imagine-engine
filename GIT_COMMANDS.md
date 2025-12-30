# Git 命令快速参考

> 用于更新GitHub仓库

---

## 🚀 快速更新（3步）

### 方法1：使用批处理文件（Windows）

```bash
# 双击运行
update-github.bat
```

### 方法2：手动命令（跨平台）

```bash
# 1. 添加更改
git add .

# 2. 提交
git commit -m "feat: 功能描述"

# 3. 推送
git push origin main
```

---

## 📝 提交信息规范

### 类型前缀

- `feat:` 新功能
- `fix:` Bug修复
- `docs:` 文档更新
- `style:` 代码格式
- `refactor:` 重构
- `perf:` 性能优化
- `test:` 测试
- `chore:` 构建/工具

### 示例

```bash
# 新功能
git commit -m "feat: 新增多图融合功能，支持6张图片"

# Bug修复
git commit -m "fix: 修复图片下载CORS问题"

# 综合更新
git commit -m "chore: 项目全面优化 - 性能提升、功能完善、界面美化"
```

---

## 🔄 常用操作

### 查看状态

```bash
git status
```

### 查看历史

```bash
git log --oneline -10
```

### 撤销更改

```bash
# 撤销未暂存的更改
git checkout -- <file>

# 撤销已暂存的更改
git reset HEAD <file>
```

### 分支操作

```bash
# 创建新分支
git checkout -b feature/new-feature

# 切换分支
git checkout main

# 合并分支
git merge feature/new-feature
```

---

## ⚡ 快速命令

```bash
# 一键提交和推送
git add . && git commit -m "update" && git push

# 强制推送（慎用）
git push -f origin main

# 拉取最新代码
git pull origin main
```

---

**更多信息请查看：PROJECT_HANDOVER.md**

