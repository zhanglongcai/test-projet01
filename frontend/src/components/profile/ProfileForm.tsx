import { useState } from 'react';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Loader2 } from 'lucide-react';
import { toastManager } from '../../utils/toast-manager';

interface ProfileFormData {
  email: string;
  phone: string;
}

interface ProfileFormProps {
  initialData: ProfileFormData;
  onSubmit: (data: ProfileFormData) => Promise<boolean>;
}

export function ProfileForm({ initialData, onSubmit }: ProfileFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState(initialData);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setIsSubmitting(true);
      const success = await onSubmit(formData);
      if (success) {
        toastManager.success('个人资料更新成功');
      }
    } catch (error) {
      toastManager.error(error instanceof Error ? error.message : '更新失败');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700">
          邮箱
        </label>
        <div className="mt-1">
          <Input
            id="email"
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            placeholder="请输入邮箱"
            disabled={!!formData.email}
          />
          {formData.email && (
            <p className="mt-1 text-xs text-gray-500">邮箱地址不可修改</p>
          )}
        </div>
      </div>

      <div>
        <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
          手机号
        </label>
        <div className="mt-1">
          <Input
            id="phone"
            type="tel"
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            placeholder="请输入手机号"
            disabled={!!formData.phone}
          />
          {formData.phone && (
            <p className="mt-1 text-xs text-gray-500">手机号不可修改，如需修改请前往账号安全页面</p>
          )}
        </div>
      </div>

      <div className="flex justify-end">
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            '保存修改'
          )}
        </Button>
      </div>
    </form>
  );
}