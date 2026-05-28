#!/bin/bash
set -e

echo "🚀 开始部署淳渔 CMS..."

# 构建并启动服务
docker-compose -f docker-compose.prod.yml down
docker-compose -f docker-compose.prod.yml build --no-cache
docker-compose -f docker-compose.prod.yml up -d

echo "✅ 部署完成!"
echo "🌐 用户端: http://localhost"
echo "🔧 管理端: http://localhost/admin"
echo "📡 API: http://localhost/api"
