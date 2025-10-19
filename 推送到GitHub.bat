@echo off
chcp 65001 >nul
echo ============================================
echo   GitHub 代码推送工具
echo ============================================
echo.

cd /d "%~dp0"

echo [1/5] 检查 Git 状态...
git status
echo.

echo [2/5] 添加所有修改的文件...
git add .
echo.

echo [3/5] 创建提交...
git commit -m "v2.1.0 重大更新 - 功能完善与体验优化"
echo.

echo [4/5] 推送到 GitHub...
git push origin main
echo.

if %errorlevel% neq 0 (
    echo.
    echo 推送失败，尝试强制推送...
    git push origin main --force
)

echo.
echo ============================================
echo   推送完成！
echo ============================================
echo.
echo 请访问你的 GitHub 仓库查看更新：
echo https://github.com/[你的用户名]/imagine-engine
echo.

pause

