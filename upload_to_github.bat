@echo off
chcp 65001
echo ===============================================
echo 📤 上传项目到 GitHub
echo ===============================================
echo.

cd /d "%~dp0"

echo 🔧 配置 Git...
git config user.email "3402365924@qq.com"
git config user.name "sxxxx"

echo 📦 初始化 Git 仓库...
git init

echo ➕ 添加所有文件...
git add .

echo 💾 提交更改...
git commit -m "🎉 完整项目上传 - imagine-engine v0.5"

echo 🔗 添加远程仓库...
git remote remove origin 2>nul
git remote add origin https://github.com/sxxxxxxxxxxxxxxxxxxxxx/imagine-engine.git

echo 📤 推送到 GitHub...
git branch -M main
git push -u origin main --force

echo.
echo ===============================================
echo ✅ 上传完成！
echo ===============================================
echo 请访问: https://github.com/sxxxxxxxxxxxxxxxxxxxxx/imagine-engine
echo.
pause

