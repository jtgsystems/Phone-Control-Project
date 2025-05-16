@echo off

:: Install Chocolatey if it's not already installed
if not exist "C:\ProgramData\chocolatey" (
    echo Installing Chocolatey...
    PowerShell -NoProfile -InputFormat None -ExecutionPolicy Bypass -Command "& {
        Set-ExecutionPolicy Bypass -Scope Process;
        [System.Net.ServicePointManager]::SecurityProtocol = [System.Net.SecurityProtocolType]::Tls12;
        iex (new-object net.webclient).downloadstring('https://chocolatey.org/install.ps1')
    }"
)

:: Install ADB and Scrcpy
choco install adb -y
choco install scrcpy -y

echo Setup complete! All dependencies are installed.