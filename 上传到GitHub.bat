@echo off
chcp 65001 >nul
echo ======================================
echo   正在上传到 GitHub...
echo ======================================
echo.

cd /d "C:\Users\34023\Desktop\开发\imagine-engine"

echo [1/3] 添加所有更改...
git add -A
if %errorlevel% neq 0 (
    echo 错误：添加文件失败！
    pause
    exit /b 1
)
echo ✓ 文件添加成功
echo.

echo [2/3] 创建提交...
git commit -m "Deploy ready: clean docs and add deployment config"
if %errorlevel% neq 0 (
    echo 错误：创建提交失败！
    pause
    exit /b 1
)
echo ✓ 提交创建成功
echo.

echo [3/3] 推送到 GitHub...
git push origin master
if %errorlevel% neq 0 (
    echo 错误：推送失败！可能需要输入用户名和密码
    pause
    exit /b 1
)
echo ✓ 推送成功！
echo.

echo ======================================
echo   🎉 上传完成！
echo ======================================
echo.
echo 访问你的仓库查看：
echo https://github.com/sxxxxxxxxxxxxxxxxxxxxx/imagine-engine
echo.
pause
