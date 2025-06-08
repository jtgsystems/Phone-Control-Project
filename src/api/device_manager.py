#!/usr/bin/env python3
"""
Advanced Device Manager with Python ADB support
Provides cross-platform device control and automation
"""

import asyncio
import json
import subprocess
import os
import platform
from pathlib import Path
from typing import List, Dict, Optional, Any
import logging
from dataclasses import dataclass
from adb_shell.adb_device import AdbDeviceUsb, AdbDeviceTcp
from adb_shell.auth.sign_pythonrsa import PythonRSASigner

@dataclass
class DeviceInfo:
    id: str
    status: str
    model: str = ""
    android_version: str = ""
    ip_address: str = ""
    battery_level: int = 0
    screen_resolution: str = ""

class AdvancedDeviceManager:
    def __init__(self):
        self.logger = logging.getLogger(__name__)
        self.setup_logging()
        self.adb_path = self._find_adb_path()
        self.devices: Dict[str, DeviceInfo] = {}
        self.signer = self._setup_signer()
        
    def setup_logging(self):
        logging.basicConfig(
            level=logging.INFO,
            format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
        )
    
    def _find_adb_path(self) -> str:
        """Find ADB executable path"""
        # Try bundled ADB first
        bundled_adb = Path(__file__).parent.parent.parent / "Software" / "adb.exe"
        if bundled_adb.exists():
            return str(bundled_adb)
        
        # Try system ADB
        system_adb = "adb.exe" if platform.system() == "Windows" else "adb"
        try:
            subprocess.run([system_adb, "version"], check=True, capture_output=True)
            return system_adb
        except (subprocess.CalledProcessError, FileNotFoundError):
            raise RuntimeError("ADB not found. Please install ADB or use bundled version.")
    
    def _setup_signer(self):
        """Setup ADB authentication signer"""
        try:
            adb_key_path = Path.home() / ".android" / "adbkey"
            if adb_key_path.exists():
                with open(adb_key_path, 'rb') as f:
                    private_key = f.read()
                return PythonRSASigner('', private_key)
        except Exception as e:
            self.logger.warning(f"Could not setup signer: {e}")
        return None
    
    async def get_devices(self) -> List[DeviceInfo]:
        """Get list of connected devices with detailed info"""
        try:
            result = await self._run_adb_command(["devices", "-l"])
            devices = self._parse_devices(result.stdout)
            
            # Get detailed info for each device
            detailed_devices = []
            for device in devices:
                if device.status == "device":
                    detailed_info = await self._get_device_details(device.id)
                    device.__dict__.update(detailed_info)
                detailed_devices.append(device)
            
            self.devices = {d.id: d for d in detailed_devices}
            return detailed_devices
            
        except Exception as e:
            self.logger.error(f"Failed to get devices: {e}")
            return []
    
    def _parse_devices(self, output: str) -> List[DeviceInfo]:
        """Parse ADB devices output"""
        devices = []
        lines = output.strip().split('\n')[1:]  # Skip header
        
        for line in lines:
            if not line.strip():
                continue
            
            parts = line.strip().split()
            if len(parts) >= 2:
                device_id = parts[0]
                status = parts[1]
                devices.append(DeviceInfo(id=device_id, status=status))
        
        return devices
    
    async def _get_device_details(self, device_id: str) -> Dict[str, Any]:
        """Get detailed information about a device"""
        details = {}
        
        try:
            # Get model
            result = await self._run_adb_command(["-s", device_id, "shell", "getprop", "ro.product.model"])
            details["model"] = result.stdout.strip()
            
            # Get Android version
            result = await self._run_adb_command(["-s", device_id, "shell", "getprop", "ro.build.version.release"])
            details["android_version"] = result.stdout.strip()
            
            # Get battery level
            result = await self._run_adb_command(["-s", device_id, "shell", "dumpsys", "battery"])
            for line in result.stdout.split('\n'):
                if 'level:' in line:
                    details["battery_level"] = int(line.split(':')[1].strip())
                    break
            
            # Get screen resolution
            result = await self._run_adb_command(["-s", device_id, "shell", "wm", "size"])
            if "Physical size:" in result.stdout:
                details["screen_resolution"] = result.stdout.split("Physical size:")[1].strip()
            
            # Get IP address
            result = await self._run_adb_command(["-s", device_id, "shell", "ip", "route"])
            for line in result.stdout.split('\n'):
                if 'wlan0' in line and 'src' in line:
                    parts = line.split('src')
                    if len(parts) > 1:
                        details["ip_address"] = parts[1].strip().split()[0]
                        break
        
        except Exception as e:
            self.logger.warning(f"Could not get details for {device_id}: {e}")
        
        return details
    
    async def connect_wifi(self, ip: str, port: int = 5555) -> Dict[str, Any]:
        """Connect to device via WiFi"""
        try:
            result = await self._run_adb_command(["connect", f"{ip}:{port}"])
            success = "connected" in result.stdout.lower()
            
            return {
                "success": success,
                "message": result.stdout.strip(),
                "ip": ip,
                "port": port
            }
        except Exception as e:
            return {
                "success": False,
                "error": str(e)
            }
    
    async def enable_wifi_debugging(self, device_id: str, port: int = 5555) -> Dict[str, Any]:
        """Enable WiFi debugging on device"""
        try:
            result = await self._run_adb_command(["-s", device_id, "tcpip", str(port)])
            success = "restarting" in result.stdout.lower()
            
            return {
                "success": success,
                "message": result.stdout.strip(),
                "port": port
            }
        except Exception as e:
            return {
                "success": False,
                "error": str(e)
            }
    
    async def install_apk(self, device_id: str, apk_path: str) -> Dict[str, Any]:
        """Install APK on device"""
        try:
            result = await self._run_adb_command(["-s", device_id, "install", apk_path])
            success = "Success" in result.stdout
            
            return {
                "success": success,
                "message": result.stdout.strip()
            }
        except Exception as e:
            return {
                "success": False,
                "error": str(e)
            }
    
    async def push_file(self, device_id: str, local_path: str, remote_path: str) -> Dict[str, Any]:
        """Push file to device"""
        try:
            result = await self._run_adb_command(["-s", device_id, "push", local_path, remote_path])
            success = result.returncode == 0
            
            return {
                "success": success,
                "message": result.stdout.strip() if result.stdout else "File pushed successfully"
            }
        except Exception as e:
            return {
                "success": False,
                "error": str(e)
            }
    
    async def pull_file(self, device_id: str, remote_path: str, local_path: str) -> Dict[str, Any]:
        """Pull file from device"""
        try:
            result = await self._run_adb_command(["-s", device_id, "pull", remote_path, local_path])
            success = result.returncode == 0
            
            return {
                "success": success,
                "message": result.stdout.strip() if result.stdout else "File pulled successfully"
            }
        except Exception as e:
            return {
                "success": False,
                "error": str(e)
            }
    
    async def execute_shell_command(self, device_id: str, command: str) -> Dict[str, Any]:
        """Execute shell command on device"""
        try:
            cmd = ["-s", device_id, "shell"] + command.split()
            result = await self._run_adb_command(cmd)
            
            return {
                "success": result.returncode == 0,
                "output": result.stdout.strip(),
                "error": result.stderr.strip() if result.stderr else None
            }
        except Exception as e:
            return {
                "success": False,
                "error": str(e)
            }
    
    async def take_screenshot(self, device_id: str, output_path: str = None) -> Dict[str, Any]:
        """Take screenshot of device screen"""
        try:
            if not output_path:
                output_path = f"screenshot_{device_id}_{int(asyncio.get_event_loop().time())}.png"
            
            # Take screenshot on device
            await self._run_adb_command(["-s", device_id, "shell", "screencap", "/sdcard/screenshot.png"])
            
            # Pull screenshot to local
            result = await self._run_adb_command(["-s", device_id, "pull", "/sdcard/screenshot.png", output_path])
            
            # Clean up device
            await self._run_adb_command(["-s", device_id, "shell", "rm", "/sdcard/screenshot.png"])
            
            return {
                "success": result.returncode == 0,
                "path": output_path
            }
        except Exception as e:
            return {
                "success": False,
                "error": str(e)
            }
    
    async def start_scrcpy(self, device_id: str = None, **options) -> Dict[str, Any]:
        """Start scrcpy for screen mirroring"""
        try:
            scrcpy_path = self._find_scrcpy_path()
            cmd = [scrcpy_path]
            
            if device_id:
                cmd.extend(["-s", device_id])
            
            # Add options
            cmd.extend([
                "--video-bit-rate", options.get("bitrate", "8M"),
                "--max-size", options.get("max_size", "1080"),
                "--render-driver", options.get("renderer", "opengl")
            ])
            
            if options.get("stay_awake", True):
                cmd.append("--stay-awake")
            
            if options.get("show_touches", True):
                cmd.append("--show-touches")
            
            # Start scrcpy process (non-blocking)
            process = await asyncio.create_subprocess_exec(
                *cmd,
                stdout=asyncio.subprocess.PIPE,
                stderr=asyncio.subprocess.PIPE
            )
            
            return {
                "success": True,
                "message": "Scrcpy started",
                "pid": process.pid
            }
            
        except Exception as e:
            return {
                "success": False,
                "error": str(e)
            }
    
    def _find_scrcpy_path(self) -> str:
        """Find scrcpy executable"""
        bundled_scrcpy = Path(__file__).parent.parent.parent / "Software" / "scrcpy.exe"
        if bundled_scrcpy.exists():
            return str(bundled_scrcpy)
        
        system_scrcpy = "scrcpy.exe" if platform.system() == "Windows" else "scrcpy"
        try:
            subprocess.run([system_scrcpy, "--version"], check=True, capture_output=True)
            return system_scrcpy
        except (subprocess.CalledProcessError, FileNotFoundError):
            raise RuntimeError("Scrcpy not found. Please install scrcpy.")
    
    async def _run_adb_command(self, args: List[str]) -> subprocess.CompletedProcess:
        """Run ADB command asynchronously"""
        cmd = [self.adb_path] + args
        
        process = await asyncio.create_subprocess_exec(
            *cmd,
            stdout=asyncio.subprocess.PIPE,
            stderr=asyncio.subprocess.PIPE
        )
        
        stdout, stderr = await process.communicate()
        
        return subprocess.CompletedProcess(
            args=cmd,
            returncode=process.returncode,
            stdout=stdout.decode('utf-8', errors='ignore'),
            stderr=stderr.decode('utf-8', errors='ignore')
        )

# FastAPI Integration
if __name__ == "__main__":
    import uvicorn
    from fastapi import FastAPI, HTTPException, UploadFile, File
    from fastapi.responses import JSONResponse
    from pydantic import BaseModel
    
    app = FastAPI(title="Phone Control API", version="2.0.0")
    device_manager = AdvancedDeviceManager()
    
    class WiFiConnectionRequest(BaseModel):
        ip: str
        port: int = 5555
    
    class ShellCommandRequest(BaseModel):
        device_id: str
        command: str
    
    @app.get("/api/devices")
    async def get_devices():
        devices = await device_manager.get_devices()
        return {"success": True, "devices": [device.__dict__ for device in devices]}
    
    @app.post("/api/connect-wifi")
    async def connect_wifi(request: WiFiConnectionRequest):
        result = await device_manager.connect_wifi(request.ip, request.port)
        return result
    
    @app.post("/api/enable-wifi/{device_id}")
    async def enable_wifi(device_id: str, port: int = 5555):
        result = await device_manager.enable_wifi_debugging(device_id, port)
        return result
    
    @app.post("/api/shell-command")
    async def execute_shell_command(request: ShellCommandRequest):
        result = await device_manager.execute_shell_command(request.device_id, request.command)
        return result
    
    @app.post("/api/screenshot/{device_id}")
    async def take_screenshot(device_id: str):
        result = await device_manager.take_screenshot(device_id)
        return result
    
    @app.post("/api/scrcpy/start")
    async def start_scrcpy(device_id: str = None, bitrate: str = "8M", max_size: str = "1080"):
        result = await device_manager.start_scrcpy(
            device_id=device_id,
            bitrate=bitrate,
            max_size=max_size
        )
        return result
    
    @app.post("/api/upload/{device_id}")
    async def upload_file(device_id: str, file: UploadFile = File(...), remote_path: str = "/sdcard/"):
        try:
            # Save uploaded file temporarily
            temp_path = f"/tmp/{file.filename}"
            with open(temp_path, "wb") as f:
                content = await file.read()
                f.write(content)
            
            # Push to device
            result = await device_manager.push_file(device_id, temp_path, remote_path + file.filename)
            
            # Clean up
            os.unlink(temp_path)
            
            return result
        except Exception as e:
            raise HTTPException(status_code=500, detail=str(e))
    
    if __name__ == "__main__":
        uvicorn.run(app, host="0.0.0.0", port=8000)