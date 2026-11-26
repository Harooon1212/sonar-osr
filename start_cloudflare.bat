@echo off
echo ========================================================
echo Starting SonarOSR Public Deployment (Cloudflare Tunnel)
echo ========================================================
echo.

start "SonarOSR Server (Port 7860)" cmd /k "cd /d "%~dp0" && python app.py"

timeout /t 4 /nobreak >nul

start "SonarOSR Cloudflare Tunnel" cmd /k "cd /d "%~dp0" && cloudflared.exe tunnel --url http://127.0.0.1:7860"

echo.
echo Both services started!
echo Look inside the "SonarOSR Cloudflare Tunnel" window for your public https://....trycloudflare.com link.
echo Keep both windows open while hosting from your laptop.
echo ========================================================
pause
