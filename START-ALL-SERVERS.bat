@echo off
echo ========================================
echo  STARTING BOTH SERVERS
echo ========================================
echo.
echo Starting Backend Server (Port 5000)...
start "Backend Server" cmd /k "cd /d %~dp0backend && npm run dev"
timeout /t 3 /nobreak > nul

echo Starting Frontend Server (Port 5173)...
start "Frontend Server" cmd /k "cd /d %~dp0 && npm run dev"

echo.
echo ========================================
echo  SERVERS STARTED!
echo ========================================
echo Backend:  http://localhost:5000
echo Frontend: http://localhost:5173
echo.
echo Press any key to close this window...
echo (Servers will keep running in separate windows)
pause > nul
