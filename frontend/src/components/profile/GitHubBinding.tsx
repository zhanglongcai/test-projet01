import { useState } from 'react';
import { Button } from '../ui/Button';
import { Loader2 } from 'lucide-react';
import { toastManager } from '../../utils/toast-manager';

interface GitHubBindingProps {
  isConnected: boolean;
  onBind: (data: any) => Promise<boolean>;
  onUnbind?: () => Promise<boolean>;
}

export function GitHubBinding({ isConnected, onBind, onUnbind }: GitHubBindingProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handleGitHubLogin = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/auth/github/auth-url');
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to get GitHub auth URL');
      }

      // Store callback state
      sessionStorage.setItem('github_oauth_state', data.data.state);

      // Redirect to GitHub
      window.location.href = data.data.authUrl;
    } catch (error) {
      toastManager.error(error instanceof Error ? error.message : '绑定失败');
      setIsLoading(false);
    }
  };

  const handleUnbind = async () => {
    if (!onUnbind) return;
    
    try {
      setIsLoading(true);
      const success = await onUnbind();
      if (success) {
        toastManager.success('GitHub账号解绑成功');
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
        <h3 className="text-lg font-medium text-gray-900">GitHub账号</h3>
        <p className="mt-1 text-sm text-gray-500">
          {isConnected ? '已绑定GitHub账号' : '绑定GitHub账号，享受快捷登录'}
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
          onClick={handleGitHubLogin}
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