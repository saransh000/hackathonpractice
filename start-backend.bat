@echo off
echo ========================================
echo  STARTING BACKEND SERVER (Port 5000)
echo ========================================
echo.
cd /d "%~dp0backend"
npm run dev
pause
