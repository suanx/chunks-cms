import { Injectable, CanActivate, ExecutionContext, HttpException, HttpStatus } from '@nestjs/common';

const requestCounts = new Map<string, { count: number; resetTime: number }>();

@Injectable()
export class ThrottleGuard implements CanActivate {
  private readonly limit = 60;
  private readonly windowMs = 60 * 1000;

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const ip = request.ip || request.connection.remoteAddress;
    const now = Date.now();
    const record = requestCounts.get(ip);

    if (!record || now > record.resetTime) {
      requestCounts.set(ip, { count: 1, resetTime: now + this.windowMs });
      return true;
    }

    record.count++;
    if (record.count > this.limit) {
      throw new HttpException('请求过于频繁，请稍后再试', HttpStatus.TOO_MANY_REQUESTS);
    }
    return true;
  }
}
