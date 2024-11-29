import { useState, useEffect } from 'react';
import { QRCode } from './QRCode';
import { toastManager } from '../../utils/toast-manager';

interface WeChatLoginProps {
  onSuccess: (data: any) => void;
}

export function WeChatLogin({ onSuccess }: WeChatLoginProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const handleSuccess = (data: any) => {
    onSuccess(data);
  };

  const handleError = (error: string) => {
    setError(error);
    toastManager.error(error);
  };

  return (
    <div className="flex flex-col items-center space-y-4">
      <QRCode onSuccess={handleSuccess} />
      <p className="text-sm text-gray-500">
        请使用微信扫码登录
      </p>
      <p className="text-xs text-gray-400">
        扫码后需关注公众号完成登录
      </p>
      {error && (
        <p className="text-sm text-red-500">
          {error}
        </p>
      )}
    </div>
  );
}