@echo off
setlocal enabledelayedexpansion
title JTG Systems - Phone Control & Screen Mirroring

cd /d "%~dp0"

echo =========================================================
echo    JTG Systems - Android Phone Control Center (2026)
echo                 https://jtgsystems.com
echo =========================================================

echo Checking ADB and connected devices...
Software\adb.exe start-server >nul 2>&1
if %ERRORLEVEL% neq 0 (
    echo [!] Starting local ADB...
    adb start-server >nul 2>&1
)

Software\adb.exe devices -l

echo.
echo Launching High-Definition 60 FPS Screen Mirror...
Software\scrcpy.exe --video-bit-rate 16M --max-size 1920 --max-fps 60 --stay-awake --show-touches --render-driver opengl

if %ERRORLEVEL% neq 0 (
    echo.
    echo [!] If mirroring failed, make sure:
    echo     1. Phone is connected via USB
    echo     2. USB Debugging is turned ON in Developer Options
    echo     3. You tapped 'Allow USB Debugging' on your phone screen
)

echo.
pause
