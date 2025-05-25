@echo off

:: Install Chocolatey if it's not already installed
if not exist "C:\ProgramData\chocolatey" (
    echo Installing Chocolatey...
    PowerShell -NoProfile -InputFormat None -ExecutionPolicy Bypass -Command "& {
        Set-ExecutionPolicy Bypass -Scope Process;
        [System.Net.ServicePointManager]::SecurityProtocol = [System.Net.SecurityProtocolType]::Tls12;
        iex (new-object net.webclient).downloadstring('https://chocolatey.org/install.ps1')
    }"
    if %ERRORLEVEL% neq 0 (
        echo Error: Chocolatey installation failed.
        pause
        exit /b %ERRORLEVEL%
    )
    echo Chocolatey installed successfully.
) else (
    echo Chocolatey is already installed.
)

echo Installing ADB...
choco install adb -y
if %ERRORLEVEL% neq 0 (
    echo Error: Failed to install ADB using Chocolatey.
    pause
    exit /b %ERRORLEVEL%
)
echo ADB installed successfully via Chocolatey.

echo Installing scrcpy...
choco install scrcpy -y
if %ERRORLEVEL% neq 0 (
    echo Error: Failed to install scrcpy using Chocolatey.
    pause
    exit /b %ERRORLEVEL%
)
echo scrcpy installed successfully via Chocolatey.

echo Setup complete! All specified dependencies are installed or were already present.
pause
