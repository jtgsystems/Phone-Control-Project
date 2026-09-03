import subprocess
import shutil
import re
import sys
from dataclasses import dataclass
from typing import List, Dict, Optional

@dataclass
class AndroidDevice:
    serial: str
    status: str
    model: str = "Android Device"
    is_wireless: bool = False

def get_adb_binary() -> str:
    # 1. System adb
    if shutil.which("adb"):
        return "adb"
    # 2. Bundled Windows adb
    import os
    bundled = os.path.join(os.path.dirname(os.path.dirname(__file__)), "Software", "adb.exe")
    if os.path.exists(bundled):
        return bundled
    return "adb"

def get_scrcpy_binary() -> str:
    if shutil.which("scrcpy"):
        return "scrcpy"
    import os
    bundled = os.path.join(os.path.dirname(os.path.dirname(__file__)), "Software", "scrcpy.exe")
    if os.path.exists(bundled):
        return bundled
    return "scrcpy"

class PhoneManager:
    @staticmethod
    def list_devices() -> List[AndroidDevice]:
        adb = get_adb_binary()
        devices = []
        try:
            out = subprocess.check_output([adb, "devices", "-l"], text=True)
            for line in out.strip().splitlines()[1:]:
                if not line.strip(): continue
                parts = line.split()
                if len(parts) >= 2:
                    serial = parts[0]
                    status = parts[1]
                    model_m = re.search(r"model:(\S+)", line)
                    model = model_m.group(1).replace("_", " ") if model_m else "Android Device"
                    is_wireless = ":" in serial
                    devices.append(AndroidDevice(serial=serial, status=status, model=model, is_wireless=is_wireless))
        except Exception as e:
            pass
        return devices

    @staticmethod
    def enable_wireless(serial: Optional[str] = None, port: int = 5555) -> Optional[str]:
        adb = get_adb_binary()
        cmd_prefix = [adb]
        if serial: cmd_prefix.extend(["-s", serial])
        
        # 1. Get device IP address
        try:
            ip_out = subprocess.check_output(cmd_prefix + ["shell", "ip", "route"], text=True)
            ip_m = re.search(r"src\s+(\d+\.\d+\.\d+\.\d+)", ip_out)
            ip_addr = ip_m.group(1) if ip_m else None
            
            # Switch to tcpip mode
            subprocess.run(cmd_prefix + ["tcpip", str(port)], check=True)
            
            if ip_addr:
                # Connect wirelessly
                subprocess.run([adb, "connect", f"{ip_addr}:{port}"], check=True)
                return f"{ip_addr}:{port}"
        except Exception:
            pass
        return None

    @staticmethod
    def launch_mirror(serial: Optional[str] = None, max_size: int = 1920, bit_rate: str = "16M", max_fps: int = 60):
        scrcpy = get_scrcpy_binary()
        cmd = [
            scrcpy,
            "--video-bit-rate", bit_rate,
            "--max-size", str(max_size),
            "--max-fps", str(max_fps),
            "--stay-awake",
            "--show-touches",
            "--render-driver", "opengl"
        ]
        if serial:
            cmd.extend(["-s", serial])
            
        print(f"🚀 Starting screen mirror: {' '.join(cmd)}")
        subprocess.run(cmd)
