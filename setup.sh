#!/usr/bin/env bash
# One-time setup. Run this once before your first live demo, and again
# any time backend/Dockerfile or requirements.txt change.
set -e

echo "== Installing backend Python dependencies =="
pip install -r backend/requirements.txt

echo "== Building the sandbox image (mrpl-sandbox:latest) =="
docker build -t mrpl-sandbox:latest backend/

echo "== Verifying =="
docker image inspect mrpl-sandbox:latest > /dev/null && echo "sandbox image OK"
python -c "import pytesseract, docx" && echo "OCR deps OK"
command -v tesseract > /dev/null && echo "tesseract binary OK" || echo "WARNING: tesseract not on PATH — install it (e.g. apt install tesseract-ocr)"

echo ""
echo "Setup complete. To run the live demo:"
echo "  Terminal 1: python -m uvicorn backend.main:app --host 127.0.0.1 --port 8000"
echo "  Terminal 2: npm install && npm run dev -- --host 127.0.0.1"
echo "  Open: http://localhost:5173/"
