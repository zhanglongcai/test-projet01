import { useState } from 'react';
import { Shield } from 'lucide-react';
import { PhoneBinding } from '../../components/profile/PhoneBinding';
import { useUserStore } from '../../stores/userStore';
import { toastManager } from '../../utils/toast-manager';

export function Security() {
  const [isLoading, setIsLoading] = useState(false);
  const user = useUserStore(state => state.user);
  const updateUser = useUserStore(state => state.updateUser);

  const handleBindPhone = async (data: { phone: string; code: string }) => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/auth/phone/bind', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${useUserStore.getState().token}`
        },
        body: JSON.stringify(data)
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || '绑定失败');
      }

      updateUser(result.data);
      toastManager.success('手机号绑定成功');
    } catch (error) {
      toastManager.error(error instanceof Error ? error.message : '绑定失败');
    } finally {
      setIsLoading(false);
    }
  };

  const handleUnbindPhone = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/auth/phone/unbind', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${useUserStore.getState().token}`
        }
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || '解绑失败');
      }

      updateUser(result.data);
      toastManager.success('手机号解绑成功');
    } catch (error) {
      toastManager.error(error instanceof Error ? error.message : '解绑失败');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-6 sm:px-6 lg:px-8">
      <div className="bg-white shadow sm:rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <div className="sm:flex sm:items-center sm:justify-between">
            <div>
              <h3 className="text-lg font-medium leading-6 text-gray-900">账号安全</h3>
              <div className="mt-2 max-w-xl text-sm text-gray-500">
                <p>管理您的账号安全设置，包括手机号绑定、密码修改等。</p>
              </div>
            </div>
            <div className="mt-5 sm:mt-0 sm:ml-6 sm:flex-shrink-0">
              <Shield className="w-12 h-12 text-blue-500" />
            </div>
          </div>

          <div className="mt-8 border-t border-gray-200 pt-8">
            <PhoneBinding
              currentPhone={user?.phone}
              onBind={handleBindPhone}
              onUnbind={handleUnbindPhone}
            />
          </div>
        </div>
      </div>
    </div>
  );
}