import { Controller, Post, Get, Body, HttpCode, HttpStatus, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiResponse, ApiQuery } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { Public } from '../../common/decorators/public.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

@ApiTags('认证')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @Public()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: '用户登录', description: '使用用户名和密码登录获取访问令牌' })
  @ApiResponse({ status: 200, description: '登录成功，返回 accessToken 和 refreshToken' })
  @ApiResponse({ status: 401, description: '用户名或密码错误' })
  async login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  @Post('register')
  @Public()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: '用户注册', description: '新用户注册账号' })
  @ApiResponse({ status: 201, description: '注册成功' })
  @ApiResponse({ status: 400, description: '用户名已存在' })
  async register(@Body() registerDto: RegisterDto) {
    return this.authService.register(registerDto);
  }

  @Post('refresh-token')
  @Public()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: '刷新令牌', description: '使用 refreshToken 获取新的 accessToken' })
  @ApiResponse({ status: 200, description: '刷新成功' })
  @ApiResponse({ status: 401, description: '刷新令牌无效或已过期' })
  async refreshToken(@Body() dto: RefreshTokenDto) {
    return this.authService.refreshToken(dto.refreshToken);
  }

  @Post('logout')
  @ApiBearerAuth()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: '退出登录', description: '退出登录并将当前 token 加入黑名单' })
  @ApiResponse({ status: 200, description: '退出登录成功' })
  async logout(@Req() req) {
    const token = req.headers.authorization?.replace('Bearer ', '');
    if (token) await this.authService.logout(token);
    return { message: '已退出登录' };
  }

  // ========== 社交登录 ==========

  @Get('github')
  @Public()
  @UseGuards(AuthGuard('github'))
  @ApiOperation({ summary: 'GitHub 登录' })
  async githubLogin() {}

  @Get('github/callback')
  @Public()
  @UseGuards(AuthGuard('github'))
  @ApiOperation({ summary: 'GitHub 登录回调' })
  async githubCallback(@Req() req) {
    return this.authService.socialLogin(req.user);
  }

  @Get('wechat')
  @Public()
  @UseGuards(AuthGuard('wechat'))
  @ApiOperation({ summary: '微信登录' })
  async wechatLogin() {}

  @Get('wechat/callback')
  @Public()
  @UseGuards(AuthGuard('wechat'))
  @ApiOperation({ summary: '微信登录回调' })
  async wechatCallback(@Req() req) {
    return this.authService.socialLogin(req.user);
  }
}
