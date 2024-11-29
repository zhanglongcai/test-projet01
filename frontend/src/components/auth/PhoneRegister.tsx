import { useState } from 'react';
import { Phone, User, Loader2 } from 'lucide-react';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { FormField } from '../ui/FormField';
import { useFormValidation } from '../../hooks/useFormValidation';
import { registerSchema } from '../../utils/validation';
import { authService } from '../../services/auth';
import { toastManager } from '../../utils/toast-manager';

interface PhoneRegisterProps {
  onRegister: (data: { phone: string; code: string; name: string }) => Promise<void>;
  isLoading: boolean;
}

export function PhoneRegister({ onRegister, isLoading }: PhoneRegisterProps) {
  const [phone, setPhone] = useState('');
  const [code, setCode] = useState('');
  const [name, setName] = useState('');
  const [isSendingCode, setIsSendingCode] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const { errors, validate, clearErrors, setError } = useFormValidation(registerSchema.phone);

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
      await authService.sendPhoneCode(phone, 'REGISTER');
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
    
    const data = { phone, code, name };
    if (!validate(data)) return;

    await onRegister(data);
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

      <FormField 
        label="用户名" 
        error={errors.name}
        required
      >
        <Input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          icon={<User className="w-5 h-5 text-gray-400" />}
          placeholder="请输入用户名"
          disabled={isLoading}
          error={!!errors.name}
        />
      </FormField>

      <Button
        type="submit"
        className="w-full flex justify-center py-2 px-4"
        disabled={isLoading}
      >
        {isLoading ? (
          <Loader2 className="w-5 h-5 animate-spin" />
        ) : (
          '注册'
        )}
      </Button>
    </form>
  );
}