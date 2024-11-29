import { useState } from 'react';
import { FacebookProvider, LoginButton } from 'react-facebook';
import { Button } from '../ui/Button';
import { Loader2 } from 'lucide-react';
import { toastManager } from '../../utils/toast-manager';

interface FacebookBindingProps {
  isConnected: boolean;
  onBind: (data: any) => Promise<boolean>;
  onUnbind?: () => Promise<boolean>;
}

export function FacebookBinding({ isConnected, onBind, onUnbind }: FacebookBindingProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handleFacebookResponse = async (response: any) => {
    try {
      setIsLoading(true);
      const success = await onBind({
        accessToken: response.accessToken
      });
      if (success) {
        toastManager.success('Facebook账号绑定成功');
      }
    } catch (error) {
      toastManager.error(error instanceof Error ? error.message : '绑定失败');
    } finally {
      setIsLoading(false);
    }
  };

  const handleUnbind = async () => {
    if (!onUnbind) return;
    
    try {
      setIsLoading(true);
      const success = await onUnbind();
      if (success) {
        toastManager.success('Facebook账号解绑成功');
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
        <h3 className="text-lg font-medium text-gray-900">Facebook账号</h3>
        <p className="mt-1 text-sm text-gray-500">
          {isConnected ? '已绑定Facebook账号' : '绑定Facebook账号，享受快捷登录'}
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
        <FacebookProvider appId={import.meta.env.VITE_FACEBOOK_APP_ID}>
          <LoginButton
            scope="email,public_profile"
            onSuccess={handleFacebookResponse}
            onError={(error) => {
              toastManager.error('Facebook账号绑定失败');
              console.error('Facebook Binding Error:', error);
            }}
          >
            <Button disabled={isLoading}>
              {isLoading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                '绑定账号'
              )}
            </Button>
          </LoginButton>
        </FacebookProvider>
      )}
    </div>
  );
}