import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { AuthService } from '../auth.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly authService: AuthService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET || 'chunyu-cms-jwt-secret',
    });
  }

  async validate(payload: any, token?: string) {
    // 检查 token 是否在黑名单中
    if (token) {
      const isBlacklisted = await this.authService.isTokenBlacklisted(token);
      if (isBlacklisted) throw new UnauthorizedException('Token 已失效');
    }

    const user = await this.userRepository.findOne({
      where: { id: payload.sub },
    });

    if (!user) {
      throw new UnauthorizedException('用户不存在');
    }

    if (user.status === 0) {
      throw new UnauthorizedException('账号已被禁用');
    }

    return {
      id: user.id,
      username: user.username,
      roles: payload.roles || user.roles?.map((r) => r.name) || [],
    };
  }
}
