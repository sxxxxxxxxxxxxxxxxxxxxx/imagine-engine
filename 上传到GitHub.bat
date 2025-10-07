@echo off
chcp 65001
cls
echo ================================================
echo   上传 Imagine Engine 到 GitHub
echo ================================================
echo.

cd /d C:\Users\34023\Desktop\开发\imagine-engine

echo [1/6] 检查Git仓库...
if not exist .git (
    echo 初始化Git仓库...
    git init
)
echo.

echo [2/6] 配置Git用户信息...
git config user.name "sxxxxxxxxxxxxxxxxxxxxx"
git config user.email "3402365924@qq.com"
echo ✓ 用户信息已配置
echo.

echo [3/6] 检查远程仓库...
git remote remove origin 2>nul
git remote add origin https://github.com/sxxxxxxxxxxxxxxxxxxxxx/imagine-engine.git
echo ✓ 远程仓库已配置
echo.

echo [4/6] 添加所有文件...
git add .
echo ✓ 文件已添加
echo.

echo [5/6] 创建提交...
git commit -m "v2.0.0 生产版本 - 基于Nano Banana AI技术 - 完整优化版"
echo ✓ 提交已创建
echo.

echo [6/6] 推送到GitHub...
git branch -M main
git push -u origin main --force
echo.

echo ================================================
echo   ✅ 上传完成！
echo ================================================
echo.
echo 访问你的GitHub仓库:
echo https://github.com/sxxxxxxxxxxxxxxxxxxxxx/imagine-engine
echo.
pause
