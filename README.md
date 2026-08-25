# FORGEE

Sovereign, on-premise, agentic AI workbench for MRPL confidential industrial work.

## Offline static demo

The browser prototype is standalone. It does not call an API, require FastAPI, or need internet access at runtime. The `backend/` folder is optional reference code and is not needed for this demo.

### One-time preparation

Run this while internet is available, or use the already-installed dependencies and cached Docker image on the demo laptop:

```powershell
cd C:\path\to\prototype
npm install
npm run build
docker image ls python
```

The Docker image `python:3.11-slim` must already be cached locally.

### Build offline

Disconnect from the internet, then run:

```powershell
cd C:\path\to\prototype
docker compose -f docker-compose.demo.yml build --pull=false
```

The `--pull=false` flag prevents Docker from downloading a newer base image.

### Start offline

```powershell
docker compose -f docker-compose.demo.yml up
```

Open http://localhost:5173/.

The app has no external URLs, so it remains offline-safe. Docker's normal local bridge is used only so Windows can publish the container on localhost, and the port is bound to `127.0.0.1` rather than the LAN.

### Stop offline

Press `Ctrl+C`, then run:

```powershell
docker compose -f docker-compose.demo.yml down
```

### Verify

```powershell
docker image ls mrpl-workbench
docker compose -f docker-compose.demo.yml ps
```

### Local non-Docker run

```powershell
npm run dev -- --host 127.0.0.1
```

Open http://localhost:5173/.

### Dynamic mode with backend features (recommended for judging)

One-time setup — installs backend dependencies and builds the sandbox
execution image (`mrpl-sandbox:latest`), which the `/sandbox/run` endpoint
depends on and which nothing else in this project builds automatically:

```powershell
cd C:\path\to\prototype
.\setup.ps1
```

Then start the backend in one terminal:

```powershell
cd C:\path\to\prototype
python -m uvicorn backend.main:app --host 127.0.0.1 --port 8000
```

Start the Vite frontend in a second terminal:

```powershell
cd D:\prototype
npm install
npm run dev -- --host 127.0.0.1
```

Open http://localhost:5173/. The top-right badge reads **● LIVE BACKEND**
when the frontend can reach the API, and **○ STATIC DEMO** if it can't —
check this before promising judges a live result. Run an investigation,
run the OCR and sandbox demo buttons on Overview, then open **Runs** to
see the live local activity log. OCR/DOCX additionally requires a local
Tesseract installation (`setup.ps1` checks for this and warns if it's
missing).

### Note on the two demo modes

The **offline static demo** (`docker-compose.demo.yml`) serves only the
built frontend — it does not start the backend, so `/route`, OCR, and
sandbox all fall back to sample/static behavior. It exists as a safe
fallback if Docker or Python aren't available on the demo machine, not
as the primary way to show the working features. Use **dynamic mode**
above whenever you want to show live routing, OCR, or sandbox execution.
