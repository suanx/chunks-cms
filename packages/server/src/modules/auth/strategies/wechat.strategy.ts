import { Strategy } from 'passport-wechat';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';

@Injectable()
export class WechatStrategy extends PassportStrategy(Strategy, 'wechat') {
  constructor() {
    super({
      appID: process.env.WECHAT_APP_ID || '',
      appSecret: process.env.WECHAT_APP_SECRET || '',
      callbackURL: process.env.WECHAT_CALLBACK_URL || '/api/auth/wechat/callback',
      scope: ['snsapi_userinfo'],
      state: true,
    });
  }

  async validate(accessToken: string, refreshToken: string, profile: any) {
    return {
      openid: profile.openid,
      nickname: profile.nickname,
      avatar: profile.headimgurl,
      provider: 'wechat',
    };
  }
}
