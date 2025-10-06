@echo off
chcp 65001
echo ========================================
echo 正在修复 TypeScript 错误并推送到 GitHub
echo ========================================
echo.

cd C:\Users\34023\Desktop\开发\imagine-engine

echo [1/3] 添加修改...
git add .
echo OK
echo.

echo [2/3] 创建提交...
git commit -m "Fix-TypeScript-error-and-vercel-config"
echo OK
echo.

echo [3/3] 推送到 GitHub...
git push origin master
echo OK
echo.

echo ========================================
echo 完成！请返回 Vercel 重新部署
echo ========================================
pause

