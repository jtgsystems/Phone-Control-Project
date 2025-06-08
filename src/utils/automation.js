/**
 * Advanced Android Device Automation Utilities
 * Provides high-level automation functions for common tasks
 */

class DeviceAutomation {
    constructor(deviceController) {
        this.deviceController = deviceController;
        this.scripts = new Map();
        this.running = new Set();
    }

    /**
     * Install multiple APKs in sequence
     */
    async batchInstallApks(deviceId, apkPaths, progressCallback) {
        const results = [];
        
        for (let i = 0; i < apkPaths.length; i++) {
            const apkPath = apkPaths[i];
            
            if (progressCallback) {
                progressCallback({
                    current: i + 1,
                    total: apkPaths.length,
                    file: apkPath,
                    status: 'installing'
                });
            }
            
            try {
                const result = await this.deviceController.executeAdbCommand(
                    deviceId, 
                    `install "${apkPath}"`
                );
                
                results.push({
                    file: apkPath,
                    success: result.success,
                    output: result.output,
                    error: result.error
                });
                
            } catch (error) {
                results.push({
                    file: apkPath,
                    success: false,
                    error: error.message
                });
            }
        }
        
        return results;
    }

    /**
     * Backup device data
     */
    async backupDevice(deviceId, backupPath, options = {}) {
        const backupOptions = {
            includeApks: options.includeApks || false,
            includeShared: options.includeShared || true,
            includeSystem: options.includeSystem || false,
            ...options
        };

        try {
            let command = `backup -f "${backupPath}"`;
            
            if (backupOptions.includeApks) command += ' -apk';
            if (backupOptions.includeShared) command += ' -shared';
            if (backupOptions.includeSystem) command += ' -system';
            if (backupOptions.all) command += ' -all';

            const result = await this.deviceController.executeAdbCommand(deviceId, command);
            
            return {
                success: result.success,
                backupPath,
                message: result.output
            };
            
        } catch (error) {
            return {
                success: false,
                error: error.message
            };
        }
    }

    /**
     * Sync files between device and computer
     */
    async syncFiles(deviceId, localPath, remotePath, direction = 'push') {
        try {
            const command = direction === 'push' 
                ? `push "${localPath}" "${remotePath}"`
                : `pull "${remotePath}" "${localPath}"`;

            const result = await this.deviceController.executeAdbCommand(deviceId, command);
            
            return {
                success: result.success,
                direction,
                localPath,
                remotePath,
                output: result.output
            };
            
        } catch (error) {
            return {
                success: false,
                error: error.message
            };
        }
    }

    /**
     * Device performance monitoring
     */
    async monitorPerformance(deviceId, duration = 30000) {
        const startTime = Date.now();
        const metrics = [];

        const interval = setInterval(async () => {
            try {
                // CPU usage
                const cpuResult = await this.deviceController.executeAdbCommand(
                    deviceId, 
                    'shell top -n 1'
                );

                // Memory usage
                const memResult = await this.deviceController.executeAdbCommand(
                    deviceId, 
                    'shell cat /proc/meminfo'
                );

                // Battery info
                const batteryResult = await this.deviceController.executeAdbCommand(
                    deviceId, 
                    'shell dumpsys battery'
                );

                const timestamp = Date.now();
                const metric = {
                    timestamp,
                    cpu: this.parseCpuUsage(cpuResult.output),
                    memory: this.parseMemoryUsage(memResult.output),
                    battery: this.parseBatteryInfo(batteryResult.output)
                };

                metrics.push(metric);

                if (timestamp - startTime >= duration) {
                    clearInterval(interval);
                }

            } catch (error) {
                console.error('Performance monitoring error:', error);
            }
        }, 1000);

        return new Promise((resolve) => {
            setTimeout(() => {
                clearInterval(interval);
                resolve({
                    success: true,
                    duration,
                    metrics,
                    summary: this.calculatePerformanceSummary(metrics)
                });
            }, duration);
        });
    }

    /**
     * Network speed test
     */
    async testNetworkSpeed(deviceId, testUrl = 'http://speedtest.ftp.otenet.gr/files/test1Mb.db') {
        try {
            const startTime = Date.now();
            
            const result = await this.deviceController.executeAdbCommand(
                deviceId,
                `shell curl -o /dev/null -w "%{time_total},%{speed_download}" "${testUrl}"`
            );

            const endTime = Date.now();
            const [totalTime, downloadSpeed] = result.output.split(',');

            return {
                success: true,
                totalTime: parseFloat(totalTime),
                downloadSpeed: parseFloat(downloadSpeed),
                testDuration: endTime - startTime,
                testUrl
            };

        } catch (error) {
            return {
                success: false,
                error: error.message
            };
        }
    }

    /**
     * Automated app testing
     */
    async testApp(deviceId, packageName, testActions = []) {
        const results = [];

        try {
            // Launch app
            await this.deviceController.executeAdbCommand(
                deviceId,
                `shell monkey -p ${packageName} -c android.intent.category.LAUNCHER 1`
            );

            // Wait for app to load
            await this.sleep(3000);

            // Execute test actions
            for (const action of testActions) {
                const result = await this.executeTestAction(deviceId, action);
                results.push(result);
                
                // Wait between actions
                await this.sleep(action.delay || 1000);
            }

            return {
                success: true,
                packageName,
                results
            };

        } catch (error) {
            return {
                success: false,
                error: error.message,
                results
            };
        }
    }

    /**
     * Device cleanup and optimization
     */
    async optimizeDevice(deviceId) {
        const operations = [];

        try {
            // Clear cache
            const cacheResult = await this.deviceController.executeAdbCommand(
                deviceId,
                'shell pm trim-caches 1000M'
            );
            operations.push({ operation: 'clear_cache', success: cacheResult.success });

            // Force stop unnecessary apps
            const runningApps = await this.getRunningApps(deviceId);
            const systemApps = ['com.android.systemui', 'com.android.launcher'];
            
            for (const app of runningApps) {
                if (!systemApps.includes(app) && !app.startsWith('android.')) {
                    const stopResult = await this.deviceController.executeAdbCommand(
                        deviceId,
                        `shell am force-stop ${app}`
                    );
                    operations.push({ 
                        operation: 'force_stop', 
                        app, 
                        success: stopResult.success 
                    });
                }
            }

            // Update package list
            const updateResult = await this.deviceController.executeAdbCommand(
                deviceId,
                'shell pm list packages'
            );
            operations.push({ operation: 'update_packages', success: updateResult.success });

            return {
                success: true,
                operations
            };

        } catch (error) {
            return {
                success: false,
                error: error.message,
                operations
            };
        }
    }

    /**
     * Screen recording automation
     */
    async recordScreen(deviceId, duration = 30, outputPath = null) {
        if (!outputPath) {
            outputPath = `screen_recording_${Date.now()}.mp4`;
        }

        try {
            // Start recording on device
            const recordCommand = `shell screenrecord --time-limit ${duration} /sdcard/recording.mp4`;
            
            const recordProcess = this.deviceController.executeAdbCommand(deviceId, recordCommand);
            
            // Wait for recording to complete
            await Promise.all([recordProcess, this.sleep(duration * 1000)]);

            // Pull recording to local
            const pullResult = await this.deviceController.executeAdbCommand(
                deviceId,
                `pull /sdcard/recording.mp4 "${outputPath}"`
            );

            // Clean up device
            await this.deviceController.executeAdbCommand(
                deviceId,
                'shell rm /sdcard/recording.mp4'
            );

            return {
                success: pullResult.success,
                outputPath,
                duration
            };

        } catch (error) {
            return {
                success: false,
                error: error.message
            };
        }
    }

    // Helper methods
    async executeTestAction(deviceId, action) {
        switch (action.type) {
            case 'tap':
                return await this.deviceController.executeAdbCommand(
                    deviceId,
                    `shell input tap ${action.x} ${action.y}`
                );
            
            case 'swipe':
                return await this.deviceController.executeAdbCommand(
                    deviceId,
                    `shell input swipe ${action.x1} ${action.y1} ${action.x2} ${action.y2} ${action.duration || 500}`
                );
            
            case 'text':
                return await this.deviceController.executeAdbCommand(
                    deviceId,
                    `shell input text "${action.text}"`
                );
            
            case 'key':
                return await this.deviceController.executeAdbCommand(
                    deviceId,
                    `shell input keyevent ${action.keycode}`
                );
            
            default:
                return { success: false, error: 'Unknown action type' };
        }
    }

    async getRunningApps(deviceId) {
        try {
            const result = await this.deviceController.executeAdbCommand(
                deviceId,
                'shell ps | grep -E "u[0-9]+_a[0-9]+"'
            );
            
            const lines = result.output.split('\n');
            const apps = [];
            
            for (const line of lines) {
                const match = line.match(/u\d+_a\d+\s+\d+\s+\d+\s+\d+\s+\d+\s+\w+\s+\w+\s+(\S+)/);
                if (match && match[1]) {
                    apps.push(match[1]);
                }
            }
            
            return apps;
        } catch (error) {
            return [];
        }
    }

    parseCpuUsage(output) {
        // Parse top command output for CPU usage
        const lines = output.split('\n');
        for (const line of lines) {
            if (line.includes('CPU:')) {
                const match = line.match(/(\d+(?:\.\d+)?)%/);
                return match ? parseFloat(match[1]) : 0;
            }
        }
        return 0;
    }

    parseMemoryUsage(output) {
        // Parse /proc/meminfo for memory usage
        const lines = output.split('\n');
        const memInfo = {};
        
        for (const line of lines) {
            const match = line.match(/^(\w+):\s*(\d+)\s*kB/);
            if (match) {
                memInfo[match[1]] = parseInt(match[2]);
            }
        }
        
        if (memInfo.MemTotal && memInfo.MemAvailable) {
            const used = memInfo.MemTotal - memInfo.MemAvailable;
            return {
                total: memInfo.MemTotal,
                used,
                available: memInfo.MemAvailable,
                percentage: (used / memInfo.MemTotal) * 100
            };
        }
        
        return null;
    }

    parseBatteryInfo(output) {
        // Parse battery dumpsys output
        const lines = output.split('\n');
        const battery = {};
        
        for (const line of lines) {
            if (line.includes('level:')) {
                battery.level = parseInt(line.split(':')[1].trim());
            } else if (line.includes('temperature:')) {
                battery.temperature = parseInt(line.split(':')[1].trim());
            } else if (line.includes('status:')) {
                battery.status = line.split(':')[1].trim();
            }
        }
        
        return battery;
    }

    calculatePerformanceSummary(metrics) {
        if (metrics.length === 0) return null;

        const cpuValues = metrics.map(m => m.cpu).filter(Boolean);
        const memoryValues = metrics.map(m => m.memory?.percentage).filter(Boolean);
        const batteryLevels = metrics.map(m => m.battery?.level).filter(Boolean);

        return {
            cpu: {
                avg: cpuValues.reduce((a, b) => a + b, 0) / cpuValues.length,
                max: Math.max(...cpuValues),
                min: Math.min(...cpuValues)
            },
            memory: {
                avg: memoryValues.reduce((a, b) => a + b, 0) / memoryValues.length,
                max: Math.max(...memoryValues),
                min: Math.min(...memoryValues)
            },
            battery: {
                start: batteryLevels[0],
                end: batteryLevels[batteryLevels.length - 1],
                drain: batteryLevels[0] - batteryLevels[batteryLevels.length - 1]
            }
        };
    }

    sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}

module.exports = DeviceAutomation;