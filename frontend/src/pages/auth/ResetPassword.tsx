import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, Loader2 } from 'lucide-react';
import { toastManager } from '../../utils/toast-manager';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Logo } from '../../components/Logo';

export function ResetPassword() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isSendingCode, setIsSendingCode] = useState(false);
  const [countdown, setCountdown] = useState(0);

  const handleSendCode = async () => {
    if (!email) {
      toastManager.error('请输入邮箱地址');
      return;
    }

    try {
      setIsSendingCode(true);
      const response = await fetch('/api/auth/send-code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, type: 'RESET_PASSWORD' })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || '发送验证码失败');
      }

      toastManager.success('验证码已发送');
      setCountdown(60);
      const timer = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } catch (error) {
      toastManager.error(error instanceof Error ? error.message : '发送验证码失败');
    } finally {
      setIsSendingCode(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !code || !newPassword) {
      toastManager.error('请填写所有必填项');
      return;
    }

    if (newPassword !== confirmPassword) {
      toastManager.error('两次输入的密码不一致');
      return;
    }

    try {
      setIsLoading(true);
      const response = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, code, newPassword })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || '重置密码失败');
      }

      toastManager.success('密码重置成功');
      navigate('/login');
    } catch (error) {
      toastManager.error(error instanceof Error ? error.message : '重置密码失败');
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
          找回密码
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          记起密码了？{' '}
          <Link to="/login" className="font-medium text-blue-600 hover:text-blue-500">
            立即登录
          </Link>
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                邮箱地址
              </label>
              <div className="mt-1">
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  icon={<Mail className="w-5 h-5 text-gray-400" />}
                  placeholder="请输入邮箱地址"
                />
              </div>
            </div>

            <div>
              <label htmlFor="code" className="block text-sm font-medium text-gray-700">
                验证码
              </label>
              <div className="mt-1 flex space-x-4">
                <Input
                  id="code"
                  type="text"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  required
                  placeholder="请输入验证码"
                  className="flex-1"
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleSendCode}
                  disabled={isSendingCode || countdown > 0}
                >
                  {isSendingCode ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : countdown > 0 ? (
                    `${countdown}s后重试`
                  ) : (
                    '发送验证码'
                  )}
                </Button>
              </div>
            </div>

            <div>
              <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700">
                新密码
              </label>
              <div className="mt-1">
                <Input
                  id="newPassword"
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                  icon={<Lock className="w-5 h-5 text-gray-400" />}
                  placeholder="请输入新密码"
                />
              </div>
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                确认新密码
              </label>
              <div className="mt-1">
                <Input
                  id="confirmPassword"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  icon={<Lock className="w-5 h-5 text-gray-400" />}
                  placeholder="请再次输入新密码"
                />
              </div>
            </div>

            <Button
              type="submit"
              className="w-full flex justify-center py-2 px-4"
              disabled={isLoading}
            >
              {isLoading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                '重置密码'
              )}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}