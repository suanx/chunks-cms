# 淳渔 CMS

影视内容管理系统，基于 Nuxt 3 + NestJS + MySQL + Redis 构建。

## 技术栈

| 层级 | 技术 |
|------|------|
| 用户端 | Nuxt 3, Vue 3, Element Plus, SCSS |
| 管理端 | Vue 3, Vite, Element Plus, Pinia |
| 后端 | NestJS, TypeORM, JWT, FFmpeg |
| 数据库 | MySQL 8, Redis 7 |
| 部署 | Docker (Nginx + PM2 + FFmpeg 单镜像) |
| 架构 | Monorepo (pnpm workspace) |

## 快速开始

### 环境要求

- Node.js >= 18
- pnpm >= 9
- Docker (可选，用于 MySQL/Redis)

### 安装

```bash
# 启动数据库
docker-compose up -d

# 安装依赖
pnpm install

# 复制环境变量
cp .env.example packages/server/.env

# 启动开发服务器
pnpm dev
```

### 服务地址

| 服务 | 地址 |
|------|------|
| 后端 API | http://localhost:3001 |
| 用户端 | http://localhost:3000 |
| 管理端 | http://localhost:3002 |

## 项目结构

```
chunyu-cms/
├── packages/
│   ├── shared/       # 共享类型/常量/工具
│   ├── server/       # NestJS 后端
│   ├── web/          # Nuxt 3 用户端
│   └── admin/        # Vue 3 管理端
├── deploy/           # 部署配置
│   ├── docker/
│   ├── nginx/
│   ├── pm2/
│   └── scripts/
├── docs/             # 项目文档
├── dockerfile        # 多阶段构建 Dockerfile
├── nginx.conf        # Nginx 路由配置
├── start.sh          # 容器启动脚本
└── docker-compose.yml
```

---

## Docker 部署

本项目采用 **All-in-One 单镜像** 方案：后端、用户端、管理端合并打包为一个 Docker 镜像，通过 Nginx 统一对外服务。

### 架构概览

```
客户端 ──→ Nginx (:80)
               │
               ├── /api/*  ──→ 反向代理 → PM2 + Nest.js (:3000)
               ├── /admin/* ──→ 管理端静态文件 (Vue 3 SPA)
               └── /*       ──→ 用户端静态文件 (Nuxt 3 SSR/SSG)
```

### 构建镜像

```bash
# 构建 All-in-One 镜像
docker build -t chunyu-cms:latest .

# 查看镜像大小
docker images chunyu-cms
```

### 运行容器

```bash
docker run -d \
  --name chunyu-cms \
  -p 80:80 \
  -e DB_HOST=host.docker.internal \
  -e DB_PORT=3306 \
  -e DB_USERNAME=root \
  -e DB_PASSWORD=your_password \
  -e DB_DATABASE=chunyu_cms \
  -e REDIS_HOST=host.docker.internal \
  -e REDIS_PORT=6379 \
  -e JWT_SECRET=your_jwt_secret \
  -v uploads:/app/uploads \
  chunyu-cms:latest
```

访问地址：
- 用户端：`http://your-server/`
- 管理端：`http://your-server/admin/`
- API：`http://your-server/api/`

### 环境变量

| 变量 | 必填 | 默认值 | 说明 |
|------|------|--------|------|
| `DB_HOST` | 是 | `host.docker.internal` | MySQL 主机 |
| `DB_PORT` | 否 | `3306` | MySQL 端口 |
| `DB_USERNAME` | 是 | `root` | MySQL 用户名 |
| `DB_PASSWORD` | 是 | `root` | MySQL 密码 |
| `DB_DATABASE` | 是 | `chunyu_cms` | 数据库名 |
| `REDIS_HOST` | 否 | `host.docker.internal` | Redis 主机（不设置则 Redis 功能受限） |
| `REDIS_PORT` | 否 | `6379` | Redis 端口 |
| `JWT_SECRET` | 是 | `change-me-in-production` | JWT 签名密钥 |
| `JWT_EXPIRES_IN` | 否 | `7d` | Access Token 有效期 |
| `JWT_REFRESH_EXPIRES_IN` | 否 | `30d` | Refresh Token 有效期 |
| `PORT` | 否 | `3000` | 后端监听端口（容器内部） |

### 数据库初始化

```bash
# 启动数据库
docker-compose up -d mysql redis

# 运行迁移
pnpm db:migrate

# 填充种子数据
pnpm db:seed
```

### Docker Compose（生产环境）

创建 `docker-compose.prod.yml`：

```yaml
version: '3.8'

services:
  app:
    build:
      context: .
      dockerfile: dockerfile
    container_name: chunyu-cms
    restart: unless-stopped
    ports:
      - '80:80'
    environment:
      DB_HOST: mysql
      DB_PORT: 3306
      DB_USERNAME: root
      DB_PASSWORD: ${MYSQL_ROOT_PASSWORD:-changeme}
      DB_DATABASE: chunyu_cms
      REDIS_HOST: redis
      REDIS_PORT: 6379
      JWT_SECRET: ${JWT_SECRET:-changeme}
    volumes:
      - uploads:/app/uploads
    depends_on:
      mysql:
        condition: service_healthy
      redis:
        condition: service_healthy

  mysql:
    image: mysql:8.0
    restart: unless-stopped
    environment:
      MYSQL_ROOT_PASSWORD: ${MYSQL_ROOT_PASSWORD:-changeme}
      MYSQL_DATABASE: chunyu_cms
      MYSQL_CHARSET: utf8mb4
      TZ: Asia/Shanghai
    volumes:
      - mysql_data:/var/lib/libmysql
    command: --default-authentication-plugin=mysql_native_password --character-set-server=utf8mb4 --collation-server=utf8mb4_unicode_ci
    healthcheck:
      test: ["CMD", "mysqladmin", "ping", "-h", "localhost"]
      interval: 10s
      timeout: 5s
      retries: 5

  redis:
    image: redis:7-alpine
    restart: unless-stopped
    volumes:
      - redis_data:/data
    command: redis-server --appendonly yes
    healthcheck:
      test: ["CMD", "redis-cli", "ping"]
      interval: 10s
      timeout: 5s
      retries: 5

volumes:
  uploads:
  mysql_data:
  redis_data:
```

启动：

```bash
# 设置密码
export MYSQL_ROOT_PASSWORD=your_secure_password
export JWT_SECRET=your_jwt_secret

# 启动所有服务
docker compose -f docker-compose.prod.yml up -d

# 查看日志
docker compose -f docker-compose.prod.yml logs -f app
```

### Nginx 路由规则

| 路径 | 目标 | 说明 |
|------|------|------|
| `/api/*` | `proxy_pass http://localhost:3000` | 反向代理到 Nest.js 后端 |
| `/admin/*` | `/usr/share/nginx/html/admin` | 管理端静态文件，支持 history 路由 |
| `/*` | `/usr/share/nginx/html/web` | 用户端静态文件，Nuxt 预渲染 |

关键配置：
- **SPA 路由回退**：管理端和用户端均配置 `try_files` 回退到 `index.html`
- **WebSocket 支持**：`/api/` 路径已配置 `Upgrade` 和 `Connection` 头转发
- **Gzip 压缩**：启用静态资源和 API 响应压缩
- **静态资源缓存**：`_nuxt/` 目录设置 30 天 immutable 缓存
- **上传限制**：`client_max_body_size 100m`

### 容器内部结构

```
/app/
├── backend/
│   ├── dist/           # Nest.js 编译产物
│   ├── node_modules/   # 后端依赖
│   ├── package.json
│   └── logs/           # PM2 日志
├── uploads/            # 上传文件挂载点

/usr/share/nginx/html/
├── web/                # Nuxt 3 静态产物 (.output/public)
│   ├── _nuxt/
│   └── index.html
└── admin/              # Vue 3 静态产物 (dist/)
    ├── assets/
    └── index.html

/etc/nginx/
└── nginx.conf          # Nginx 配置
```

### 启动流程

```
容器启动 (tini 作为 PID 1)
  │
  ├─ 1. 环境变量校验
  ├─ 2. 创建必要目录
  ├─ 3. 启动后端 (PM2, port 3000)
  │     └─ 等待健康检查 (最多 30s)
  └─ 4. 启动 Nginx (port 80, 前台运行)
        └─ 容器保持存活
```

---

## GitHub Actions CI/CD

### 工作流说明

| 工作流 | 触发条件 | 功能 |
|--------|----------|------|
| `ci.yml` | push/PR → main/develop | Lint + 测试 + 构建验证 |
| `docker-build-single.yml` | push → main / tag v* | 构建 All-in-One 镜像并推送 GHCR |

### 镜像标签策略

| 触发方式 | 生成标签 |
|----------|----------|
| push to main | `:main`, `:latest`, `:sha-abc1234` |
| push tag v1.2.3 | `:v1.2.3`, `:1.2.3`, `:1.2`, `:sha-abc1234` |
| push tag v1.0.0 | `:v1.0.0`, `:1.0.0`, `:1.0`, `:latest`, `:sha-abc1234` |

### 配置 CR_PAT

GitHub Actions 需要 PAT（Personal Access Token）推送镜像到 GHCR：

1. 访问 GitHub → Settings → Developer settings → Personal access tokens → Fine-grained tokens
2. 创建 Token：
   - **Name**: `cr-pat`
   - **Repository access**: 选择本仓库
   - **Permissions → Packages**: `Read and Write`
3. 在仓库 Settings → Secrets and variables → Actions 中添加：
   - **Name**: `CR_PAT`
   - **Value**: 刚创建的 Token

### 拉取镜像

```bash
# 登录 GHCR
echo $CR_PAT | docker login ghcr.io -u <your-username> --password-stdin

# 拉取镜像
docker pull ghcr.io/<owner>/chunyu-cms-allinone:latest
```

---

## 新增功能

### v2.0 - 优化版

#### 安全 & 性能
- ✅ Redis 缓存层 (接口缓存 + 播放次数缓存)
- ✅ JWT 黑名单 (退出即时失效)
- ✅ 分级限流 (登录 5次/分, API 60次/分)
- ✅ 密码强度策略 (8位+大小写+数字, bcrypt 12 rounds)
- ✅ XSS 防护 (评论内容过滤)
- ✅ API 响应压缩 (gzip)
- ✅ 操作审计日志
- ✅ 数据库索引优化

#### 新功能
- ✅ 观看历史 + 续播 (自动保存播放进度)
- ✅ 收藏夹分组 (多文件夹管理收藏)
- ✅ 弹幕系统 (实时弹幕发送/展示)
- ✅ 消息通知中心 (系统通知/评论回复)
- ✅ 社交登录 (GitHub/微信 OAuth 占位)
- ✅ 批量操作 (批量删除/发布/下架)
- ✅ 数据导出 (Excel/CSV)
- ✅ 定时发布
- ✅ 内容审核流 (多级审核)
- ✅ AI 标签建议
- ✅ 推荐系统基础

#### 用户端优化
- ✅ 深色模式 (跟随系统/手动切换)
- ✅ 国际化 i18n (中/英)
- ✅ 分享卡片 (微信/QQ/微博/复制链接)
- ✅ SEO 优化 (Sitemap/OG标签/canonical)
- ✅ 视频懒加载
- ✅ 弹幕播放器增强

#### 管理端优化
- ✅ ECharts 数据可视化 (趋势图/饼图)
- ✅ 审核流管理界面
- ✅ 审计日志查看器
- ✅ AI 标签 UI
- ✅ 系统设置面板

#### 开发体验
- ✅ Jest 单元测试
- ✅ Playwright E2E 测试
- ✅ GitHub Actions CI/CD
- ✅ ESLint + Prettier
- ✅ Sentry 错误监控
- ✅ 模块代码生成器
- ✅ Swagger API 文档完善

#### 部署优化
- ✅ All-in-One 单镜像 (Nginx + Node.js + PM2 + FFmpeg)
- ✅ 多阶段 Docker 构建 (体积最小化)
- ✅ tini PID 1 (正确信号处理)
- ✅ PM2 进程管理 (自动重启 + 内存限制)
- ✅ GHCR 自动构建推送
- ✅ BuildKit + GHA 缓存 (构建加速)

## 代码生成器

```bash
# 快速生成新模块 (Entity + DTO + Service + Controller + Module)
bash scripts/generate-module.sh playlist
```

## 常用运维命令

```bash
# 查看容器日志
docker logs -f chunyu-cms

# 进入容器调试
docker exec -it chunyu-cms bash

# 查看 PM2 状态（容器内）
docker exec chunyu-cms pm2 list

# 查看 PM2 日志（容器内）
docker exec chunyu-cms pm2 logs backend --lines 50

# 重启后端（容器内，不重启容器）
docker exec chunyu-cms pm2 restart backend

# 重载 Nginx（容器内，不重启容器）
docker exec chunyu-cms nginx -s reload
```

## License

MIT
