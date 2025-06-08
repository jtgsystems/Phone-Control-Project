class PhoneControlApp {
    constructor() {
        this.socket = io();
        this.selectedDevice = null;
        this.devices = [];
        this.initializeEventListeners();
        this.initializeSocket();
        this.loadDevices();
    }

    initializeEventListeners() {
        // Refresh devices
        document.getElementById('refresh-devices').addEventListener('click', () => {
            this.loadDevices();
        });

        // WiFi connection
        document.getElementById('wifi-connect-btn').addEventListener('click', () => {
            this.showWiFiModal();
        });

        document.getElementById('wifi-cancel').addEventListener('click', () => {
            this.hideWiFiModal();
        });

        document.getElementById('wifi-connect-confirm').addEventListener('click', () => {
            this.connectWiFi();
        });

        // Screen mirroring
        document.getElementById('start-scrcpy').addEventListener('click', () => {
            this.startScrcpy();
        });

        // Terminal commands
        document.getElementById('execute-command').addEventListener('click', () => {
            this.executeCommand();
        });

        document.getElementById('command-input').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.executeCommand();
            }
        });

        // File transfer
        document.getElementById('file-transfer').addEventListener('click', () => {
            this.openFileTransfer();
        });

        // Shell
        document.getElementById('open-shell').addEventListener('click', () => {
            this.openShell();
        });
    }

    initializeSocket() {
        this.socket.on('connect', () => {
            this.updateConnectionStatus(true);
            this.addTerminalOutput('Connected to server', 'success');
        });

        this.socket.on('disconnect', () => {
            this.updateConnectionStatus(false);
            this.addTerminalOutput('Disconnected from server', 'error');
        });

        this.socket.on('devices-updated', (devices) => {
            this.devices = devices;
            this.renderDevices();
        });

        this.socket.on('error', (error) => {
            this.addTerminalOutput(`Error: ${error}`, 'error');
        });
    }

    async loadDevices() {
        try {
            this.socket.emit('get-devices');
            this.addTerminalOutput('Refreshing device list...', 'info');
        } catch (error) {
            this.addTerminalOutput(`Failed to load devices: ${error.message}`, 'error');
        }
    }

    renderDevices() {
        const container = document.getElementById('devices-container');
        
        if (this.devices.length === 0) {
            container.innerHTML = `
                <div class="text-center py-8 text-gray-500">
                    <i class="fas fa-mobile-alt text-4xl mb-4"></i>
                    <p>No devices connected</p>
                    <p class="text-sm">Connect a device via USB or WiFi</p>
                </div>
            `;
            return;
        }

        container.innerHTML = this.devices.map(device => `
            <div class="device-card border rounded-lg p-4 cursor-pointer ${this.selectedDevice === device.id ? 'border-blue-500 bg-blue-50' : 'border-gray-200'}"
                 onclick="app.selectDevice('${device.id}')">
                <div class="flex items-center justify-between">
                    <div class="flex items-center">
                        <i class="fas fa-mobile-alt text-2xl mr-3 ${device.status === 'device' ? 'text-green-500' : 'text-gray-400'}"></i>
                        <div>
                            <h3 class="font-medium">${device.id}</h3>
                            <p class="text-sm text-gray-600">Status: ${device.status}</p>
                        </div>
                    </div>
                    <div class="flex space-x-2">
                        <button class="px-3 py-1 bg-blue-500 text-white text-sm rounded hover:bg-blue-600 transition"
                                onclick="event.stopPropagation(); app.enableWiFi('${device.id}')">
                            Enable WiFi
                        </button>
                        <button class="px-3 py-1 bg-green-500 text-white text-sm rounded hover:bg-green-600 transition"
                                onclick="event.stopPropagation(); app.startScrcpyForDevice('${device.id}')">
                            Mirror
                        </button>
                    </div>
                </div>
            </div>
        `).join('');
    }

    selectDevice(deviceId) {
        this.selectedDevice = deviceId;
        this.renderDevices();
        this.addTerminalOutput(`Selected device: ${deviceId}`, 'info');
    }

    showWiFiModal() {
        document.getElementById('wifi-modal').classList.remove('hidden');
    }

    hideWiFiModal() {
        document.getElementById('wifi-modal').classList.add('hidden');
    }

    async connectWiFi() {
        const ip = document.getElementById('wifi-ip').value;
        const port = document.getElementById('wifi-port').value;

        if (!ip) {
            alert('Please enter an IP address');
            return;
        }

        try {
            this.addTerminalOutput(`Connecting to ${ip}:${port}...`, 'info');
            
            const response = await fetch('/api/connect-wifi', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ip, port })
            });

            const result = await response.json();
            
            if (result.success) {
                this.addTerminalOutput(`Successfully connected to ${ip}:${port}`, 'success');
                this.hideWiFiModal();
                this.loadDevices();
            } else {
                this.addTerminalOutput(`Failed to connect: ${result.output}`, 'error');
            }
        } catch (error) {
            this.addTerminalOutput(`Connection error: ${error.message}`, 'error');
        }
    }

    async enableWiFi(deviceId) {
        try {
            this.addTerminalOutput(`Enabling WiFi debugging for ${deviceId}...`, 'info');
            
            const response = await fetch(`/api/enable-wifi/${deviceId}`, {
                method: 'POST'
            });

            const result = await response.json();
            
            if (result.success) {
                this.addTerminalOutput('WiFi debugging enabled. You can now disconnect USB and connect via WiFi.', 'success');
            } else {
                this.addTerminalOutput(`Failed to enable WiFi: ${result.output}`, 'error');
            }
        } catch (error) {
            this.addTerminalOutput(`Error: ${error.message}`, 'error');
        }
    }

    async startScrcpy() {
        const deviceId = this.selectedDevice;
        await this.startScrcpyForDevice(deviceId);
    }

    async startScrcpyForDevice(deviceId) {
        try {
            this.addTerminalOutput(`Starting screen mirroring${deviceId ? ` for ${deviceId}` : ''}...`, 'info');
            
            const response = await fetch('/api/scrcpy/start', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ 
                    deviceId,
                    options: {
                        bitrate: '8M',
                        maxSize: '1080',
                        renderer: 'opengl'
                    }
                })
            });

            const result = await response.json();
            
            if (result.success) {
                this.addTerminalOutput('Screen mirroring started successfully', 'success');
            } else {
                this.addTerminalOutput(`Failed to start mirroring: ${result.error}`, 'error');
            }
        } catch (error) {
            this.addTerminalOutput(`Error: ${error.message}`, 'error');
        }
    }

    async executeCommand() {
        const command = document.getElementById('command-input').value.trim();
        if (!command) return;

        try {
            this.addTerminalOutput(`> ${command}`, 'command');
            
            const response = await fetch('/api/adb-command', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ 
                    deviceId: this.selectedDevice,
                    command 
                })
            });

            const result = await response.json();
            
            if (result.success) {
                this.addTerminalOutput(result.output || 'Command executed successfully', 'success');
            } else {
                this.addTerminalOutput(result.error || 'Command failed', 'error');
            }
            
            document.getElementById('command-input').value = '';
        } catch (error) {
            this.addTerminalOutput(`Error: ${error.message}`, 'error');
        }
    }

    openFileTransfer() {
        if (!this.selectedDevice) {
            alert('Please select a device first');
            return;
        }
        
        // Create file input
        const input = document.createElement('input');
        input.type = 'file';
        input.multiple = true;
        input.onchange = (e) => this.handleFileUpload(e.target.files);
        input.click();
    }

    async handleFileUpload(files) {
        if (!files.length) return;

        for (const file of files) {
            this.addTerminalOutput(`Uploading ${file.name}...`, 'info');
            
            // In a real implementation, you would upload the file to the server
            // and then use ADB to push it to the device
            this.addTerminalOutput(`File upload for ${file.name} would be implemented here`, 'info');
        }
    }

    openShell() {
        if (!this.selectedDevice) {
            alert('Please select a device first');
            return;
        }
        
        this.addTerminalOutput(`Opening ADB shell for ${this.selectedDevice}...`, 'info');
        this.addTerminalOutput('Type "shell <command>" to execute shell commands', 'info');
    }

    addTerminalOutput(message, type = 'info') {
        const terminal = document.getElementById('terminal-output');
        const timestamp = new Date().toLocaleTimeString();
        
        const colors = {
            'info': 'text-blue-400',
            'success': 'text-green-400',
            'error': 'text-red-400',
            'command': 'text-yellow-400'
        };
        
        const div = document.createElement('div');
        div.className = colors[type] || 'text-gray-400';
        div.innerHTML = `<span class="text-gray-500">[${timestamp}]</span> ${message}`;
        
        terminal.appendChild(div);
        terminal.scrollTop = terminal.scrollHeight;
    }

    updateConnectionStatus(connected) {
        const status = document.getElementById('connection-status');
        if (connected) {
            status.className = 'px-3 py-1 rounded-full bg-green-500 text-sm text-white';
            status.innerHTML = '<i class="fas fa-circle mr-1"></i>Connected';
        } else {
            status.className = 'px-3 py-1 rounded-full bg-red-500 text-sm text-white';
            status.innerHTML = '<i class="fas fa-circle mr-1"></i>Disconnected';
        }
    }
}

// Initialize the app
const app = new PhoneControlApp();