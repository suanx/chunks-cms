#!/bin/bash
set -e

# ================================================
#  ChunYu CMS — All-in-One 容器启动脚本
#  启动顺序: 检查环境 → 启动后端(PM2) → 启动前端(Nginx)
# ================================================

echo "=========================================="
echo " 🐟 ChunYu CMS — Starting All-in-One"
echo " $(date '+%Y-%m-%d %H:%M:%S')"
echo "=========================================="

# ---- 1. 环境变量校验 ----
echo "[1/4] Checking environment..."

required_vars="DB_HOST DB_PORT DB_USERNAME DB_PASSWORD DB_DATABASE"
for var in $required_vars; do
    eval val=\$$var
    if [ -z "$val" ]; then
        echo "  ⚠️  Warning: $var is not set, using default."
    fi
done

# Redis 可选
if [ -z "$REDIS_HOST" ]; then
    echo "  ℹ️  REDIS_HOST not set, Redis features may be limited."
fi

# ---- 2. 创建必要目录 ----
echo "[2/4] Preparing directories..."
mkdir -p /app/uploads
mkdir -p /var/log/nginx
mkdir -p /run/nginx
mkdir -p /app/backend/logs

# ---- 3. 启动后端 (PM2) ----
echo "[3/4] Starting Backend (PM2, port ${PORT:-3000})..."

cd /app/backend

# 检查 dist 是否存在
if [ ! -d "dist" ]; then
    echo "  ❌ Backend dist/ not found!"
    exit 1
fi

# 启动 NestJS 后端
pm2 start dist/main.js \
    --name "chunyu-backend" \
    --max-memory-restart 500M \
    --exp-backoff-restart-delay=1000 \
    --time \
    --no-daemon \
    --log /app/backend/logs/pm2.log \
    2>&1 &

# 等待后端启动（最多 30 秒）
echo "  ⏳ Waiting for backend to be ready..."
backend_ready=false
for i in $(seq 1 30); do
    if curl -sf http://127.0.0.1:${PORT:-3000}/api/health > /dev/null 2>&1; then
        backend_ready=true
        echo "  ✅ Backend is ready (took ${i}s)"
        break
    fi
    sleep 1
done

if [ "$backend_ready" = false ]; then
    echo "  ⚠️  Backend health check timed out, starting Nginx anyway..."
fi

# ---- 4. 启动 Nginx (前台) ----
echo "[4/4] Starting Nginx (port 80)..."

echo "=========================================="
echo " 🐟 ChunYu CMS is running!"
echo "    User site:  http://localhost/"
echo "    Admin site: http://localhost/admin/"
echo "    API:        http://localhost/api/"
echo "=========================================="

# 前台运行 Nginx（使容器保持存活）
# -g 'daemon off;' 让 Nginx 在前台运行
exec nginx -g 'daemon off;'
