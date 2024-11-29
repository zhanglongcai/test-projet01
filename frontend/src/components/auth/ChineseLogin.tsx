import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Phone, Lock, Loader2 } from 'lucide-react';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { QRCode } from './QRCode';

interface ChineseLoginProps {
  onLogin: (data: { phone: string; password: string }) => Promise<void>;
  isLoading: boolean;
}

export function ChineseLogin({ onLogin, isLoading }: ChineseLoginProps) {
  const [loginType, setLoginType] = useState<'phone' | 'wechat'>('phone');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onLogin({ phone, password });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-center space-x-4 border-b">
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
          微信扫码登录
        </button>
      </div>

      {loginType === 'phone' ? (
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
              手机号
            </label>
            <div className="mt-1">
              <Input
                id="phone"
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
                icon={<Phone className="w-5 h-5 text-gray-400" />}
                placeholder="请输入手机号"
              />
            </div>
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              密码
            </label>
            <div className="mt-1">
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                icon={<Lock className="w-5 h-5 text-gray-400" />}
                placeholder="请输入密码"
              />
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                id="remember-me"
                name="remember-me"
                type="checkbox"
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900">
                记住我
              </label>
            </div>

            <div className="text-sm">
              <Link to="/forgot-password" className="font-medium text-blue-600 hover:text-blue-500">
                忘记密码？
              </Link>
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
              '登录'
            )}
          </Button>
        </form>
      ) : (
        <div className="flex flex-col items-center space-y-4">
          <QRCode />
          <p className="text-sm text-gray-500">
            请使用微信扫码登录
          </p>
          <p className="text-xs text-gray-400">
            扫码后需关注公众号完成登录
          </p>
        </div>
      )}
    </div>
  );
}