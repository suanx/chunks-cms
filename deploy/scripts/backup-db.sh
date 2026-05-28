#!/bin/bash
set -e

BACKUP_DIR="./backups"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
BACKUP_FILE="${BACKUP_DIR}/chunyu_cms_${TIMESTAMP}.sql.gz"

mkdir -p "$BACKUP_DIR"

echo "📦 备份数据库..."
docker exec chunyu-mysql mysqldump -u root -proot chunyu_cms | gzip > "$BACKUP_FILE"

echo "✅ 备份完成: $BACKUP_FILE"

# 保留最近 30 天的备份
find "$BACKUP_DIR" -name "*.sql.gz" -mtime +30 -delete
echo "🧹 已清理 30 天前的备份"
