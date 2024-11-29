import { http } from '../utils/http';
import { auth } from '../utils/auth';

interface LoginResponse {
  tokens: {
    accessToken: string;
    refreshToken: string;
  };
  user: {
    id: string;
    email?: string;
    phone?: string;
    name: string;
    avatarUrl?: string;
  };
}

interface EmailLoginData {
  email: string;
  password: string;
  remember?: boolean;
}

interface PhoneLoginData {
  phone: string;
  code: string;
  remember?: boolean;
}

interface EmailRegisterData {
  email: string;
  password: string;
  name: string;
}

interface PhoneRegisterData {
  phone: string;
  code: string;
  name: string;
}

interface ResetPasswordData {
  email: string;
  code: string;
  newPassword: string;
}

interface SocialLoginData {
  provider: string;
  token: string;
}

export const authService = {
  // Email登录
  async loginWithEmail(data: EmailLoginData): Promise<LoginResponse> {
    const response = await http.post<LoginResponse>('/auth/email/login', data);
    auth.setTokens(response.tokens.accessToken, response.tokens.refreshToken, data.remember);
    return response;
  },

  // 手机号登录
  async loginWithPhone(data: PhoneLoginData): Promise<LoginResponse> {
    const response = await http.post<LoginResponse>('/auth/phone/login', data);
    auth.setTokens(response.tokens.accessToken, response.tokens.refreshToken, data.remember);
    return response;
  },

  // 发送手机验证码
  async sendPhoneCode(phone: string, type: 'LOGIN' | 'REGISTER' | 'RESET_PASSWORD'): Promise<void> {
    await http.post('/auth/phone/send-code', { phone, type });
  },

  // 发送邮箱验证码
  async sendEmailCode(email: string, type: 'LOGIN' | 'REGISTER' | 'RESET_PASSWORD'): Promise<void> {
    await http.post('/auth/email/send-code', { email, type });
  },

  // Email注册
  async registerWithEmail(data: EmailRegisterData): Promise<LoginResponse> {
    const response = await http.post<LoginResponse>('/auth/email/register', data);
    auth.setTokens(response.tokens.accessToken, response.tokens.refreshToken, false);
    return response;
  },

  // 手机号注册
  async registerWithPhone(data: PhoneRegisterData): Promise<LoginResponse> {
    const response = await http.post<LoginResponse>('/auth/phone/register', data);
    auth.setTokens(response.tokens.accessToken, response.tokens.refreshToken, false);
    return response;
  },

  // 重置密码
  async resetPassword(data: ResetPasswordData): Promise<void> {
    await http.post('/auth/reset-password', data);
  },

  // 社交登录
  async socialLogin(data: SocialLoginData): Promise<LoginResponse> {
    const response = await http.post<LoginResponse>(`/auth/${data.provider}/callback`, {
      token: data.token
    });
    auth.setTokens(response.tokens.accessToken, response.tokens.refreshToken, false);
    return response;
  },

  // 刷新Token
  async refreshToken(refreshToken: string): Promise<{ accessToken: string; refreshToken: string }> {
    const response = await http.post<{ tokens: { accessToken: string; refreshToken: string } }>(
      '/auth/refresh-token',
      { refreshToken }
    );
    return response.tokens;
  },

  // 退出登录
  async logout(): Promise<void> {
    await http.post('/auth/logout');
    auth.removeTokens();
  },

  // 验证Token
  async verifyToken(): Promise<boolean> {
    try {
      await http.get('/auth/verify');
      return true;
    } catch {
      return false;
    }
  },

  // 绑定手机号
  async bindPhone(phone: string, code: string): Promise<void> {
    await http.post('/auth/phone/bind', { phone, code });
  },

  // 解绑手机号
  async unbindPhone(): Promise<void> {
    await http.post('/auth/phone/unbind');
  },

  // 绑定社交账号
  async bindSocialAccount(provider: string, token: string): Promise<void> {
    await http.post(`/auth/${provider}/bind`, { token });
  },

  // 解绑社交账号
  async unbindSocialAccount(provider: string): Promise<void> {
    await http.post(`/auth/${provider}/unbind`);
  }
};