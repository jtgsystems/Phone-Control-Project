const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const path = require('path');
const { spawn } = require('child_process');
const fs = require('fs');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
});

const PORT = process.env.PORT || 3000;

// Serve static files
app.use(express.static(path.join(__dirname, 'ui')));
app.use(express.json());

// ADB and scrcpy paths
const ADB_PATH = path.join(__dirname, '..', 'Software', 'adb.exe');
const SCRCPY_PATH = path.join(__dirname, '..', 'Software', 'scrcpy.exe');

class DeviceController {
    constructor() {
        this.devices = new Map();
        this.scrcpyProcess = null;
    }

    async getDevices() {
        return new Promise((resolve, reject) => {
            const adb = spawn(ADB_PATH, ['devices']);
            let output = '';
            
            adb.stdout.on('data', (data) => {
                output += data.toString();
            });
            
            adb.on('close', (code) => {
                if (code === 0) {
                    const devices = this.parseDevices(output);
                    resolve(devices);
                } else {
                    reject(new Error('Failed to get devices'));
                }
            });
        });
    }

    parseDevices(output) {
        const lines = output.split('\n').slice(1);
        return lines
            .filter(line => line.trim() && !line.includes('List of devices'))
            .map(line => {
                const [id, status] = line.trim().split('\t');
                return { id, status };
            });
    }

    async connectWiFi(ip, port = 5555) {
        return new Promise((resolve, reject) => {
            const adb = spawn(ADB_PATH, ['connect', `${ip}:${port}`]);
            let output = '';
            
            adb.stdout.on('data', (data) => {
                output += data.toString();
            });
            
            adb.on('close', (code) => {
                resolve({ success: code === 0, output });
            });
        });
    }

    async enableWiFiDebugging(deviceId) {
        return new Promise((resolve, reject) => {
            const adb = spawn(ADB_PATH, ['-s', deviceId, 'tcpip', '5555']);
            let output = '';
            
            adb.stdout.on('data', (data) => {
                output += data.toString();
            });
            
            adb.on('close', (code) => {
                resolve({ success: code === 0, output });
            });
        });
    }

    startScrcpy(deviceId, options = {}) {
        if (this.scrcpyProcess) {
            this.scrcpyProcess.kill();
        }

        const args = [
            '--video-bit-rate', options.bitrate || '8M',
            '--max-size', options.maxSize || '1080',
            '--render-driver', options.renderer || 'opengl',
            '--stay-awake',
            '--show-touches'
        ];

        if (deviceId) {
            args.unshift('-s', deviceId);
        }

        this.scrcpyProcess = spawn(SCRCPY_PATH, args);
        
        return new Promise((resolve) => {
            this.scrcpyProcess.on('spawn', () => {
                resolve({ success: true, message: 'Scrcpy started' });
            });
            
            this.scrcpyProcess.on('error', (error) => {
                resolve({ success: false, error: error.message });
            });
        });
    }

    stopScrcpy() {
        if (this.scrcpyProcess) {
            this.scrcpyProcess.kill();
            this.scrcpyProcess = null;
            return { success: true, message: 'Scrcpy stopped' };
        }
        return { success: false, message: 'Scrcpy not running' };
    }

    async executeAdbCommand(deviceId, command) {
        return new Promise((resolve) => {
            const args = deviceId ? ['-s', deviceId, ...command.split(' ')] : command.split(' ');
            const adb = spawn(ADB_PATH, args);
            let output = '';
            let error = '';
            
            adb.stdout.on('data', (data) => {
                output += data.toString();
            });
            
            adb.stderr.on('data', (data) => {
                error += data.toString();
            });
            
            adb.on('close', (code) => {
                resolve({ 
                    success: code === 0, 
                    output: output.trim(), 
                    error: error.trim() 
                });
            });
        });
    }
}

const deviceController = new DeviceController();

// API Routes
app.get('/api/devices', async (req, res) => {
    try {
        const devices = await deviceController.getDevices();
        res.json({ success: true, devices });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

app.post('/api/connect-wifi', async (req, res) => {
    const { ip, port } = req.body;
    const result = await deviceController.connectWiFi(ip, port);
    res.json(result);
});

app.post('/api/enable-wifi/:deviceId', async (req, res) => {
    const { deviceId } = req.params;
    const result = await deviceController.enableWiFiDebugging(deviceId);
    res.json(result);
});

app.post('/api/scrcpy/start', async (req, res) => {
    const { deviceId, options } = req.body;
    const result = await deviceController.startScrcpy(deviceId, options);
    res.json(result);
});

app.post('/api/scrcpy/stop', (req, res) => {
    const result = deviceController.stopScrcpy();
    res.json(result);
});

app.post('/api/adb-command', async (req, res) => {
    const { deviceId, command } = req.body;
    const result = await deviceController.executeAdbCommand(deviceId, command);
    res.json(result);
});

// Socket.IO for real-time updates
io.on('connection', (socket) => {
    console.log('Client connected:', socket.id);
    
    socket.on('get-devices', async () => {
        try {
            const devices = await deviceController.getDevices();
            socket.emit('devices-updated', devices);
        } catch (error) {
            socket.emit('error', error.message);
        }
    });
    
    socket.on('disconnect', () => {
        console.log('Client disconnected:', socket.id);
    });
});

// Start server
server.listen(PORT, () => {
    console.log(`Phone Control Server running on http://localhost:${PORT}`);
});

module.exports = { app, server, deviceController };