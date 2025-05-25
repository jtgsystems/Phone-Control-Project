# Phone Control Project  
  
## Description  
A powerful tool for controlling and streaming your Android device from your computer.  
  
## Installation  
To set up the Phone Control Project, follow these steps:  
  
1. **Clone the Repository:**  
\	```bash  
\	git clone https://github.com/yourusername/PHONE-CONTROL-PROJECT.git  
\	*Replace `yourusername` with your GitHub username.*  
  
2. **Navigate to the Project Directory:**  
\	```bash  
\	cd PHONE-CONTROL-PROJECT  
\	```  
  
3. **Install Required Software:**  
- Ensure you have [Chocolatey](https://chocolatey.org/install) installed.  
- Install ADB (Android Debug Bridge) and scrcpy using Chocolatey:  
\	```bash  
\	choco install adb scrcpy -y  
\	```  
**Note:** The `PHONECONTROL.BAT` script is configured to use the `adb` and `scrcpy` versions bundled within the `Software/` directory. The `setup.bat` script (which uses Chocolatey to install `adb` and `scrcpy` system-wide) is provided as an alternative for users who prefer system-wide installations or to ensure all dependencies are met if issues occur with the bundled versions.
  
4. **Adjust Settings on Android Device:**  
- Enable USB Debugging on your Android device in `Settings  Options`.  
  
5. **Connect Your Android Device:**  
- Use a USB cable to connect your device to your computer, and make sure to authorize the connection when prompted on your device.  
  
## Usage  
To run the Phone Control Project, simply execute `PHONECONTROL.BAT` from the project's root directory:
\	```bash  
\	PHONECONTROL.BAT
\	```  
Ensure you are in the project's root directory when running this command.

### How it Works
The `PHONECONTROL.BAT` script is specifically configured to use the `adb.exe` and `scrcpy.exe` versions located within the `Software/` subdirectory of this project. This approach ensures that the project is portable and self-contained, meaning it does not rely on system-wide installations of ADB or scrcpy and won't interfere with other versions you might have installed.
  
## Prerequisites  
- Windows OS  
- ADB  
- Scrcpy  
- USB Debugging enabled on your Android device  
  
## Updating the Code  
Always fetch the latest updates from the repository:  
\	```bash  
\	git pull origin master  
\	```  
  
## Contributing  
If you would like to contribute, feel free to submit a Pull Request with your changes!  
  
## License  
This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
