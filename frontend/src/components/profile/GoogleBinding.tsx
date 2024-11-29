import { useState } from 'react';
import { useGoogleLogin } from '@react-oauth/google';
import { Button } from '../ui/Button';
import { Loader2 } from 'lucide-react';
import { toastManager } from '../../utils/toast-manager';

interface GoogleBindingProps {
  isConnected: boolean;
  onBind: (data: any) => Promise<boolean>;
  onUnbind?: () => Promise<boolean>;
}

export function GoogleBinding({ isConnected, onBind, onUnbind }: GoogleBindingProps) {
  const [isLoading, setIsLoading] = useState(false);

  const login = useGoogleLogin({
    onSuccess: async (response) => {
      try {
        setIsLoading(true);
        const success = await onBind({
          credential: response.access_token
        });
        if (success) {
          toastManager.success('Google账号绑定成功');
        }
      } catch (error) {
        toastManager.error(error instanceof Error ? error.message : '绑定失败');
      } finally {
        setIsLoading(false);
      }
    },
    onError: (error) => {
      toastManager.error('Google账号绑定失败');
      console.error('Google Binding Error:', error);
    }
  });

  const handleUnbind = async () => {
    if (!onUnbind) return;
    
    try {
      setIsLoading(true);
      const success = await onUnbind();
      if (success) {
        toastManager.success('Google账号解绑成功');
      }
    } catch (error) {
      toastManager.error(error instanceof Error ? error.message : '解绑失败');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-between">
      <div>
        <h3 className="text-lg font-medium text-gray-900">Google账号</h3>
        <p className="mt-1 text-sm text-gray-500">
          {isConnected ? '已绑定Google账号' : '绑定Google账号，享受快捷登录'}
        </p>
      </div>
      {isConnected ? (
        <Button
          variant="outline"
          onClick={handleUnbind}
          disabled={isLoading || !onUnbind}
        >
          {isLoading ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            '解除绑定'
          )}
        </Button>
      ) : (
        <Button
          onClick={() => login()}
          disabled={isLoading}
        >
          {isLoading ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            '绑定账号'
          )}
        </Button>
      )}
    </div>
  );
}