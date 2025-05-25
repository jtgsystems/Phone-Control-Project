@echo off
:: Remember to check for updates on scrcpy if you encounter issues.
cd /d "%~dp0"

echo Starting ADB server...
Software\adb.exe start-server
if %ERRORLEVEL% neq 0 (
    echo Error: Failed to start ADB server. Ensure ADB is correctly placed in the Software folder and no other ADB instance is conflicting.
    pause
    exit /b %ERRORLEVEL%
)

echo Starting scrcpy...
Software\scrcpy.exe --video-bit-rate 8M --max-size 1080 --render-driver opengl --stay-awake --show-touch
if %ERRORLEVEL% neq 0 (
    echo Error: Failed to start scrcpy. Ensure scrcpy is correctly placed in the Software folder and your device is connected and authorized.
    pause
    exit /b %ERRORLEVEL%
)

echo scrcpy closed.
pause
