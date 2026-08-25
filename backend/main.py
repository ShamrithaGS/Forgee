"""FastAPI entrypoint for the local MRPL Sovereign AI Workbench backend."""
from __future__ import annotations

import tempfile
import subprocess
from pathlib import Path

from fastapi import FastAPI, File, Form, HTTPException, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import Response
from pydantic import BaseModel

from .ocr_pipeline import ocr_and_extract, write_approval_note
from .router import ACTIVITY_LOG, route_task
from .sandbox import run_sandbox

SANDBOX_ROOT = Path(__file__).resolve().parent
TRUSTED_SANDBOX_IMAGE = "mrpl-sandbox:latest"

app = FastAPI(title="FORGEE — Sovereign AI Workbench", version="0.1.0")
app.add_middleware(CORSMiddleware, allow_origins=["http://localhost:5173", "http://127.0.0.1:5173"], allow_methods=["*"], allow_headers=["*"])


class RouteRequest(BaseModel):
    filename: str | None = None
    text: str | None = None


class SandboxRequest(BaseModel):
    script_name: str = "sample_task.py"
    data_names: list[str] = ["readings.csv"]


@app.get("/")
def root() -> dict[str, object]:
    return {
        "service": "FORGEE — Sovereign AI Workbench",
        "status": "online",
        "mode": "air-gapped",
        "endpoints": ["/health", "/route", "/activity", "/ocr/approval-note", "/sandbox/run", "/docs"],
    }


@app.get("/health")
def health() -> dict[str, str]:
    return {"status": "ok", "mode": "air-gapped"}


@app.post("/route")
def route(request: RouteRequest) -> dict[str, str]:
    model, reason = route_task(request.filename, request.text)
    return {"model": model, "reason": reason}


@app.get("/activity")
def activity() -> list[dict[str, object]]:
    return ACTIVITY_LOG[-50:]


@app.post("/ocr/approval-note")
async def approval_note(image: UploadFile = File(...), output_name: str = Form("approval-note.docx")) -> Response:
    if image.content_type not in {"image/png", "image/jpeg"}:
        raise HTTPException(status_code=415, detail="Only PNG and JPEG inspection images are supported.")
    if len(output_name) > 100 or any(character in output_name for character in '\r\n\"'):
        raise HTTPException(status_code=400, detail="Invalid output filename.")
    suffix = Path(image.filename or "report.png").suffix or ".png"
    with tempfile.TemporaryDirectory() as temporary_directory:
        temp_dir = Path(temporary_directory)
        image_path = temp_dir / f"inspection{suffix}"
        content = await image.read(10 * 1024 * 1024 + 1)
        if len(content) > 10 * 1024 * 1024:
            raise HTTPException(status_code=413, detail="Inspection image must be 10 MB or smaller.")
        image_path.write_bytes(content)
        try:
            fields = ocr_and_extract(image_path)
            output_path = temp_dir / Path(output_name).name
            write_approval_note(fields, output_path)
        except (RuntimeError, ValueError, OSError) as error:
            raise HTTPException(status_code=503, detail=str(error)) from error
        return Response(content=output_path.read_bytes(), headers={"Content-Disposition": f'attachment; filename="{output_path.name}"'}, media_type="application/vnd.openxmlformats-officedocument.wordprocessingml.document")


@app.post("/sandbox/run")
def sandbox(request: SandboxRequest) -> dict[str, object]:
    if request.script_name != "sample_task.py" or any(name != "readings.csv" for name in request.data_names):
        raise HTTPException(status_code=400, detail="Only the approved local demo task and readings file are allowed.")
    try:
        script_path = SANDBOX_ROOT / request.script_name
        data_paths = [SANDBOX_ROOT / name for name in request.data_names]
        return run_sandbox(script_path, data_paths, TRUSTED_SANDBOX_IMAGE)
    except (FileNotFoundError, subprocess.TimeoutExpired, OSError, RuntimeError) as error:
        raise HTTPException(status_code=400, detail=str(error)) from error
