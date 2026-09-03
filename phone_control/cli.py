import argparse
import sys
from .manager import PhoneManager

def main():
    parser = argparse.ArgumentParser(
        prog="phone-control",
        description="JTG Systems - Cross-Platform Android Phone Control & Wireless Screen Mirroring"
    )
    subparsers = parser.add_subparsers(dest="command")
    
    subparsers.add_parser("devices", help="List connected Android devices (USB and Wireless)")
    subparsers.add_parser("mirror", help="Launch low-latency screen mirror with scrcpy")
    
    wifi_p = subparsers.add_parser("wireless", help="Enable wireless ADB on connected USB device")
    wifi_p.add_argument("-s", "--serial", help="Target device serial")
    wifi_p.add_argument("-p", "--port", type=int, default=5555, help="Port (default: 5555)")
    
    connect_p = subparsers.add_parser("connect", help="Connect to wireless IP address")
    connect_p.add_argument("ip", help="Device IP or IP:PORT (e.g. 192.168.1.50)")
    
    args = parser.parse_args()
    
    if args.command == "devices":
        devs = PhoneManager.list_devices()
        print(f"📱 Connected Devices ({len(devs)} found):")
        for idx, d in enumerate(devs, 1):
            conn_type = "📶 Wireless" if d.is_wireless else "🔌 USB"
            print(f"  [{idx}] {d.model} ({d.serial}) - Status: {d.status} [{conn_type}]")
    elif args.command == "wireless":
        res = PhoneManager.enable_wireless(args.serial, args.port)
        if res:
            print(f"✓ Wireless ADB enabled! Connected to {res}. You can now unplug the USB cable!")
        else:
            print("❌ Failed to enable wireless mode. Ensure device is plugged in via USB with debugging authorized.")
    elif args.command == "mirror":
        PhoneManager.launch_mirror()
    else:
        devs = PhoneManager.list_devices()
        if not devs:
            print("📱 JTG Systems Phone Control Center")
            print("No devices detected. Please plug in your Android phone via USB with USB Debugging enabled.")
            print("\nCommands:")
            print("  phone-control devices     - List connected devices")
            print("  phone-control mirror      - Mirror phone screen")
            print("  phone-control wireless    - Switch USB device to wireless WiFi mode")
        else:
            print(f"📱 Found {len(devs)} device(s): {devs[0].model} ({devs[0].serial})")
            print("Launching high-definition screen mirror...")
            PhoneManager.launch_mirror(devs[0].serial)

if __name__ == "__main__":
    main()
