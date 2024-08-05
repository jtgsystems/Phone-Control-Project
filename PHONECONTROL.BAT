@echo off  
:: Remember to check for updates on scrcpy if you encounter issues.  
cd "C:\Users\unknown\Desktop\PHONE-CONTROL-PROJECT"  
adb start-server  
scrcpy --video-bit-rate 8M --max-size 1080 --render-driver opengl --stay-awake --show-touch  
pause 
