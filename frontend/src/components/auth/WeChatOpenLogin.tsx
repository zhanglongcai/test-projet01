import { useState } from 'react';
import { Loader2 } from 'lucide-react';
import { Button } from '../ui/Button';
import { toastManager } from '../../utils/toast-manager';

export function WeChatOpenLogin() {
  const [isLoading, setIsLoading] = useState(false);

  const handleOpenPlatformLogin = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/auth/wechat/open/auth-url?' + new URLSearchParams({
        redirectUri: `${window.location.origin}/api/auth/wechat/open/callback`,
        state: Math.random().toString(36).substring(7)
      }));

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || '获取授权链接失败');
      }

      // Redirect to WeChat Open Platform authorization page
      window.location.href = data.data.authUrl;
    } catch (error) {
      toastManager.error(error instanceof Error ? error.message : '登录失败');
      setIsLoading(false);
    }
  };

  return (
    <Button
      onClick={handleOpenPlatformLogin}
      disabled={isLoading}
      className="w-full flex items-center justify-center space-x-2"
    >
      {isLoading ? (
        <Loader2 className="w-5 h-5 animate-spin" />
      ) : (
        <>
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
            <path d="M21.502 19.525c1.524-1.105 2.498-2.738 2.498-4.554 0-3.326-3.237-6.023-7.229-6.023s-7.229 2.697-7.229 6.023c0 3.327 3.237 6.024 7.229 6.024.825 0 1.621-.117 2.36-.33l.212-.032c.139 0 .265.043.384.111l1.583.914.139.045c.133 0 .241-.108.241-.241l-.039-.176-.326-1.215-.025-.154c0-.162.063-.305.168-.41zm-12.827-6.934c-.471 0-.854-.383-.854-.854s.383-.854.854-.854.854.383.854.854-.383.854-.854.854zm4.416 0c-.471 0-.854-.383-.854-.854s.383-.854.854-.854.854.383.854.854-.383.854-.854.854z"/>
          </svg>
          <span>微信开放平台登录</span>
        </>
      )}
    </Button>
  );
}