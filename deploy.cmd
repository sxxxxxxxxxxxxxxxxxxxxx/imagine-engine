@echo off
echo 🚀 Imagine Engine - 部署准备脚本
echo ================================
echo.

REM 检查 Node.js 版本
echo 📋 检查 Node.js 版本...
node --version
echo.

REM 安装依赖
echo 📦 安装依赖...
call npm install
echo.

REM 构建项目
echo 🔨 构建项目...
call npm run build
echo.

REM 检查构建结果
if exist ".next\" (
    echo ✅ 构建成功！
    echo.
    echo 📋 下一步：
    echo 1. 推送到 GitHub: git add . ^&^& git commit -m "部署准备" ^&^& git push
    echo 2. 访问 vercel.com 进行部署
    echo 3. 或运行: npm start 本地测试
    echo.
) else (
    echo ❌ 构建失败，请检查错误信息
    exit /b 1
)
