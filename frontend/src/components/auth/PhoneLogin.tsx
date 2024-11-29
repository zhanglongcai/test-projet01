import { useState } from 'react';
import { Phone, Loader2 } from 'lucide-react';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { FormField } from '../ui/FormField';
import { useFormValidation } from '../../hooks/useFormValidation';
import { loginSchema } from '../../utils/validation';
import { authService } from '../../services/auth';
import { toastManager } from '../../utils/toast-manager';

interface PhoneLoginProps {
  onLogin: (data: { phone: string; code: string; remember: boolean }) => Promise<void>;
  isLoading: boolean;
}

export function PhoneLogin({ onLogin, isLoading }: PhoneLoginProps) {
  const [phone, setPhone] = useState('');
  const [code, setCode] = useState('');
  const [remember, setRemember] = useState(false);
  const [isSendingCode, setIsSendingCode] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const { errors, validate, clearErrors, setError } = useFormValidation(loginSchema.phone);

  const handleSendCode = async () => {
    if (!phone) {
      setError('phone', '请输入手机号');
      return;
    }

    if (!/^1[3-9]\d{9}$/.test(phone)) {
      setError('phone', '请输入正确的手机号');
      return;
    }

    try {
      setIsSendingCode(true);
      await authService.sendPhoneCode(phone, 'LOGIN');
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
    clearErrors();
    
    const data = { phone, code, remember };
    if (!validate(data)) return;

    await onLogin(data);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <FormField 
        label="手机号" 
        error={errors.phone}
        required
      >
        <Input
          type="tel"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          icon={<Phone className="w-5 h-5 text-gray-400" />}
          placeholder="请输入手机号"
          disabled={isLoading}
          error={!!errors.phone}
        />
      </FormField>

      <FormField 
        label="验证码" 
        error={errors.code}
        required
      >
        <div className="flex space-x-4">
          <Input
            type="text"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder="请输入验证码"
            className="flex-1"
            disabled={isLoading}
            error={!!errors.code}
          />
          <Button
            type="button"
            variant="outline"
            onClick={handleSendCode}
            disabled={isSendingCode || countdown > 0 || isLoading}
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
      </FormField>

      <div className="flex items-center">
        <input
          id="remember"
          type="checkbox"
          checked={remember}
          onChange={(e) => setRemember(e.target.checked)}
          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
        />
        <label htmlFor="remember" className="ml-2 block text-sm text-gray-900">
          记住我
        </label>
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
  );
}