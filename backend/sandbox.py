"""Docker sandbox runner with defense-in-depth execution flags."""
from __future__ import annotations

import shutil
import subprocess
from pathlib import Path


def build_docker_command(script_path: str | Path, data_paths: list[str | Path] | None = None, image: str = "mrpl-sandbox:latest") -> list[str]:
    """Build a non-root, networkless, resource-limited Docker command."""
    script = Path(script_path).resolve()
    if not script.is_file():
        raise FileNotFoundError(script)
    command = [
        "docker", "run", "--rm", "--network=none", "--cap-drop=ALL",
        "--security-opt=no-new-privileges", "--read-only",
        "--tmpfs", "/tmp:rw,noexec,nosuid,size=16m", "--memory=128m",
        "--cpus=0.5", "--pids-limit=64", "--user", "10001:10001",
        "--volume", f"{script}:/work/task.py:ro",
    ]
    for data_path in data_paths or []:
        data = Path(data_path).resolve()
        if not data.is_file():
            raise FileNotFoundError(data)
        command.extend(["--volume", f"{data}:/work/{data.name}:ro"])
    command.extend([image, "timeout", "15", "python", "/work/task.py"])
    return command


def run_sandbox(script_path: str | Path, data_paths: list[str | Path] | None = None, image: str = "mrpl-sandbox:latest") -> dict[str, object]:
    """Run a task in Docker and return stdout, stderr, and exit code."""
    if shutil.which("docker") is None:
        return {"status": "unavailable", "stdout": "", "stderr": "Docker is not installed or not on PATH.", "exit_code": None}
    command = build_docker_command(script_path, data_paths, image)
    try:
        completed = subprocess.run(command, capture_output=True, text=True, timeout=20, check=False)
    except subprocess.TimeoutExpired as error:
        return {"status": "timeout", "stdout": error.stdout or "", "stderr": "Sandbox exceeded the 20 second host limit.", "exit_code": None}
    except OSError as error:
        return {"status": "unavailable", "stdout": "", "stderr": str(error), "exit_code": None}
    return {"status": "completed" if completed.returncode == 0 else "failed", "stdout": completed.stdout, "stderr": completed.stderr, "exit_code": completed.returncode}
