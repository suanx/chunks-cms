import { Injectable, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable, defer, firstValueFrom } from 'rxjs';
import { Reflector } from '@nestjs/core';
import { RedisService } from '../../redis/redis.service';
import { CACHE_KEY, CACHE_TTL_KEY } from '../decorators/cache.decorator';
import * as crypto from 'crypto';

@Injectable()
export class CacheInterceptor {
  private readonly defaultTtl = 300;

  constructor(private reflector: Reflector, private redisService: RedisService) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const cacheable = this.reflector.getAllAndOverride<boolean>(CACHE_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (!cacheable) return next.handle();

    const ttl = this.reflector.getAllAndOverride<number>(CACHE_TTL_KEY, [
      context.getHandler(),
      context.getClass(),
    ]) || this.defaultTtl;

    const request = context.switchToHttp().getRequest();
    const cacheKey = this.generateKey(request);

    return defer(async () => {
      try {
        const cached = await this.redisService.get(cacheKey);
        if (cached) return JSON.parse(cached);

        const result = await firstValueFrom(next.handle());
        if (result !== null && result !== undefined) {
          await this.redisService.set(cacheKey, JSON.stringify(result), ttl);
        }
        return result;
      } catch {
        return firstValueFrom(next.handle());
      }
    });
  }

  private generateKey(request: any): string {
    const { method, url, query, body } = request;
    const hash = crypto.createHash('md5')
      .update(`${method}:${url}:${JSON.stringify(query)}:${JSON.stringify(body)}`)
      .digest('hex');
    return `cache:${hash}`;
  }
}
