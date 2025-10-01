@echo off
REM This batch file must be run as Administrator
REM Right-click and select "Run as administrator"

echo.
echo ========================================
echo  Hackathon Helper - Firewall Setup
echo ========================================
echo.
echo This will add firewall rules to allow
echo network access to your application.
echo.
echo Ports to open:
echo - 5000 (Backend API)
echo - 5173 (Frontend UI)
echo.
pause

echo.
echo Adding firewall rule for Backend (Port 5000)...
netsh advfirewall firewall add rule name="Hackathon Backend Port 5000" dir=in action=allow protocol=TCP localport=5000

echo.
echo Adding firewall rule for Frontend (Port 5173)...
netsh advfirewall firewall add rule name="Hackathon Frontend Port 5173" dir=in action=allow protocol=TCP localport=5173

echo.
echo ========================================
echo  Firewall Rules Added Successfully!
echo ========================================
echo.
echo Your friends can now access the application at:
echo http://172.26.81.221:5173
echo.
echo Login with:
echo Email: admin@hackathon.com
echo Password: admin123
echo.
pause
