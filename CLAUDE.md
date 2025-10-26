# Phone Control Project - System Reference Guide

Advanced Android device control system with modern web interface, wireless connectivity, and comprehensive automation features.

---

## Project Overview

**Phone Control Project v2.0** is a cross-platform solution for managing, controlling, and automating Android devices. It combines a Node.js web server, Python FastAPI backend, Electron desktop application, and modern web interface to provide comprehensive device management capabilities.

### Key Features
- **Wireless ADB Connection**: Connect devices over WiFi without USB cables
- **Screen Mirroring**: High-quality screen mirroring using scrcpy
- **Cross-Platform Support**: Windows, macOS, and Linux
- **Advanced Automation**: Batch operations, performance monitoring, and scripting
- **Electron Desktop App**: Native desktop experience with system integration
- **Docker Support**: Containerized deployment options
- **Python FastAPI Backend**: Robust API with comprehensive device management
- **File Transfer**: Drag-and-drop file transfers between device and computer
- **Screen Recording**: Built-in screen recording with customizable settings

### Use Cases
- Remote device management and support
- Automated app testing and QA
- Device performance monitoring
- File synchronization and backups
- Multi-device orchestration
- Screen mirroring and recording

---

## Directory Structure

```
Phone-Control-Project/
├── src/
│   ├── api/
│   │   └── device_manager.py          # Python FastAPI backend with advanced device management
│   ├── ui/
│   │   ├── index.html                 # Modern web interface with Tailwind CSS
│   │   └── app.js                     # Frontend JavaScript application logic
│   ├── utils/
│   │   └── automation.js              # Device automation utilities and helpers
│   └── server.js                      # Node.js Express server with WebSocket support
├── Software/                          # Bundled ADB and scrcpy executables
│   ├── adb.exe                       # Android Debug Bridge executable
│   ├── scrcpy.exe                    # Screen copy (scrcpy) executable
│   ├── scrcpy-server                 # Scrcpy server component
│   └── [DLL dependencies]            # Required libraries (SDL2, FFmpeg codecs, etc.)
├── electron-main.js                   # Electron desktop application entry point
├── docker-compose.yml                 # Multi-container Docker orchestration
├── Dockerfile.api                     # Python API container configuration
├── Dockerfile.web                     # Node.js web server container configuration
├── package.json                       # Node.js dependencies and scripts
├── requirements.txt                   # Python dependencies
├── PHONECONTROL.BAT                   # Windows quick-launch script
├── setup.bat                          # Windows setup script (Chocolatey installation)
├── scrcpy_instructions.txt            # Quick start guide for scrcpy
├── banner.png                         # Project banner/logo
└── README.md                          # Comprehensive project documentation
```

---

## Technology Stack

### Backend Technologies

#### Node.js Server (`src/server.js`)
- **Express 4.18.2**: Web application framework
- **Socket.IO 4.7.2**: Real-time bidirectional event-based communication
- **Multer 2.0.2**: File upload handling middleware
- **WebSockets (ws) 8.14.2**: WebSocket client and server implementation
- **node-adb 0.2.4**: ADB wrapper for Node.js

**Key Components**:
- DeviceController class for device management
- REST API endpoints for device operations
- WebSocket server for real-time updates
- Process management for scrcpy

#### Python API (`src/api/device_manager.py`)
- **FastAPI 0.104.1**: Modern, high-performance web framework
- **Uvicorn 0.24.0**: ASGI server implementation
- **Pydantic 2.5.0**: Data validation using Python type annotations
- **adb-shell 0.4.4**: Pure Python ADB implementation
- **pure-python-adb 0.3.0**: Alternative ADB implementation
- **OpenCV 4.8.1**: Computer vision and image processing
- **NumPy 1.25.2**: Numerical computing library
- **Pillow 10.1.0**: Python Imaging Library
- **Python-multipart 0.0.6**: Multipart form data parser

**Key Components**:
- AdvancedDeviceManager class for device operations
- Async/await pattern for non-blocking operations
- Device discovery and detailed information retrieval
- File transfer (push/pull) operations
- Screenshot and screen recording capabilities
- WiFi debugging enablement

### Frontend Technologies

#### Web Interface (`src/ui/`)
- **Tailwind CSS 2.2.19**: Utility-first CSS framework
- **Font Awesome 6.0.0**: Icon library
- **Socket.IO Client**: Real-time communication
- **Vanilla JavaScript**: No framework dependencies for lightweight performance

**UI Features**:
- Responsive design with gradient backgrounds
- Real-time device status updates
- Terminal-style command output
- Modal dialogs for WiFi setup
- Device card interface with quick actions

#### Desktop Application (`electron-main.js`)
- **Electron 38.0.0**: Cross-platform desktop app framework
- **Node Integration**: Full Node.js API access
- **IPC Communication**: Inter-process communication
- **Native Menus**: Platform-specific menu bars
- **File Dialogs**: Native file selection dialogs

**Electron Features**:
- PhoneControlElectron class for app lifecycle
- Integrated Node.js server startup
- Keyboard shortcuts and accelerators
- Settings modal with localStorage persistence
- About dialog and external documentation links

### Development Tools

#### Package Management
- **npm**: Node.js package manager
- **pip**: Python package manager

#### Build Tools
- **Webpack 5.88.2**: Module bundler
- **Nodemon 3.0.1**: Auto-reload development server

#### Testing
- **Jest 29.6.4**: JavaScript testing framework

#### Containerization
- **Docker**: Container platform
- **Docker Compose 3.8**: Multi-container orchestration
- **Redis 7 Alpine**: In-memory data structure store
- **Nginx Alpine**: Web server and reverse proxy

---

## Development Workflow

### Installation Methods

#### Option 1: Traditional Setup
```bash
# Clone repository
git clone https://github.com/jtgsystems/Phone-Control-Project.git
cd Phone-Control-Project

# Install Node.js dependencies
npm install

# Install Python dependencies
pip install -r requirements.txt

# Start application
npm start
```

#### Option 2: Docker Setup
```bash
# Start all services
docker-compose up -d

# Access web interface at http://localhost:3000
# API available at http://localhost:8000
```

#### Option 3: Electron Desktop App
```bash
# Install dependencies
npm install

# Run in development mode
npm run electron-dev

# Run in production mode
npm run electron
```

### Development Commands

#### NPM Scripts
```bash
npm start              # Start Node.js server (production)
npm run dev            # Start with auto-reload (nodemon)
npm run build          # Build with Webpack
npm test               # Run Jest tests
npm run install-deps   # Install both npm and pip dependencies
npm run electron       # Start Electron app
npm run electron-dev   # Start Electron in development mode
npm run docker-build   # Build Docker images
npm run docker-up      # Start Docker containers
npm run docker-down    # Stop Docker containers
```

#### Python Commands
```bash
# Run FastAPI server directly
python -m uvicorn src.api.device_manager:app --host 0.0.0.0 --port 8000

# Or execute the module
python src/api/device_manager.py
```

---

## Configuration

### Environment Variables

#### Web Server
```bash
PORT=3000                    # Web server port
NODE_ENV=production          # Node environment (development/production)
```

#### API Server
```bash
API_HOST=0.0.0.0            # API bind address
API_PORT=8000               # API server port
PYTHONPATH=/app             # Python module path (Docker)
```

#### Docker Services
```bash
REDIS_URL=redis://localhost:6379    # Redis connection URL
```

### Scrcpy Configuration Options
```javascript
{
  "bitrate": "8M",           // Video bitrate (4M, 8M, 16M)
  "maxSize": "1080",         // Max resolution (720, 1080, 1440, 0 for original)
  "renderer": "opengl",      // Renderer (opengl, software)
  "stayAwake": true,         // Keep device awake
  "showTouches": true        // Show touch points
}
```

### Electron Settings
- **Window Size**: 1200x800 (min 800x600)
- **Default Bitrate**: 8 Mbps
- **Default Max Size**: 1080p
- **Default Renderer**: OpenGL
- **Settings Storage**: localStorage (persistent)

---

## API Documentation

### REST API Endpoints

#### Device Management
```
GET  /api/devices                    # List connected devices with details
POST /api/connect-wifi               # Connect to device via WiFi
POST /api/enable-wifi/:deviceId      # Enable WiFi debugging on device
```

**Example Response - Get Devices**:
```json
{
  "success": true,
  "devices": [
    {
      "id": "ABC123XYZ",
      "status": "device",
      "model": "Pixel 6",
      "android_version": "13",
      "ip_address": "192.168.1.100",
      "battery_level": 85,
      "screen_resolution": "1080x2400"
    }
  ]
}
```

#### Screen Control
```
POST /api/scrcpy/start               # Start screen mirroring
POST /api/scrcpy/stop                # Stop screen mirroring
POST /api/screenshot/:deviceId       # Take device screenshot
```

#### File Operations
```
POST /api/upload/:deviceId           # Upload file to device
POST /api/download/:deviceId         # Download file from device
```

**File Upload Parameters**:
- `file`: Multipart file upload
- `remote_path`: Destination path on device (default: /sdcard/)

#### Automation & Commands
```
POST /api/shell-command              # Execute shell command
POST /api/install-apk                # Install APK file
POST /api/backup                     # Backup device data
```

**Shell Command Request**:
```json
{
  "device_id": "ABC123XYZ",
  "command": "pm list packages"
}
```

### WebSocket Events

#### Client → Server
```javascript
socket.emit('get-devices');          // Request device list
```

#### Server → Client
```javascript
socket.on('devices-updated', (devices) => {});    // Device list updated
socket.on('error', (error) => {});                // Error occurred
```

---

## Core Components

### DeviceController (Node.js)

**Location**: `src/server.js`

**Capabilities**:
- Device discovery via ADB
- WiFi connection management
- Scrcpy process control
- Shell command execution
- Device parsing and status tracking

**Key Methods**:
```javascript
async getDevices()                   // Get list of connected devices
parseDevices(output)                 // Parse ADB devices output
async connectWiFi(ip, port)          // Connect via WiFi
async enableWiFiDebugging(deviceId)  // Enable WiFi debugging
startScrcpy(deviceId, options)       // Start screen mirroring
stopScrcpy()                         // Stop screen mirroring
async executeAdbCommand(deviceId, cmd) // Execute ADB command
```

### AdvancedDeviceManager (Python)

**Location**: `src/api/device_manager.py`

**Capabilities**:
- Cross-platform ADB path detection
- Async device operations
- Detailed device information retrieval
- RSA signer authentication
- Screenshot and file transfer
- Performance monitoring integration

**Key Methods**:
```python
async get_devices()                  # Get devices with detailed info
async connect_wifi(ip, port)         # WiFi connection
async enable_wifi_debugging(device_id, port)  # Enable WiFi debugging
async install_apk(device_id, apk_path)  # Install APK
async push_file(device_id, local, remote)  # Push file to device
async pull_file(device_id, remote, local)  # Pull file from device
async execute_shell_command(device_id, cmd)  # Execute shell command
async take_screenshot(device_id, output)  # Take screenshot
async start_scrcpy(device_id, **options)  # Start scrcpy
```

### DeviceAutomation (JavaScript)

**Location**: `src/utils/automation.js`

**Capabilities**:
- Batch APK installation
- Device backup and restore
- File synchronization
- Performance monitoring
- Network speed testing
- Automated app testing
- Device optimization
- Screen recording

**Key Methods**:
```javascript
async batchInstallApks(deviceId, apkPaths, progressCallback)
async backupDevice(deviceId, backupPath, options)
async syncFiles(deviceId, localPath, remotePath, direction)
async monitorPerformance(deviceId, duration)
async testNetworkSpeed(deviceId, testUrl)
async testApp(deviceId, packageName, testActions)
async optimizeDevice(deviceId)
async recordScreen(deviceId, duration, outputPath)
```

**Automation Examples**:

```javascript
// Batch install multiple APKs
const automation = new DeviceAutomation(deviceController);
const results = await automation.batchInstallApks('ABC123XYZ', [
    '/path/to/app1.apk',
    '/path/to/app2.apk',
    '/path/to/app3.apk'
]);

// Monitor device performance for 60 seconds
const metrics = await automation.monitorPerformance('ABC123XYZ', 60000);
console.log('Average CPU:', metrics.summary.cpu.avg);
console.log('Peak Memory:', metrics.summary.memory.max);
console.log('Battery Drain:', metrics.summary.battery.drain);

// Automated app testing
const testActions = [
    { type: 'tap', x: 500, y: 1000 },
    { type: 'swipe', x1: 300, y1: 800, x2: 300, y2: 400, duration: 500 },
    { type: 'text', text: 'Hello World' },
    { type: 'key', keycode: 'KEYCODE_BACK' }
];
await automation.testApp('ABC123XYZ', 'com.example.app', testActions);

// Device optimization
const optimizeResults = await automation.optimizeDevice('ABC123XYZ');
console.log('Operations completed:', optimizeResults.operations);
```

### PhoneControlApp (Frontend)

**Location**: `src/ui/app.js`

**Capabilities**:
- Socket.IO integration
- Real-time device updates
- WiFi connection modal
- Terminal output display
- Command execution
- File upload handling

**Event Handlers**:
- Device refresh
- WiFi connection setup
- Screen mirroring start
- Shell command execution
- File transfer initiation

---

## Docker Architecture

### Multi-Container Setup

#### Services

**phone-control-web** (Node.js)
- Port: 3000
- Dockerfile: `Dockerfile.web`
- Base Image: node:18-alpine
- Volumes: src/, Software/
- Health Check: HTTP GET /api/health

**phone-control-api** (Python)
- Port: 8000
- Dockerfile: `Dockerfile.api`
- Base Image: python:3.11-slim
- Volumes: src/api/, Software/, /dev/bus/usb
- Privileged: true (USB access)
- Health Check: HTTP GET /api/health

**redis** (Cache)
- Port: 6379
- Image: redis:7-alpine
- Persistent Volume: redis_data

**nginx** (Reverse Proxy)
- Ports: 80, 443
- Image: nginx:alpine
- Volumes: nginx.conf, ssl/
- Depends On: web, api

#### Network
- Bridge network: phone-control-network
- All services connected for inter-service communication

#### Security Features
- Non-root users in containers
- Health checks for all services
- Privileged mode only for API (USB access)
- SSL certificate support (nginx)

---

## Performance Optimizations

### Concurrent Operations
- Multiple devices handled simultaneously
- Async/await pattern throughout Python backend
- Non-blocking WebSocket communication
- Process spawning for scrcpy (non-blocking)

### Efficient Streaming
- Optimized video compression with scrcpy
- Configurable bitrate (4M, 8M, 16M)
- Adaptive resolution (720p, 1080p, 1440p, original)
- OpenGL rendering for hardware acceleration

### Memory Management
- Process cleanup on disconnect
- Automatic screenshot file deletion
- Smart resource monitoring
- Garbage collection optimization

### Network Optimization
- WebSocket for real-time updates (reduces HTTP overhead)
- Connection pooling in Redis
- Efficient ADB command batching
- Compressed data transfer

---

## Testing Strategy

### Unit Testing
- **Framework**: Jest 29.6.4
- **Coverage**: Core device operations, automation utilities
- **Command**: `npm test`

### Integration Testing
- API endpoint testing with FastAPI TestClient
- WebSocket event verification
- Docker container health checks

### Manual Testing Checklist
- [ ] USB device detection
- [ ] WiFi connection establishment
- [ ] Screen mirroring quality
- [ ] File transfer integrity
- [ ] Command execution accuracy
- [ ] Multi-device support
- [ ] Cross-platform compatibility

---

## Platform Support

### Operating Systems
- **Windows**: 10, 11 (primary development platform)
- **macOS**: 10.15+ (Catalina and later)
- **Linux**: Ubuntu 18.04+, Debian 10+, Fedora 30+

### Android Versions
- **Minimum**: Android 5.0 (API level 21)
- **Recommended**: Android 8.0+ (API level 26+)
- **Tested**: Android 11, 12, 13, 14

### Browser Support (Web Interface)
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

---

## Known Issues & Troubleshooting

### Device Not Detected

**Symptoms**: No devices appear in device list

**Solutions**:
1. Ensure USB debugging is enabled on device
2. Try different USB cable or port
3. Install device-specific USB drivers (Windows)
4. Run `adb devices` in terminal to verify connection
5. Restart ADB server: `adb kill-server && adb start-server`

### WiFi Connection Timeout

**Symptoms**: Unable to connect via WiFi

**Solutions**:
1. Verify device and computer are on same network
2. Check firewall settings (allow port 5555)
3. Confirm IP address is correct: `adb shell ip route`
4. Enable WiFi debugging while USB connected first
5. Try manual connection: `adb connect <IP>:5555`

### Screen Mirroring Lag

**Symptoms**: Laggy or choppy screen mirroring

**Solutions**:
1. Reduce video bitrate to 4M in settings
2. Lower max resolution to 720p
3. Switch renderer to software if OpenGL causes issues
4. Check network bandwidth (for WiFi connections)
5. Close other bandwidth-intensive applications
6. Use USB connection instead of WiFi for best performance

### Scrcpy Won't Start

**Symptoms**: Error when starting screen mirroring

**Solutions**:
1. Ensure scrcpy is in Software/ directory
2. Grant display capture permissions on device
3. Check if another scrcpy instance is running
4. Verify device screen is unlocked
5. Try restarting device

### File Transfer Fails

**Symptoms**: Unable to push/pull files

**Solutions**:
1. Check file path permissions on device
2. Ensure sufficient storage space on device
3. Verify file path syntax (use forward slashes)
4. Check if device storage is mounted
5. Try using /sdcard/ as base path

### Docker USB Access Issues

**Symptoms**: Docker container can't access USB devices

**Solutions**:
1. Ensure privileged mode is enabled for API container
2. Verify /dev/bus/usb is mounted correctly
3. Check USB device permissions on host
4. Restart Docker daemon after connecting device
5. Use host network mode as alternative

---

## Development Roadmap

### Completed (v2.0)
- ✅ Modern web interface with Tailwind CSS
- ✅ WiFi ADB connection support
- ✅ Cross-platform compatibility
- ✅ Advanced automation utilities
- ✅ Electron desktop application
- ✅ Docker containerization
- ✅ Python FastAPI backend
- ✅ Real-time WebSocket communication
- ✅ File transfer capabilities
- ✅ Performance monitoring

### Planned Features
- [ ] **iOS Device Support**: Extend to iOS devices using libimobiledevice
- [ ] **Cloud Deployment**: AWS, GCP, Azure deployment guides
- [ ] **Machine Learning Automation**: AI-powered test generation
- [ ] **Plugin System**: Extensible architecture for community plugins
- [ ] **Multi-Language Support**: i18n for interface localization
- [ ] **Advanced Scripting**: Lua/Python scripting interface
- [ ] **Screen Recording UI**: Built-in recording controls in web interface
- [ ] **Multiple Device Mirroring**: Simultaneous multi-device screens
- [ ] **Device Groups**: Manage devices in groups
- [ ] **Scheduled Automation**: Cron-like task scheduling
- [ ] **Remote Access**: Secure tunneling for remote device access
- [ ] **Analytics Dashboard**: Device usage and performance analytics

### Under Consideration
- GraphQL API support
- Mobile companion app (React Native)
- CI/CD integration for automated testing
- Device farm integration
- VNC/RDP-like remote control protocol
- Voice command integration

---

## Security Considerations

### Input Validation
- All API inputs sanitized using Pydantic
- File upload restrictions (type, size)
- Command injection prevention
- Path traversal protection

### Process Isolation
- Sandboxed scrcpy processes
- Non-root users in Docker containers
- Limited shell command scope
- Process cleanup on errors

### Authentication & Authorization
- Ready for authentication middleware integration
- Role-based access control preparation
- API key support (future)
- OAuth 2.0 compatibility (planned)

### Network Security
- HTTPS/SSL ready (nginx configuration)
- CORS configuration for API
- Certificate validation for production
- Secure WebSocket connections (WSS)

### Best Practices
- Never commit credentials to repository
- Use environment variables for sensitive data
- Regular dependency updates (Dependabot enabled)
- Security audit with npm audit / pip-audit
- Minimal container attack surface (Alpine images)

---

## Contributing

### Development Setup
1. Fork the repository
2. Clone your fork locally
3. Create a feature branch: `git checkout -b feature-name`
4. Install dependencies: `npm run install-deps`
5. Make changes and test thoroughly
6. Commit with clear messages: `git commit -m 'Add feature description'`
7. Push to your fork: `git push origin feature-name`
8. Create a Pull Request

### Code Style
- **JavaScript**: Follow Airbnb style guide
- **Python**: Follow PEP 8
- **HTML/CSS**: Consistent indentation (2 spaces)
- **Commits**: Conventional Commits format

### Testing Requirements
- All new features must include tests
- Maintain or improve code coverage
- Test on multiple platforms if possible
- Document test cases in PR description

---

## Project Information

### Repository
- **GitHub**: https://github.com/jtgsystems/Phone-Control-Project
- **License**: MIT License
- **Author**: JTG Systems
- **Version**: 2.0.0

### Recent Updates
- v2.0.0: Complete modernization with web interface, Docker, FastAPI
- v1.x: Original batch script-based implementation
- Enhanced documentation and README
- Added project banner
- Dependency security updates (Dependabot)

### Community
- **Issues**: https://github.com/jtgsystems/Phone-Control-Project/issues
- **Discussions**: https://github.com/jtgsystems/Phone-Control-Project/discussions
- **Wiki**: https://github.com/jtgsystems/Phone-Control-Project/wiki

---

## Quick Reference Commands

### Development
```bash
# Start development server
npm run dev

# Run Electron in dev mode
npm run electron-dev

# Build for production
npm run build

# Run tests
npm test
```

### Docker
```bash
# Build containers
docker-compose build

# Start services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down

# Rebuild and restart
docker-compose up -d --build
```

### ADB Commands
```bash
# List devices
adb devices

# Connect WiFi
adb connect 192.168.1.100:5555

# Enable WiFi debugging
adb tcpip 5555

# Shell access
adb shell

# Install APK
adb install app.apk

# Push file
adb push local.txt /sdcard/

# Pull file
adb pull /sdcard/remote.txt

# Screenshot
adb shell screencap /sdcard/screen.png
adb pull /sdcard/screen.png

# Screen recording
adb shell screenrecord /sdcard/video.mp4
```

### Scrcpy Commands
```bash
# Basic mirror
scrcpy

# Specific device
scrcpy -s ABC123XYZ

# Custom bitrate and resolution
scrcpy --video-bit-rate 8M --max-size 1080

# Stay awake and show touches
scrcpy --stay-awake --show-touches

# Record screen
scrcpy --record screen.mp4
```

---

*Last Updated: 2024-10*
*System: Phone Control Project v2.0*
*Built with ❤️ by JTG Systems*

## Framework Versions

- **FastAPI**: 0.104.1

