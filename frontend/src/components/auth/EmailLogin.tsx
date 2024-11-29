import { useState } from 'react';
import { Mail, Lock, Loader2 } from 'lucide-react';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { FormField } from '../ui/FormField';
import { useFormValidation } from '../../hooks/useFormValidation';
import { loginSchema } from '../../utils/validation';
import { authService } from '../../services/auth';

interface EmailLoginProps {
  onLogin: (data: { email: string; password: string; remember: boolean }) => Promise<void>;
  isLoading: boolean;
}

export function EmailLogin({ onLogin, isLoading }: EmailLoginProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [remember, setRemember] = useState(false);
  const { errors, validate, clearErrors } = useFormValidation(loginSchema.email);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearErrors();
    
    const data = { email, password, remember };
    if (!validate(data)) return;

    await onLogin(data);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <FormField 
        label="邮箱地址" 
        error={errors.email}
        required
      >
        <Input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          icon={<Mail className="w-5 h-5 text-gray-400" />}
          placeholder="请输入邮箱地址"
          disabled={isLoading}
          error={!!errors.email}
        />
      </FormField>

      <FormField 
        label="密码" 
        error={errors.password}
        required
      >
        <Input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          icon={<Lock className="w-5 h-5 text-gray-400" />}
          placeholder="请输入密码"
          disabled={isLoading}
          error={!!errors.password}
        />
      </FormField>

      <div className="flex items-center justify-between">
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