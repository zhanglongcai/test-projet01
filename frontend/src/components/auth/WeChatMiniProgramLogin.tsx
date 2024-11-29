import { useState } from 'react';
import { Loader2 } from 'lucide-react';
import { Button } from '../ui/Button';
import { toastManager } from '../../utils/toast-manager';

export function WeChatMiniProgramLogin() {
  const [isLoading, setIsLoading] = useState(false);

  const handleMiniProgramLogin = async () => {
    try {
      setIsLoading(true);
      
      // This function would be called from the Mini Program
      // through a custom URL scheme or other mechanism
      toastManager.error('请在微信小程序内使用此功能');
      
    } catch (error) {
      toastManager.error(error instanceof Error ? error.message : '登录失败');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button
      onClick={handleMiniProgramLogin}
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
          <span>微信小程序登录</span>
        </>
      )}
    </Button>
  );
}