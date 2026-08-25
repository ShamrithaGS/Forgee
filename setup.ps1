# One-time setup for the Windows demo laptop. Run once, and again after
# any change to backend/Dockerfile or requirements.txt.

Write-Host "== Installing backend Python dependencies =="
pip install -r backend\requirements.txt

Write-Host "== Building the sandbox image (mrpl-sandbox:latest) =="
docker build -t mrpl-sandbox:latest backend/

Write-Host "== Verifying =="
docker image inspect mrpl-sandbox:latest | Out-Null
Write-Host "sandbox image OK"
python -c "import pytesseract, docx"
Write-Host "OCR deps OK"
where.exe tesseract 2>$null
if ($LASTEXITCODE -eq 0) { Write-Host "tesseract binary OK" } else { Write-Host "WARNING: tesseract not on PATH" }

Write-Host ""
Write-Host "Setup complete. To run the live demo:"
Write-Host "  Terminal 1: python -m uvicorn backend.main:app --host 127.0.0.1 --port 8000"
Write-Host "  Terminal 2: npm install; npm run dev -- --host 127.0.0.1"
Write-Host "  Open: http://localhost:5173/"
