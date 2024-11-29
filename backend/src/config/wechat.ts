import { redis } from './redis.js';
import { logger } from '../utils/logger.js';
import axios from 'axios';
import crypto from 'crypto';

class WeChatMPService {
  readonly config: {
    appId: string;
    appSecret: string;
    token: string;
    encodingAESKey: string;
  };
  readonly API_BASE = 'https://api.weixin.qq.com';
  private isConfigured: boolean = false;

  constructor() {
    this.config = {
      appId: process.env.WECHAT_MP_APP_ID || '',
      appSecret: process.env.WECHAT_MP_APP_SECRET || '',
      token: process.env.WECHAT_MP_TOKEN || '',
      encodingAESKey: process.env.WECHAT_MP_ENCODING_AES_KEY || ''
    };

    this.initializeService();
  }

  private initializeService() {
    if (this.config.appId && this.config.appSecret) {
      this.isConfigured = true;
      logger.info('WeChat MP service initialized successfully');
    } else {
      logger.warn('WeChat MP credentials not configured - WeChat MP login will be disabled');
    }
  }

  async getUserInfo(accessToken: string, openid: string) {
    if (!this.isConfigured) {
      throw new Error('WeChat MP service is not configured');
    }

    const response = await axios.get(
      `${this.API_BASE}/cgi-bin/user/info`,
      {
        params: {
          access_token: accessToken,
          openid,
          lang: 'zh_CN'
        }
      }
    );

    if (response.data.errcode) {
      throw new Error(response.data.errmsg);
    }

    return response.data;
  }
}

class WeChatMiniProgramService {
  readonly config: {
    appId: string;
    appSecret: string;
  };
  readonly API_BASE = 'https://api.weixin.qq.com';
  private isConfigured: boolean = false;

  constructor() {
    this.config = {
      appId: process.env.WECHAT_MINI_APP_ID || '',
      appSecret: process.env.WECHAT_MINI_APP_SECRET || ''
    };

    this.initializeService();
  }

  private initializeService() {
    if (this.config.appId && this.config.appSecret) {
      this.isConfigured = true;
      logger.info('WeChat Mini Program service initialized successfully');
    } else {
      logger.warn('WeChat Mini Program credentials not configured - Mini Program login will be disabled');
    }
  }

  async code2Session(code: string) {
    if (!this.isConfigured) {
      throw new Error('WeChat Mini Program service is not configured');
    }

    const response = await axios.get(
      `${this.API_BASE}/sns/jscode2session`,
      {
        params: {
          appid: this.config.appId,
          secret: this.config.appSecret,
          js_code: code,
          grant_type: 'authorization_code'
        }
      }
    );

    if (response.data.errcode) {
      throw new Error(response.data.errmsg);
    }

    return response.data;
  }

  decryptData(encryptedData: string, iv: string, sessionKey: string) {
    try {
      const decipher = crypto.createDecipheriv(
        'aes-128-cbc',
        Buffer.from(sessionKey, 'base64'),
        Buffer.from(iv, 'base64')
      );
      
      let decrypted = decipher.update(encryptedData, 'base64', 'utf8');
      decrypted += decipher.final('utf8');
      
      return JSON.parse(decrypted);
    } catch (error) {
      logger.error('Failed to decrypt data:', error);
      throw new Error('Failed to decrypt user data');
    }
  }
}

class WeChatOpenPlatformService {
  readonly config: {
    appId: string;
    appSecret: string;
  };
  readonly API_BASE = 'https://api.weixin.qq.com';
  private isConfigured: boolean = false;

  constructor() {
    this.config = {
      appId: process.env.WECHAT_OPEN_APP_ID || '',
      appSecret: process.env.WECHAT_OPEN_APP_SECRET || ''
    };

    this.initializeService();
  }

  private initializeService() {
    if (this.config.appId && this.config.appSecret) {
      this.isConfigured = true;
      logger.info('WeChat Open Platform service initialized successfully');
    } else {
      logger.warn('WeChat Open Platform credentials not configured - Open Platform login will be disabled');
    }
  }

  async getAccessToken(code: string) {
    if (!this.isConfigured) {
      throw new Error('WeChat Open Platform service is not configured');
    }

    const response = await axios.get(
      `${this.API_BASE}/sns/oauth2/access_token`,
      {
        params: {
          appid: this.config.appId,
          secret: this.config.appSecret,
          code,
          grant_type: 'authorization_code'
        }
      }
    );

    if (response.data.errcode) {
      throw new Error(response.data.errmsg);
    }

    return response.data;
  }

  async getUserInfo(accessToken: string, openid: string) {
    if (!this.isConfigured) {
      throw new Error('WeChat Open Platform service is not configured');
    }

    const response = await axios.get(
      `${this.API_BASE}/sns/userinfo`,
      {
        params: {
          access_token: accessToken,
          openid,
          lang: 'zh_CN'
        }
      }
    );

    if (response.data.errcode) {
      throw new Error(response.data.errmsg);
    }

    return response.data;
  }
}

export const wechatMP = new WeChatMPService();
export const wechatMiniProgram = new WeChatMiniProgramService();
export const wechatOpenPlatform = new WeChatOpenPlatformService();