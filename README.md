![Banner](banner.png)

# Phone Control Project 2.0 🚀

Advanced Android device control with modern web interface, wireless connectivity, and comprehensive automation features.

## ✨ Features

### 🔥 New in v2.0
- **Modern Web Interface** - Beautiful, responsive UI with real-time controls
- **Wireless ADB Connection** - Connect devices over WiFi without USB cables
- **Cross-Platform Support** - Works on Windows, macOS, and Linux
- **Advanced Automation** - Batch operations, performance monitoring, and scripting
- **Electron Desktop App** - Native desktop experience with system integration
- **Docker Support** - Easy deployment with containerization
- **Python API** - FastAPI backend with comprehensive device management
- **File Transfer** - Drag-and-drop file transfers between device and computer
- **Screen Recording** - Built-in screen recording with customizable settings

### 📱 Core Features
- Real-time device discovery and management
- High-quality screen mirroring with scrcpy
- Remote shell access and command execution
- APK installation and management
- Device backup and restore
- Performance monitoring and optimization
- Network speed testing
- Automated app testing

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- Python 3.8+
- Android device with USB debugging enabled

### Installation

#### Option 1: Traditional Setup
```bash
# Clone the repository
git clone https://github.com/jtgsystems/Phone-Control-Project.git
cd Phone-Control-Project

# Install Node.js dependencies
npm install

# Install Python dependencies
pip install -r requirements.txt

# Start the application
npm start
```

#### Option 2: Docker Setup
```bash
# Clone and start with Docker
git clone https://github.com/jtgsystems/Phone-Control-Project.git
cd Phone-Control-Project

# Start all services
docker-compose up -d

# Access the web interface
open http://localhost:3000
```

#### Option 3: Electron Desktop App
```bash
# Install and start Electron app
npm install
npm run electron
```

## 📖 Usage Guide

### 1. Connect Your Device

#### USB Connection
1. Enable Developer Options on your Android device
2. Enable USB Debugging in Developer Options
3. Connect device via USB cable
4. Authorize the connection when prompted

#### WiFi Connection
1. First connect via USB to enable WiFi debugging
2. Click "Enable WiFi" button for your device
3. Note your device's IP address
4. Click "WiFi Connect" and enter the IP address
5. Disconnect USB cable - you're now wireless!

### 2. Screen Mirroring
- Click "Start Mirror" to begin screen mirroring
- Use keyboard shortcuts for common actions
- Customize video quality in settings

### 3. File Transfer
- Click "Transfer Files" to upload/download files
- Drag and drop files directly onto the interface
- Monitor transfer progress in real-time

### 4. Remote Shell
- Click "ADB Shell" to open command interface
- Execute any ADB command directly
- View command history and output

## 🔧 Advanced Features

### Automation Scripts
```javascript
// Example: Batch install APKs
const automation = new DeviceAutomation(deviceController);
const results = await automation.batchInstallApks(deviceId, [
    '/path/to/app1.apk',
    '/path/to/app2.apk'
]);
```

### Performance Monitoring
```javascript
// Monitor device performance for 60 seconds
const metrics = await automation.monitorPerformance(deviceId, 60000);
console.log('CPU Usage:', metrics.summary.cpu.avg);
```

### Custom Automation
```javascript
// Automated app testing
const testActions = [
    { type: 'tap', x: 500, y: 1000 },
    { type: 'swipe', x1: 300, y1: 800, x2: 300, y2: 400 },
    { type: 'text', text: 'Hello World' }
];
await automation.testApp(deviceId, 'com.example.app', testActions);
```

## 🏗️ Architecture

```
Phone-Control-Project/
├── src/
│   ├── api/           # Python FastAPI backend
│   ├── ui/            # Web interface (HTML/CSS/JS)
│   ├── core/          # Core device management
│   └── utils/         # Automation utilities
├── Software/          # Bundled ADB and scrcpy
├── electron-main.js   # Electron desktop app
└── docker-compose.yml # Docker deployment
```

## 🔌 API Endpoints

### Device Management
- `GET /api/devices` - List connected devices
- `POST /api/connect-wifi` - Connect via WiFi
- `POST /api/enable-wifi/{device_id}` - Enable WiFi debugging

### Screen Control
- `POST /api/scrcpy/start` - Start screen mirroring
- `POST /api/scrcpy/stop` - Stop screen mirroring
- `POST /api/screenshot/{device_id}` - Take screenshot

### File Operations
- `POST /api/upload/{device_id}` - Upload file to device
- `POST /api/download/{device_id}` - Download from device

### Automation
- `POST /api/shell-command` - Execute shell command
- `POST /api/install-apk` - Install APK file
- `POST /api/backup` - Backup device data

## ⚙️ Configuration

### Environment Variables
```bash
# Web Server
PORT=3000
NODE_ENV=production

# API Server
API_HOST=0.0.0.0
API_PORT=8000
PYTHONPATH=/app

# Database
REDIS_URL=redis://localhost:6379
```

### Scrcpy Options
```json
{
  "bitrate": "8M",
  "maxSize": "1080",
  "renderer": "opengl",
  "stayAwake": true,
  "showTouches": true
}
```

## 🚀 Performance Optimizations

- **Concurrent Operations** - Multiple devices handled simultaneously
- **Efficient Streaming** - Optimized video compression and transmission
- **Memory Management** - Smart resource cleanup and monitoring
- **Network Optimization** - Adaptive bitrate and connection pooling

## 🔒 Security Features

- Input validation and sanitization
- Secure file upload handling
- Process isolation and sandboxing
- Authentication and authorization support
- Certificate validation for HTTPS

## 📱 Supported Platforms

- **Windows** 10/11
- **macOS** 10.15+
- **Linux** Ubuntu 18.04+
- **Android** 5.0+ (API level 21+)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Make your changes and test thoroughly
4. Commit changes: `git commit -m 'Add feature description'`
5. Push to branch: `git push origin feature-name`
6. Create a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Troubleshooting

### Common Issues

**Device not detected:**
- Ensure USB debugging is enabled
- Try different USB cable/port
- Install device drivers (Windows)

**Connection timeout:**
- Check firewall settings
- Verify IP address is correct
- Ensure device and computer are on same network

**Screen mirroring laggy:**
- Reduce video bitrate in settings
- Lower maximum resolution
- Check network bandwidth

### Getting Help

- 📚 [Documentation](https://github.com/jtgsystems/Phone-Control-Project/wiki)
- 🐛 [Report Issues](https://github.com/jtgsystems/Phone-Control-Project/issues)
- 💬 [Discussions](https://github.com/jtgsystems/Phone-Control-Project/discussions)

## 🎯 Roadmap

- [ ] iOS device support
- [ ] Cloud deployment options
- [ ] Machine learning automation
- [ ] Plugin system for extensions
- [ ] Multi-language support
- [ ] Advanced scripting interface

---

**Built with ❤️ by JTG Systems**

*Empowering developers with advanced Android device control*

### SEO Keyword Cloud

`android` `adb` `phone` `control` `automation` `remote` `management` `scrcpy` `mirroring` `streaming` `wifi` `wireless` `usb` `debugging` `fastapi` `electron` `docker` `nodejs` `react` `api` `dashboard` `monitoring` `scripting` `testing` `qa` `deployment` `crossplatform` `performance` `optimization` `screenshots` `recording` `filetransfer` `backup` `restore` `shell` `commands` `telemetry` `notifications` `orchestration` `multi-device` `analytics` `productivity` `troubleshooting` `devops` `enterprise` `support` `integration` `workflow` `roadmap`

---

## 🏆 Created by JTG Systems

<div align="center">

<a href="https://jtgsystems.com">
  <img src="https://raw.githubusercontent.com/jtgsystems/.github/main/assets/jtgsystems-attribution-banner.jpg" alt="JTG Systems - Support & Sponsorship" width="750"/>
</a>

**Engineered with pride by [JTG Systems](https://jtgsystems.com)**  
*Enterprise Systems Architecture, Custom Workstations & AI Solutions*

🌐 **Website**: [jtgsystems.com](https://jtgsystems.com)  
📞 **Contact**: (905) 892-4555  
☕ **Tips & Sponsorship**: `jtgsystems@gmail.com`

</div>

