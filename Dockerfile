# RetinaScope FastAPI backend — CPU inference on Railway
FROM python:3.11-slim

ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    PIP_NO_CACHE_DIR=1

WORKDIR /app

# libgomp1 supports native numerical/vision packages.
RUN apt-get update \
    && apt-get install -y --no-install-recommends libgomp1 libgl1 \
    && rm -rf /var/lib/apt/lists/*

# Install CPU-only PyTorch to avoid huge CUDA dependencies.
COPY requirements-backend.txt ./
RUN python -m pip install --upgrade pip \
    && python -m pip install --index-url https://download.pytorch.org/whl/cpu \
        torch==2.6.0 torchvision==0.21.0 \
    && python -m pip install -r requirements-backend.txt

COPY backend/ ./backend/
COPY models/efficientnet_b0_best.pth ./models/efficientnet_b0_best.pth

EXPOSE 8000
CMD ["sh", "-c", "exec uvicorn backend.main:app --host 0.0.0.0 --port ${PORT:-8000} --workers 1"]
