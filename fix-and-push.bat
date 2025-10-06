@echo off
echo Updating vercel.json...
cd C:\Users\34023\Desktop\开发\imagine-engine
git add vercel.json
git commit -m "fix-vercel-config"
git push origin master
echo Done!
pause
