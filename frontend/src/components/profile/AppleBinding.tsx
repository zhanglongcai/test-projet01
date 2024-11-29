import { useState, useEffect } from 'react';
import { Button } from '../ui/Button';
import { Loader2 } from 'lucide-react';
import { toastManager } from '../../utils/toast-manager';

interface AppleBindingProps {
  isConnected: boolean;
  onBind: (data: any) => Promise<boolean>;
  onUnbind?: () => Promise<boolean>;
}

export function AppleBinding({ isConnected, onBind, onUnbind }: AppleBindingProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [isScriptLoaded, setIsScriptLoaded] = useState(false);

  useEffect(() => {
    if (!isConnected) {
      // Load Apple Sign In script
      const script = document.createElement('script');
      script.src = 'https://appleid.cdn-apple.com/appleauth/static/jsapi/appleid/1/en_US/appleid.auth.js';
      script.async = true;
      script.onload = () => {
        setIsScriptLoaded(true);
        // Initialize Apple Sign In
        window.AppleID.auth.init({
          clientId: import.meta.env.VITE_APPLE_CLIENT_ID,
          scope: 'name email',
          redirectURI: `${window.location.origin}/api/auth/apple/callback`,
          state: crypto.randomUUID(),
          usePopup: true
        });
      };
      document.head.appendChild(script);

      return () => {
        document.head.removeChild(script);
      };
    }
  }, [isConnected]);

  const handleAppleLogin = async () => {
    try {
      setIsLoading(true);
      const data = await window.AppleID.auth.signIn();
      const success = await onBind({
        code: data.authorization.code,
        id_token: data.authorization.id_token,
        state: data.authorization.state
      });
      if (success) {
        toastManager.success('Apple账号绑定成功');
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
        toastManager.success('Apple账号解绑成功');
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
        <h3 className="text-lg font-medium text-gray-900">Apple账号</h3>
        <p className="mt-1 text-sm text-gray-500">
          {isConnected ? '已绑定Apple账号' : '绑定Apple账号，享受快捷登录'}
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
          onClick={handleAppleLogin}
          disabled={isLoading || !isScriptLoaded}
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