@echo off
chcp 65001 >nul
echo ========================================
echo   Imagine Engine - 更新 GitHub 仓库
echo ========================================
echo.

echo [1/4] 检查Git状态...
git status

echo.
echo [2/4] 添加所有更改到暂存区...
git add .

echo.
echo [3/4] 提交更改...
set /p commit_msg="请输入提交信息（直接回车使用默认）: "
if "%commit_msg%"=="" set commit_msg=chore: 项目优化和功能完善

git commit -m "%commit_msg%"

echo.
echo [4/4] 推送到GitHub...
git push origin main

echo.
echo ========================================
echo   ✅ 更新完成！
echo   已推送到GitHub仓库
echo ========================================
echo.
pause

