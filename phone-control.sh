#!/usr/bin/env bash
# JTG Systems - Phone Control & Screen Mirroring Launcher (Linux / macOS)
set -e

if command -v phone-control &>/dev/null; then
    exec phone-control "$@"
elif command -v python3 &>/dev/null; then
    SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
    export PYTHONPATH="$SCRIPT_DIR:$PYTHONPATH"
    exec python3 -m phone_control.cli "$@"
elif command -v scrcpy &>/dev/null; then
    exec scrcpy --video-bit-rate 16M --max-size 1920 --max-fps 60 --stay-awake --show-touches --render-driver opengl "$@"
else
    echo "Please install scrcpy and adb (e.g. sudo apt install scrcpy adb / brew install scrcpy)."
    exit 1
fi
