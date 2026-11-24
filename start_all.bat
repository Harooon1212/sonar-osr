@echo off
set "PATH=C:\Program Files\nodejs;%PATH%"
echo ========================================================
echo Starting SonarOSR Full-Stack Platform...
echo ========================================================

start "SonarOSR Backend (FastAPI :8000)" cmd /k "cd /d "%~dp0" && python -m uvicorn sonar-osr-web.backend.app.main:app --port 8000 --reload"

timeout /t 2 /nobreak >nul

start "SonarOSR Frontend (Vite :5173)" cmd /k "set "PATH=C:\Program Files\nodejs;%%PATH%%" && cd /d "%~dp0sonar-osr-web\frontend" && npm run dev"

echo.
echo Both servers started!
echo Frontend: http://localhost:5173
echo Backend:  http://localhost:8000
echo ========================================================
