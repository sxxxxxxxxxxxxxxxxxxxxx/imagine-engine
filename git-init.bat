@echo off
echo ============================================
echo Git 初始化配置脚本
echo ============================================
echo.

cd /d C:\Users\34023\Desktop\开发\imagine-engine

echo 配置Git用户信息...
git config user.name "Imagine Engine Team"
git config user.email "imagine-engine@example.com"

echo.
echo 检查Git状态...
git status

echo.
echo 添加所有文件...
git add .

echo.
echo 创建初始提交...
git commit -m "🎉 Imagine Engine v2.0.0 - Production Ready"

echo.
echo ============================================
echo Git 配置完成！
echo ============================================
echo.
echo 下一步:
echo 1. 在GitHub创建新仓库
echo 2. 运行: git remote add origin <你的仓库URL>
echo 3. 运行: git push -u origin main
echo.
pause
