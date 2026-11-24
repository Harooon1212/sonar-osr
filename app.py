"""
Top-level entrypoint for SonarOSR Web Platform (Hugging Face Spaces / Cloud Deployment).
Serves the FastAPI backend and mounted React production frontend on a single unified port (7860).
"""

import sys
from pathlib import Path

# Ensure project root is in sys.path
ROOT = Path(__file__).resolve().parent
if str(ROOT) not in sys.path:
    sys.path.insert(0, str(ROOT))

# Ensure backend app is in sys.path
backend_app_dir = ROOT / "sonar-osr-web" / "backend" / "app"
if str(backend_app_dir) not in sys.path:
    sys.path.insert(0, str(backend_app_dir))

# Import FastAPI app from main.py
from main import app

if __name__ == "__main__":
    import uvicorn
    import os
    port = int(os.environ.get("PORT", 7860))
    uvicorn.run("app:app", host="0.0.0.0", port=port, reload=False)
