const { app, BrowserWindow, Menu, ipcMain, dialog } = require('electron');
const path = require('path');
const { spawn } = require('child_process');
const fs = require('fs');

class PhoneControlElectron {
    constructor() {
        this.mainWindow = null;
        this.serverProcess = null;
        this.isDev = process.env.NODE_ENV === 'development';
    }

    async createWindow() {
        // Create the browser window
        this.mainWindow = new BrowserWindow({
            width: 1200,
            height: 800,
            minWidth: 800,
            minHeight: 600,
            icon: path.join(__dirname, 'Software', 'icon.png'),
            webPreferences: {
                nodeIntegration: true,
                contextIsolation: false,
                webSecurity: false
            },
            show: false,
            titleBarStyle: 'default'
        });

        // Start the backend server
        await this.startServer();

        // Load the app
        if (this.isDev) {
            this.mainWindow.loadURL('http://localhost:3000');
            this.mainWindow.webContents.openDevTools();
        } else {
            this.mainWindow.loadURL(`http://localhost:3000`);
        }

        // Show window when ready
        this.mainWindow.once('ready-to-show', () => {
            this.mainWindow.show();
            
            if (this.isDev) {
                this.mainWindow.webContents.openDevTools();
            }
        });

        // Handle window closed
        this.mainWindow.on('closed', () => {
            this.mainWindow = null;
            this.stopServer();
        });

        this.setupMenu();
        this.setupIpcHandlers();
    }

    async startServer() {
        return new Promise((resolve) => {
            const serverPath = path.join(__dirname, 'src', 'server.js');
            
            this.serverProcess = spawn('node', [serverPath], {
                stdio: ['pipe', 'pipe', 'pipe'],
                env: { ...process.env, PORT: '3000' }
            });

            this.serverProcess.stdout.on('data', (data) => {
                console.log(`Server: ${data}`);
                if (data.toString().includes('running on')) {
                    resolve();
                }
            });

            this.serverProcess.stderr.on('data', (data) => {
                console.error(`Server Error: ${data}`);
            });

            this.serverProcess.on('close', (code) => {
                console.log(`Server process exited with code ${code}`);
            });

            // Timeout fallback
            setTimeout(resolve, 3000);
        });
    }

    stopServer() {
        if (this.serverProcess) {
            this.serverProcess.kill();
            this.serverProcess = null;
        }
    }

    setupMenu() {
        const template = [
            {
                label: 'File',
                submenu: [
                    {
                        label: 'Open Device Manager',
                        accelerator: 'CmdOrCtrl+D',
                        click: () => {
                            this.mainWindow.webContents.send('open-device-manager');
                        }
                    },
                    {
                        label: 'Take Screenshot',
                        accelerator: 'CmdOrCtrl+S',
                        click: () => {
                            this.mainWindow.webContents.send('take-screenshot');
                        }
                    },
                    { type: 'separator' },
                    {
                        label: 'Exit',
                        accelerator: process.platform === 'darwin' ? 'Cmd+Q' : 'Ctrl+Q',
                        click: () => {
                            app.quit();
                        }
                    }
                ]
            },
            {
                label: 'Device',
                submenu: [
                    {
                        label: 'Refresh Devices',
                        accelerator: 'F5',
                        click: () => {
                            this.mainWindow.webContents.send('refresh-devices');
                        }
                    },
                    {
                        label: 'Start Screen Mirror',
                        accelerator: 'CmdOrCtrl+M',
                        click: () => {
                            this.mainWindow.webContents.send('start-mirror');
                        }
                    },
                    {
                        label: 'Enable WiFi Debugging',
                        click: () => {
                            this.mainWindow.webContents.send('enable-wifi');
                        }
                    }
                ]
            },
            {
                label: 'Tools',
                submenu: [
                    {
                        label: 'ADB Shell',
                        accelerator: 'CmdOrCtrl+T',
                        click: () => {
                            this.mainWindow.webContents.send('open-shell');
                        }
                    },
                    {
                        label: 'File Transfer',
                        accelerator: 'CmdOrCtrl+F',
                        click: () => {
                            this.mainWindow.webContents.send('file-transfer');
                        }
                    },
                    { type: 'separator' },
                    {
                        label: 'Settings',
                        click: () => {
                            this.openSettings();
                        }
                    }
                ]
            },
            {
                label: 'Help',
                submenu: [
                    {
                        label: 'About',
                        click: () => {
                            this.showAbout();
                        }
                    },
                    {
                        label: 'Documentation',
                        click: () => {
                            require('electron').shell.openExternal('https://github.com/jtgsystems/Phone-Control-Project');
                        }
                    }
                ]
            }
        ];

        // macOS specific menu adjustments
        if (process.platform === 'darwin') {
            template.unshift({
                label: app.getName(),
                submenu: [
                    { label: 'About ' + app.getName(), role: 'about' },
                    { type: 'separator' },
                    { label: 'Services', role: 'services', submenu: [] },
                    { type: 'separator' },
                    { label: 'Hide ' + app.getName(), accelerator: 'Command+H', role: 'hide' },
                    { label: 'Hide Others', accelerator: 'Command+Shift+H', role: 'hideothers' },
                    { label: 'Show All', role: 'unhide' },
                    { type: 'separator' },
                    { label: 'Quit', accelerator: 'Command+Q', click: () => app.quit() }
                ]
            });
        }

        const menu = Menu.buildFromTemplate(template);
        Menu.setApplicationMenu(menu);
    }

    setupIpcHandlers() {
        ipcMain.handle('select-file', async () => {
            const result = await dialog.showOpenDialog(this.mainWindow, {
                properties: ['openFile'],
                filters: [
                    { name: 'APK Files', extensions: ['apk'] },
                    { name: 'All Files', extensions: ['*'] }
                ]
            });
            
            return result;
        });

        ipcMain.handle('select-directory', async () => {
            const result = await dialog.showOpenDialog(this.mainWindow, {
                properties: ['openDirectory']
            });
            
            return result;
        });

        ipcMain.handle('save-file', async (event, defaultName) => {
            const result = await dialog.showSaveDialog(this.mainWindow, {
                defaultPath: defaultName,
                filters: [
                    { name: 'PNG Images', extensions: ['png'] },
                    { name: 'All Files', extensions: ['*'] }
                ]
            });
            
            return result;
        });

        ipcMain.handle('show-notification', (event, title, body) => {
            new Notification({ title, body }).show();
        });
    }

    openSettings() {
        // Create settings window
        const settingsWindow = new BrowserWindow({
            width: 600,
            height: 400,
            parent: this.mainWindow,
            modal: true,
            webPreferences: {
                nodeIntegration: true,
                contextIsolation: false
            }
        });

        const settingsHTML = `
        <!DOCTYPE html>
        <html>
        <head>
            <title>Settings</title>
            <style>
                body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; padding: 20px; }
                .setting { margin-bottom: 15px; }
                label { display: block; margin-bottom: 5px; font-weight: 500; }
                input, select { width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 4px; }
                button { background: #007acc; color: white; border: none; padding: 10px 20px; border-radius: 4px; cursor: pointer; }
                button:hover { background: #005a9e; }
            </style>
        </head>
        <body>
            <h2>Phone Control Settings</h2>
            <div class="setting">
                <label>Default Video Bitrate:</label>
                <select id="bitrate">
                    <option value="4M">4 Mbps</option>
                    <option value="8M" selected>8 Mbps</option>
                    <option value="16M">16 Mbps</option>
                </select>
            </div>
            <div class="setting">
                <label>Max Screen Size:</label>
                <select id="maxSize">
                    <option value="720">720p</option>
                    <option value="1080" selected>1080p</option>
                    <option value="1440">1440p</option>
                    <option value="0">Original</option>
                </select>
            </div>
            <div class="setting">
                <label>Renderer:</label>
                <select id="renderer">
                    <option value="opengl" selected>OpenGL</option>
                    <option value="software">Software</option>
                </select>
            </div>
            <button onclick="saveSettings()">Save Settings</button>
            
            <script>
                function saveSettings() {
                    const settings = {
                        bitrate: document.getElementById('bitrate').value,
                        maxSize: document.getElementById('maxSize').value,
                        renderer: document.getElementById('renderer').value
                    };
                    localStorage.setItem('phoneControlSettings', JSON.stringify(settings));
                    window.close();
                }
            </script>
        </body>
        </html>
        `;

        settingsWindow.loadURL('data:text/html;charset=utf-8,' + encodeURIComponent(settingsHTML));
    }

    showAbout() {
        dialog.showMessageBox(this.mainWindow, {
            type: 'info',
            title: 'About Phone Control Project',
            message: 'Phone Control Project v2.0',
            detail: 'Advanced Android device control with modern web interface.\n\nFeatures:\n• Wireless ADB connection\n• Screen mirroring with scrcpy\n• File transfer\n• Remote shell access\n• Cross-platform support\n\nDeveloped by JTG Systems'
        });
    }
}

// App event handlers
const phoneControl = new PhoneControlElectron();

app.whenReady().then(() => {
    phoneControl.createWindow();

    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) {
            phoneControl.createWindow();
        }
    });
});

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

app.on('before-quit', () => {
    phoneControl.stopServer();
});

// Handle certificate errors for local development
app.on('certificate-error', (event, webContents, url, error, certificate, callback) => {
    if (url.startsWith('https://localhost') || url.startsWith('https://127.0.0.1')) {
        event.preventDefault();
        callback(true);
    } else {
        callback(false);
    }
});