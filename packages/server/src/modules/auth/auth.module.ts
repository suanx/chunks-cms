import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtStrategy } from './strategies/jwt.strategy';
import { LocalStrategy } from './strategies/local.strategy';
import { User } from '../users/entities/user.entity';
import { Role } from '../users/entities/role.entity';
import { ConfigService } from '@nestjs/config';
import { RedisModule } from '../../redis/redis.module';

// 条件导入社交登录策略
const socialStrategies: any[] = [];
if (process.env.GITHUB_CLIENT_ID) {
  try {
    const { GithubStrategy } = require('./strategies/github.strategy');
    socialStrategies.push(GithubStrategy);
  } catch (e) {
    console.warn('[Auth] 加载 GithubStrategy 失败 (passport-github2 未安装):', e.message);
  }
}
if (process.env.WECHAT_APP_ID) {
  try {
    const { WechatStrategy } = require('./strategies/wechat.strategy');
    socialStrategies.push(WechatStrategy);
  } catch (e) {
    console.warn('[Auth] 加载 WechatStrategy 失败 (passport-wechat 未安装):', e.message);
  }
}

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Role]),
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.registerAsync({
      imports: [],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get('JWT_SECRET', 'chunyu-cms-jwt-secret'),
        signOptions: {
          expiresIn: configService.get('JWT_EXPIRES_IN', '7d'),
        },
      }),
    }),
    RedisModule,
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy, LocalStrategy, ...socialStrategies],
  exports: [AuthService, JwtModule],
})
export class AuthModule {}
