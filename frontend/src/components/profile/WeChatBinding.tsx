import { useState } from 'react';
import { Loader2 } from 'lucide-react';
import { Button } from '../ui/Button';
import { toastManager } from '../../utils/toast-manager';
import { QRCode } from '../auth/QRCode';

interface WeChatBindingProps {
  isConnected: boolean;
  onBind: (data: any) => Promise<void>;
  onUnbind?: () => Promise<void>;
}

export function WeChatBinding({ isConnected, onBind, onUnbind }: WeChatBindingProps) {
  const [isBinding, setIsBinding] = useState(false);
  const [isUnbinding, setIsUnbinding] = useState(false);
  const [showQRCode, setShowQRCode] = useState(false);

  const handleBind = async (data: any) => {
    try {
      setIsBinding(true);
      await onBind(data);
      setShowQRCode(false);
    } catch (error) {
      toastManager.error(error instanceof Error ? error.message : '绑定失败');
    } finally {
      setIsBinding(false);
    }
  };

  const handleUnbind = async () => {
    if (!onUnbind) return;
    
    try {
      setIsUnbinding(true);
      await onUnbind();
    } catch (error) {
      toastManager.error(error instanceof Error ? error.message : '解绑失败');
    } finally {
      setIsUnbinding(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium text-gray-900">微信绑定</h3>
        {isConnected && onUnbind && (
          <Button
            variant="outline"
            onClick={handleUnbind}
            disabled={isUnbinding}
          >
            {isUnbinding ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              '解除绑定'
            )}
          </Button>
        )}
      </div>

      {isConnected ? (
        <div className="text-gray-500">
          已绑定微信账号
        </div>
      ) : showQRCode ? (
        <div className="flex flex-col items-center space-y-4">
          <QRCode onSuccess={handleBind} />
          <p className="text-sm text-gray-500">
            请使用微信扫码绑定
          </p>
          <Button
            variant="outline"
            onClick={() => setShowQRCode(false)}
          >
            取消绑定
          </Button>
        </div>
      ) : (
        <Button
          onClick={() => setShowQRCode(true)}
          disabled={isBinding}
        >
          {isBinding ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            '绑定微信'
          )}
        </Button>
      )}
    </div>
  );
}