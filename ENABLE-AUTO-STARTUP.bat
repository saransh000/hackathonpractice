@echo off
REM This script adds the Hackathon Helper servers to Windows Startup
REM Run this ONCE as Administrator

echo ========================================
echo  AUTO-STARTUP CONFIGURATION
echo ========================================
echo.
echo This will make your servers start automatically
echo when Windows boots up.
echo.
pause

REM Get the current directory
set "SCRIPT_DIR=%~dp0"

REM Create a VBS script to run the batch file without showing console
echo Set WshShell = CreateObject("WScript.Shell") > "%TEMP%\invisible.vbs"
echo WshShell.Run chr(34) ^& "%SCRIPT_DIR%START-ALL-SERVERS.bat" ^& Chr(34), 0 >> "%TEMP%\invisible.vbs"
echo Set WshShell = Nothing >> "%TEMP%\invisible.vbs"

REM Copy to Startup folder
set "STARTUP_FOLDER=%APPDATA%\Microsoft\Windows\Start Menu\Programs\Startup"
copy "%TEMP%\invisible.vbs" "%STARTUP_FOLDER%\HackathonHelper.vbs"

echo.
echo ========================================
echo  AUTO-STARTUP ENABLED!
echo ========================================
echo.
echo Your servers will now start automatically when
echo Windows boots up.
echo.
echo To DISABLE auto-startup:
echo 1. Press Win+R
echo 2. Type: shell:startup
echo 3. Delete "HackathonHelper.vbs"
echo.
echo Press any key to exit...
pause > nul
