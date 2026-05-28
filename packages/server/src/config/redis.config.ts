import { ConfigService } from '@nestjs/config';

export const getRedisConfig = (configService: ConfigService) => ({
  host: configService.get('REDIS_HOST', '127.0.0.1'),
  port: configService.get<number>('REDIS_PORT', 6379),
  password: configService.get('REDIS_PASSWORD') || undefined,
});
