import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useUserStore } from '../../stores/userStore';
import { toastManager } from '../../utils/toast-manager';
import { Logo } from '../../components/Logo';
import { EmailLogin } from '../../components/auth/EmailLogin';
import { PhoneLogin } from '../../components/auth/PhoneLogin';
import { QRCode } from '../../components/auth/QRCode';
import { WeChatMPLogin } from '../../components/auth/WeChatMPLogin';
import { authService } from '../../services/auth';

type LoginType = 'email' | 'phone' | 'wechat';

export function Login() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [loginType, setLoginType] = useState<LoginType>('email');
  const setAuth = useUserStore(state => state.setAuth);

  const handleEmailLogin = async (data: { email: string; password: string; remember: boolean }) => {
    try {
      setIsLoading(true);
      const result = await authService.loginWithEmail(data);
      setAuth(result.tokens.accessToken, result.user);
      toastManager.success('登录成功');
      navigate('/');
    } catch (error) {
      toastManager.error(error instanceof Error ? error.message : '登录失败');
    } finally {
      setIsLoading(false);
    }
  };

  const handlePhoneLogin = async (data: { phone: string; code: string; remember: boolean }) => {
    try {
      setIsLoading(true);
      const result = await authService.loginWithPhone(data);
      setAuth(result.tokens.accessToken, result.user);
      toastManager.success('登录成功');
      navigate('/');
    } catch (error) {
      toastManager.error(error instanceof Error ? error.message : '登录失败');
    } finally {
      setIsLoading(false);
    }
  };

  const handleWeChatLogin = async (data: any) => {
    try {
      setIsLoading(true);
      const result = await authService.socialLogin({
        provider: 'wechat',
        token: data.token
      });
      setAuth(result.tokens.accessToken, result.user);
      toastManager.success('登录成功');
      navigate('/');
    } catch (error) {
      toastManager.error(error instanceof Error ? error.message : '登录失败');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <Logo />
        </div>
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          登录账号
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          还没有账号？{' '}
          <Link to="/register" className="font-medium text-blue-600 hover:text-blue-500">
            立即注册
          </Link>
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <div className="flex justify-center space-x-4 border-b mb-6">
            <button
              className={`pb-2 px-4 ${
                loginType === 'email'
                  ? 'border-b-2 border-blue-500 text-blue-600'
                  : 'text-gray-500'
              }`}
              onClick={() => setLoginType('email')}
            >
              邮箱登录
            </button>
            <button
              className={`pb-2 px-4 ${
                loginType === 'phone'
                  ? 'border-b-2 border-blue-500 text-blue-600'
                  : 'text-gray-500'
              }`}
              onClick={() => setLoginType('phone')}
            >
              手机号登录
            </button>
            <button
              className={`pb-2 px-4 ${
                loginType === 'wechat'
                  ? 'border-b-2 border-blue-500 text-blue-600'
                  : 'text-gray-500'
              }`}
              onClick={() => setLoginType('wechat')}
            >
              微信登录
            </button>
          </div>

          {loginType === 'email' && (
            <EmailLogin onLogin={handleEmailLogin} isLoading={isLoading} />
          )}
          
          {loginType === 'phone' && (
            <PhoneLogin onLogin={handlePhoneLogin} isLoading={isLoading} />
          )}
          
          {loginType === 'wechat' && (
            <div className="space-y-6">
              <QRCode onSuccess={handleWeChatLogin} />
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-gray-500">或</span>
                </div>
              </div>
              <WeChatMPLogin />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}