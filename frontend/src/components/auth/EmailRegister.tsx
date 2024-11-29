import { useState } from 'react';
import { Mail, Lock, User, Loader2 } from 'lucide-react';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { PasswordInput } from '../ui/PasswordInput';
import { FormField } from '../ui/FormField';
import { useFormValidation } from '../../hooks/useFormValidation';
import { registerSchema } from '../../utils/validation';
import { toastManager } from '../../utils/toast-manager';

interface EmailRegisterProps {
  onRegister: (data: { email: string; password: string; name: string }) => Promise<void>;
  isLoading: boolean;
}

export function EmailRegister({ onRegister, isLoading }: EmailRegisterProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const { errors, validate, clearErrors } = useFormValidation(registerSchema.email);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearErrors();
    
    const data = { email, password, name };
    if (!validate(data)) return;

    await onRegister(data);
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
        <PasswordInput
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="请输入密码"
          disabled={isLoading}
          error={!!errors.password}
          showStrength
        />
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