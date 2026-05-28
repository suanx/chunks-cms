import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { User } from '../users/entities/user.entity';
import { Role } from '../users/entities/role.entity';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { RedisService } from '../../redis/redis.service';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Role)
    private readonly roleRepository: Repository<Role>,
    private readonly jwtService: JwtService,
    private readonly redisService: RedisService,
  ) {}

  async login(loginDto: LoginDto) {
    const user = await this.validateUser(loginDto.username, loginDto.password);
    if (!user) {
      throw new UnauthorizedException('用户名或密码错误');
    }
    if (user.status === 0) {
      throw new UnauthorizedException('账号已被禁用');
    }

    // 更新最后登录时间
    await this.userRepository.update(user.id, { lastLoginAt: new Date() });

    const tokens = this.generateTokens(user);
    return {
      user: this.sanitizeUser(user),
      ...tokens,
    };
  }

  async register(registerDto: RegisterDto) {
    // 检查用户名是否已存在
    const existingUser = await this.userRepository.findOne({
      where: { username: registerDto.username },
    });
    if (existingUser) {
      throw new UnauthorizedException('用户名已存在');
    }

    // 检查邮箱是否已存在
    if (registerDto.email) {
      const existingEmail = await this.userRepository.findOne({
        where: { email: registerDto.email },
      });
      if (existingEmail) {
        throw new UnauthorizedException('邮箱已被注册');
      }
    }

    // 哈希密码（12轮 salt）
    const hashedPassword = await this.hashPassword(registerDto.password);

    // 获取默认用户角色
    const userRole = await this.roleRepository.findOne({
      where: { name: 'user' },
    });

    // 创建用户
    const user = this.userRepository.create({
      ...registerDto,
      password: hashedPassword,
      roles: userRole ? [userRole] : [],
    });

    const savedUser = await this.userRepository.save(user);
    const tokens = this.generateTokens(savedUser);

    return {
      user: this.sanitizeUser(savedUser),
      ...tokens,
    };
  }

  async validateUser(username: string, password: string): Promise<User | null> {
    const user = await this.userRepository.findOne({
      where: { username },
    });
    if (!user) return null;

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) return null;

    return user;
  }

  async refreshToken(refreshToken: string) {
    try {
      const payload = this.jwtService.verify(refreshToken, {
        secret: process.env.JWT_SECRET || 'chunyu-cms-jwt-secret',
      });

      const user = await this.userRepository.findOne({
        where: { id: payload.sub },
      });
      if (!user || user.status === 0) {
        throw new UnauthorizedException('用户不存在或已被禁用');
      }

      const tokens = this.generateTokens(user);
      return tokens;
    } catch (error) {
      throw new UnauthorizedException('刷新令牌无效或已过期');
    }
  }

  async logout(token: string): Promise<void> {
    // 解析 token 过期时间，将 token 加入 Redis 黑名单
    const payload = this.jwtService.decode(token);
    if (payload && payload.exp) {
      const ttl = payload.exp - Math.floor(Date.now() / 1000);
      if (ttl > 0) {
        await this.redisService.set(`bl:${token}`, '1', ttl);
      }
    }
  }

  async isTokenBlacklisted(token: string): Promise<boolean> {
    const result = await this.redisService.get(`bl:${token}`);
    return result === '1';
  }

  private generateTokens(user: User) {
    const payload = {
      sub: user.id,
      username: user.username,
      roles: user.roles?.map((r) => r.name) || [],
    };

    const accessToken = this.jwtService.sign(payload);
    const refreshToken = this.jwtService.sign(payload, {
      expiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '30d',
    });

    return { accessToken, refreshToken };
  }

  async hashPassword(password: string): Promise<string> {
    const salt = await bcrypt.genSalt(12);
    return bcrypt.hash(password, salt);
  }

  async socialLogin(profile: { email: string; username: string; avatar?: string; provider: string }) {
    let user = await this.userRepository.findOne({
      where: { email: profile.email },
    });

    if (!user) {
      // 获取默认用户角色
      const userRole = await this.roleRepository.findOne({
        where: { name: 'user' },
      });

      const tempPassword = await this.hashPassword(Math.random().toString(36).slice(-16));
      user = this.userRepository.create({
        username: `${profile.provider}_${profile.username}`,
        email: profile.email,
        avatar: profile.avatar || '',
        nickname: profile.username,
        password: tempPassword,
        roles: userRole ? [userRole] : [],
      });
      user = await this.userRepository.save(user);
    }

    // 更新最后登录时间
    await this.userRepository.update(user.id, { lastLoginAt: new Date() });

    const tokens = this.generateTokens(user);
    return {
      user: this.sanitizeUser(user),
      ...tokens,
    };
  }

  private sanitizeUser(user: User) {
    const { password, ...result } = user as any;
    return result;
  }
}
