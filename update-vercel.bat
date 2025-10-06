@echo off
chcp 65001 >nul
cd /d "C:\Users\34023\Desktop\开发\imagine-engine"
git add vercel.json
git commit -m "Fix vercel.json config"
git push origin master
echo.
echo Done!
pause
