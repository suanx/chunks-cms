#!/bin/bash
set -e

echo "🔄 运行数据库迁移..."
cd packages/server
npx typeorm migration:run -d dist/config/data-source.js
echo "✅ 迁移完成"
