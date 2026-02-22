import time
import requests
import json
import os
import platform
import psutil
from datetime import datetime
from PIL import ImageGrab
import pyautogui
from pynput import mouse, keyboard
import threading
import base64
from io import BytesIO

# Configuration
API_BASE_URL = 'http://localhost:5000/api'
AUTH_TOKEN = '' # Set after login
POLL_INTERVAL = 10 # seconds
SCREENSHOT_INTERVAL = 60 # seconds (1 minute)

# Global counters
mouse_clicks = 0
mouse_moves = 0
key_presses = 0
is_tracking = False
user_id = None

def on_click(x, y, button, pressed):
    global mouse_clicks
    if pressed:
        mouse_clicks += 1

def on_move(x, y):
    global mouse_moves
    mouse_moves += 1

def on_press(key):
    global key_presses
    key_presses += 1

# Start listeners
mouse_listener = mouse.Listener(on_click=on_click, on_move=on_move)
keyboard_listener = keyboard.Listener(on_press=on_press)

mouse_listener.start()
keyboard_listener.start()

def get_active_window():
    if platform.system() == 'Windows':
        import pygetwindow as gw
        window = gw.getActiveWindow()
        if window:
            return window.title
    return "Unknown"

def take_screenshot():
    try:
        screenshot = ImageGrab.grab()
        buffered = BytesIO()
        screenshot.save(buffered, format="JPEG", quality=50)
        img_str = base64.b64encode(buffered.getvalue()).decode()
        return img_str
    except Exception as e:
        print(f"Error taking screenshot: {e}")
        return None

def sync_activity():
    global mouse_clicks, mouse_moves, key_presses, is_tracking
    
    while True:
        if is_tracking and AUTH_TOKEN:
            try:
                window_title = get_active_window()
                activity_level = min(100, (mouse_clicks + mouse_moves + key_presses) / 10) # Simple heuristic
                
                payload = {
                    "appName": window_title,
                    "activityLevel": activity_level,
                    "keyboardCount": key_presses,
                    "mouseCount": mouse_clicks + mouse_moves,
                }
                
                # Take screenshot every minute (roughly)
                if int(time.time()) % SCREENSHOT_INTERVAL < POLL_INTERVAL:
                    payload["screenshot"] = take_screenshot()
                
                headers = {'Authorization': f'Bearer {AUTH_TOKEN}'}
                response = requests.post(f"{API_BASE_URL}/activities/log", json=payload, headers=headers)
                
                if response.status_code == 200:
                    print(f"Synced: {window_title} | Activity: {activity_level}%")
                    # Reset counters after successful sync
                    mouse_clicks = 0
                    mouse_moves = 0
                    key_presses = 0
                else:
                    print(f"Failed to sync: {response.status_code}")
                    
            except Exception as e:
                print(f"Sync error: {e}")
        
        time.sleep(POLL_INTERVAL)

if __name__ == "__main__":
    print("Hubstaff-like Tracker Started...")
    # This would normally wait for a signal from the UI or command line to start
    # For now, we'll just keep the structure
    tracker_thread = threading.Thread(target=sync_activity, daemon=True)
    tracker_thread.start()
    
    try:
        while True:
            time.sleep(1)
    except KeyboardInterrupt:
        print("Tracker stopped.")
