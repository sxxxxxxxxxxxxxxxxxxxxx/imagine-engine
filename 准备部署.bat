@echo off
chcp 65001
cls
echo ================================================
echo   Imagine Engine v2.0.0 - 准备部署
echo ================================================
echo.

cd /d C:\Users\34023\Desktop\开发\imagine-engine

echo [1/4] 配置Git用户信息...
git config user.name "Imagine Engine Team"
git config user.email "imagine-engine@example.com"
echo ✓ Git用户信息已配置
echo.

echo [2/4] 添加所有文件...
git add .
echo ✓ 文件已添加
echo.

echo [3/4] 创建提交...
git commit -m "v2.0.0 生产版本 - 基于Nano Banana AI - 已优化并清理"
echo ✓ 提交已创建
echo.

echo [4/4] 查看Git状态...
git status
echo.

echo ================================================
echo   ✅ Git准备完成！
echo ================================================
echo.
echo 下一步操作:
echo.
echo 1. 在GitHub创建新仓库 imagine-engine
echo 2. 复制仓库URL
echo 3. 运行命令:
echo    git remote add origin https://github.com/你的用户名/imagine-engine.git
echo    git branch -M main
echo    git push -u origin main
echo.
echo 或者直接运行 deploy.cmd 一键部署
echo.
pause
