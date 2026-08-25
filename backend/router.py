"""Deterministic local model router for the MRPL workbench."""
from datetime import datetime, timezone
from pathlib import Path
from typing import Any

ACTIVITY_LOG: list[dict[str, Any]] = []
IMAGE_EXTENSIONS = {".png", ".jpg", ".jpeg"}
CODE_DATA_EXTENSIONS = {".py", ".csv", ".json", ".sql"}
CODE_MARKERS = ("```", "import ", "def ", "select ", "threshold")


def route_task(filename: str | None = None, text: str | None = None) -> tuple[str, str]:
    """Return the local model and a human-readable reason for a task."""
    name = (filename or "").strip()
    content = (text or "").lower()
    suffix = Path(name).suffix.lower()

    if suffix in IMAGE_EXTENSIONS:
        model, reason = "vision-model", f"image extension {suffix}"
    elif suffix in CODE_DATA_EXTENSIONS:
        model, reason = "code-model", f"code/data extension {suffix}"
    elif any(marker in content for marker in CODE_MARKERS):
        model, reason = "code-model", "text contains code/data markers"
    else:
        model, reason = "reasoning-model", "free-form text with no code or image signal"

    ACTIVITY_LOG.append({
        "timestamp": datetime.now(timezone.utc).isoformat(),
        "filename": filename,
        "model": model,
        "reason": reason,
    })
    return model, reason
