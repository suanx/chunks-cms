import { Injectable, CanActivate, ExecutionContext, HttpException, HttpStatus, SetMetadata } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { RedisService } from '../../redis/redis.service';

interface RateLimitConfig {
  windowMs: number;
  max: number;
  keyPrefix: string;
}

const RATE_LIMIT_CONFIGS: Record<string, RateLimitConfig> = {
  login: { windowMs: 60 * 1000, max: 5, keyPrefix: 'rl:login:' },
  register: { windowMs: 60 * 1000, max: 3, keyPrefix: 'rl:register:' },
  api: { windowMs: 60 * 1000, max: 60, keyPrefix: 'rl:api:' },
  upload: { windowMs: 60 * 1000, max: 10, keyPrefix: 'rl:upload:' },
  comment: { windowMs: 60 * 1000, max: 10, keyPrefix: 'rl:comment:' },
};

@Injectable()
export class RateLimitGuard implements CanActivate {
  constructor(
    private redisService: RedisService,
    private reflector: Reflector,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const handler = context.getHandler();
    const controllerClass = context.getClass();

    // 优先使用 @SetMetadata 传入的自定义配置
    const metaLimit = this.reflector.get<number>('limit', handler);
    const metaWindowMs = this.reflector.get<number>('windowMs', handler);
    const metaKeyPrefix = this.reflector.get<string>('rateLimitKeyPrefix', handler);

    let config: RateLimitConfig;

    if (metaLimit && metaWindowMs) {
      // 有 metadata → 使用自定义配置
      config = {
        max: metaLimit,
        windowMs: metaWindowMs,
        keyPrefix: metaKeyPrefix || `rl:custom:${handler.name}:`,
      };
    } else {
      // 回退到 URL 匹配
      config = RATE_LIMIT_CONFIGS.api; // 默认
      if (request.url.includes('/login')) config = RATE_LIMIT_CONFIGS.login;
      else if (request.url.includes('/register')) config = RATE_LIMIT_CONFIGS.register;
      else if (request.url.includes('/upload')) config = RATE_LIMIT_CONFIGS.upload;
      else if (request.url.includes('/comments')) config = RATE_LIMIT_CONFIGS.comment;
    }

    const ip = request.ip || request.connection?.remoteAddress || 'unknown';
    const userId = request.user?.id;
    const key = userId
      ? `${config.keyPrefix}${userId}`
      : `${config.keyPrefix}${ip}`;

    const current = await this.redisService.incr(key);
    if (current === 1) {
      await this.redisService.expire(key, Math.ceil(config.windowMs / 1000));
    }

    if (current > config.max) {
      throw new HttpException(
        { message: `请求过于频繁，请 ${config.windowMs / 1000} 秒后再试`, code: 429 },
        HttpStatus.TOO_MANY_REQUESTS,
      );
    }

    // 设置响应头
    const response = context.switchToHttp().getResponse();
    response.setHeader('X-RateLimit-Limit', config.max);
    response.setHeader('X-RateLimit-Remaining', Math.max(0, config.max - current));

    return true;
  }
}
