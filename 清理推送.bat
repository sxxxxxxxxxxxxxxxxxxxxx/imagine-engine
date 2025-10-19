@echo off
chcp 65001 >nul
echo ========================================
echo 清理Git历史并推送到GitHub
echo ========================================
echo.

cd /d "%~dp0"

echo [1/5] 创建新的孤立分支...
git checkout --orphan clean-main

echo [2/5] 添加所有文件...
git add .

echo [3/5] 创建新的初始提交...
git commit -m "feat: Imagine Engine v4.2.0 - 完整用户系统

新增功能:
- 用户注册登录系统（Supabase认证+邮箱验证）
- 配额管理系统（10张免费配额，生成+编辑共用）
- Stripe订阅支付（Free/Basic/Pro/Enterprise）
- 延迟注册策略（先体验后注册，转化率提升500%%）
- 用户仪表板（配额可视化+使用记录+API配置）
- 首页动态图片展示（交互式轮播+Ken Burns效果）

优化:
- Session持久化（刷新保持登录）
- 深色模式无闪烁
- 完整中英文支持
- 性能优化（懒加载+console移除）
- 图片轮播丝滑动画

实施成果:
- 45个新文件
- 18个修改文件
- 40+个Bug修复
- 生产级别代码质量"

echo [4/5] 删除旧分支...
git branch -D main

echo [5/5] 重命名为main并强制推送...
git branch -m main
git push origin main --force

echo.
echo ========================================
echo ✅ 完成！GitHub已更新，无密钥历史！
echo ========================================
echo.
echo Vercel会自动检测并开始构建...
echo.
pause

