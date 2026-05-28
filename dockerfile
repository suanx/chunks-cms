###############################################################################
# Stage 1 — Build Backend (NestJS)
###############################################################################
FROM node:20-alpine AS builder-backend

WORKDIR /build/backend

# 安装 pnpm
RUN corepack enable && corepack prepare pnpm@latest --activate

# 先拷贝依赖声明，利用 Docker 层缓存
COPY backend/package.json backend/pnpm-lock.yaml* ./
RUN pnpm install --frozen-lockfile || pnpm install

# 拷贝源码并构建
COPY backend/ .
RUN pnpm build

###############################################################################
# Stage 2 — Build Frontend Web (Nuxt 3)
###############################################################################
FROM node:20-alpine AS builder-web

WORKDIR /build/frontend-web

RUN corepack enable && corepack prepare pnpm@latest --activate

COPY frontend-web/package.json frontend-web/pnpm-lock.yaml* ./
RUN pnpm install --frozen-lockfile || pnpm install

COPY frontend-web/ .
RUN pnpm build

###############################################################################
# Stage 3 — Build Frontend Admin (Vue 3 + Vite)
###############################################################################
FROM node:20-alpine AS builder-admin

WORKDIR /build/frontend-admin

RUN corepack enable && corepack prepare pnpm@latest --activate

COPY frontend-admin/package.json frontend-admin/pnpm-lock.yaml* ./
RUN pnpm install --frozen-lockfile || pnpm install

COPY frontend-admin/ .
RUN pnpm build

###############################################################################
# Stage 4 — Production Runtime (all-in-one)
###############################################################################
FROM node:20-alpine AS runner

LABEL maintainer="chunyu-cms"
LABEL description="ChunYu CMS All-in-One (Nginx + Node + PM2 + FFmpeg)"

# ---- 系统依赖：nginx + ffmpeg + bash + curl ----
RUN apk add --no-cache \
    nginx \
    ffmpeg \
    bash \
    curl \
    tini

# ---- 全局 PM2 ----
RUN npm install -g pm2

# ---- 创建目录结构 ----
RUN mkdir -p /app/backend \
             /app/uploads \
             /usr/share/nginx/html/web \
             /usr/share/nginx/html/admin \
             /var/cache/nginx \
             /var/log/nginx \
             /etc/nginx/conf.d \
             /run/nginx

# ---- 复制 Backend 产物 ----
COPY --from=builder-backend /build/backend/dist           /app/backend/dist
COPY --from=builder-backend /build/backend/node_modules   /app/backend/node_modules
COPY --from=builder-backend /build/backend/package.json   /app/backend/package.json

# ---- 复制 Frontend Web 产物 (Nuxt .output/public) ----
COPY --from=builder-web /build/frontend-web/.output/public /usr/share/nginx/html/web

# ---- 复制 Frontend Admin 产物 (Vite dist) ----
COPY --from=builder-admin /build/frontend-admin/dist       /usr/share/nginx/html/admin

# ---- 复制配置文件 ----
COPY nginx.conf /etc/nginx/nginx.conf
COPY start.sh   /app/start.sh
RUN chmod +x /app/start.sh

# ---- 后端环境变量 ----
ENV NODE_ENV=production
ENV PORT=3000
ENV DB_HOST=host.docker.internal
ENV DB_PORT=3306
ENV DB_USERNAME=root
ENV DB_PASSWORD=root
ENV DB_DATABASE=chunyu_cms
ENV REDIS_HOST=host.docker.internal
ENV REDIS_PORT=6379
ENV JWT_SECRET=change-me-in-production
ENV JWT_EXPIRES_IN=7d
ENV JWT_REFRESH_EXPIRES_IN=30d

WORKDIR /app

EXPOSE 80

# 使用 tini 作为 PID 1，正确处理信号
ENTRYPOINT ["/sbin/tini", "--"]
CMD ["/app/start.sh"]
