import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useUserStore } from '../../stores/userStore';
import { toastManager } from '../../utils/toast-manager';
import { Logo } from '../../components/Logo';
import { EmailRegister } from '../../components/auth/EmailRegister';
import { PhoneRegister } from '../../components/auth/PhoneRegister';
import { authService } from '../../services/auth';

type RegisterType = 'email' | 'phone';

export function Register() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [registerType, setRegisterType] = useState<RegisterType>('email');
  const setAuth = useUserStore(state => state.setAuth);

  const handleEmailRegister = async (data: { email: string; password: string; name: string }) => {
    try {
      setIsLoading(true);
      const result = await authService.registerWithEmail(data);
      setAuth(result.tokens.accessToken, result.user);
      toastManager.success('注册成功');
      navigate('/');
    } catch (error) {
      toastManager.error(error instanceof Error ? error.message : '注册失败');
    } finally {
      setIsLoading(false);
    }
  };

  const handlePhoneRegister = async (data: { phone: string; code: string; name: string }) => {
    try {
      setIsLoading(true);
      const result = await authService.registerWithPhone(data);
      setAuth(result.tokens.accessToken, result.user);
      toastManager.success('注册成功');
      navigate('/');
    } catch (error) {
      toastManager.error(error instanceof Error ? error.message : '注册失败');
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
          注册账号
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          已有账号？{' '}
          <Link to="/login" className="font-medium text-blue-600 hover:text-blue-500">
            立即登录
          </Link>
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <div className="flex justify-center space-x-4 border-b mb-6">
            <button
              className={`pb-2 px-4 ${
                registerType === 'email'
                  ? 'border-b-2 border-blue-500 text-blue-600'
                  : 'text-gray-500'
              }`}
              onClick={() => setRegisterType('email')}
            >
              邮箱注册
            </button>
            <button
              className={`pb-2 px-4 ${
                registerType === 'phone'
                  ? 'border-b-2 border-blue-500 text-blue-600'
                  : 'text-gray-500'
              }`}
              onClick={() => setRegisterType('phone')}
            >
              手机号注册
            </button>
          </div>

          {registerType === 'email' ? (
            <EmailRegister onRegister={handleEmailRegister} isLoading={isLoading} />
          ) : (
            <PhoneRegister onRegister={handlePhoneRegister} isLoading={isLoading} />
          )}
        </div>
      </div>
    </div>
  );
}