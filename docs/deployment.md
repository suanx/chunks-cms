# 淳渔 CMS 部署指南

## 环境要求

- Docker >= 20.10
- Docker Compose >= 2.0
- Node.js >= 18 (本地开发)
- pnpm >= 9

## 开发环境

```bash
# 1. 启动数据库
docker-compose up -d

# 2. 安装依赖
pnpm install

# 3. 启动所有服务
pnpm dev
```

## 生产部署

### Docker 部署

```bash
# 构建并启动
bash deploy/scripts/deploy.sh
```

### PM2 部署

```bash
# 构建
pnpm build

# 启动
cd deploy/pm2
pm2 start ecosystem.config.js
```

## 数据库备份

```bash
bash deploy/scripts/backup-db.sh
```

## 环境变量

复制 `.env.example` 到 `packages/server/.env` 并修改配置。

## Nginx 配置

生产环境使用 `deploy/nginx/default.conf` 作为 Nginx 虚拟主机配置。
