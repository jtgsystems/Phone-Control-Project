import unittest
from unittest.mock import patch
from phone_control.manager import PhoneManager, AndroidDevice, get_adb_binary, get_scrcpy_binary

class TestPhoneControlManager(unittest.TestCase):
    def test_binary_resolution(self):
        adb = get_adb_binary()
        self.assertTrue(len(adb) > 0)
        scrcpy = get_scrcpy_binary()
        self.assertTrue(len(scrcpy) > 0)

    @patch("subprocess.check_output")
    def test_list_devices_parsing(self, mock_subp):
        mock_output = """List of devices attached
RFCT40XYZ123         device product:starqlteue model:SM_G960U device:starqlte
192.168.1.105:5555   device product:husky model:Pixel_8_Pro device:husky
1234567890ABCDEF     unauthorized usb:1-1
"""
        mock_subp.return_value = mock_output
        
        devices = PhoneManager.list_devices()
        self.assertEqual(len(devices), 3)
        
        # Device 1: USB Samsung Galaxy S9
        self.assertEqual(devices[0].serial, "RFCT40XYZ123")
        self.assertEqual(devices[0].status, "device")
        self.assertEqual(devices[0].model, "SM G960U")
        self.assertFalse(devices[0].is_wireless)
        
        # Device 2: Wireless Pixel 8 Pro
        self.assertEqual(devices[1].serial, "192.168.1.105:5555")
        self.assertEqual(devices[1].status, "device")
        self.assertEqual(devices[1].model, "Pixel 8 Pro")
        self.assertTrue(devices[1].is_wireless)
        
        # Device 3: Unauthorized device
        self.assertEqual(devices[2].serial, "1234567890ABCDEF")
        self.assertEqual(devices[2].status, "unauthorized")

    @patch("subprocess.check_output")
    @patch("subprocess.run")
    def test_enable_wireless(self, mock_run, mock_check_output):
        mock_check_output.return_value = "default via 192.168.1.1 dev wlan0  src 192.168.1.150  metric 10"
        
        res = PhoneManager.enable_wireless(serial="USB123", port=5555)
        self.assertEqual(res, "192.168.1.150:5555")

if __name__ == "__main__":
    unittest.main()
