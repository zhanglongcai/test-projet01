import { useEffect, useState } from 'react';
import { Loader2, RefreshCw } from 'lucide-react';
import { Button } from '../ui/Button';

interface QRCodeProps {
  onSuccess: (data: any) => void;
}

export function QRCode({ onSuccess }: QRCodeProps) {
  const [qrCode, setQrCode] = useState<string | null>(null);
  const [sceneStr, setSceneStr] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadQrCode = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await fetch('/api/auth/wechat/qrcode');
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to load QR code');
      }

      setQrCode(data.data.qrUrl);
      setSceneStr(data.data.sceneStr);

      // Start polling for scan status
      const pollInterval = setInterval(async () => {
        try {
          const statusResponse = await fetch(`/api/auth/wechat/scan-status/${data.data.sceneStr}`);
          const statusData = await statusResponse.json();

          if (!statusResponse.ok) {
            throw new Error(statusData.message);
          }

          if (statusData.data.status === 'SCANNED') {
            clearInterval(pollInterval);
            onSuccess(statusData.data);
          }
        } catch (error) {
          if (error instanceof Error && error.message === 'QR code expired') {
            clearInterval(pollInterval);
            setError('QR code expired. Please refresh to try again.');
          }
        }
      }, 2000);

      // Clear interval after expiration
      setTimeout(() => {
        clearInterval(pollInterval);
        setError('QR code expired. Please refresh to try again.');
      }, data.data.expireIn * 1000);

    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to load QR code');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadQrCode();
  }, []);

  if (isLoading) {
    return (
      <div className="w-48 h-48 flex items-center justify-center bg-gray-50 rounded-lg">
        <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-48 h-48 bg-gray-50 rounded-lg flex flex-col items-center justify-center p-4">
        <p className="text-sm text-gray-500 text-center mb-4">{error}</p>
        <Button
          variant="outline"
          size="sm"
          onClick={loadQrCode}
          className="flex items-center"
        >
          <RefreshCw className="w-4 h-4 mr-2" />
          Retry
        </Button>
      </div>
    );
  }

  return (
    <div className="w-48 h-48 bg-gray-50 rounded-lg flex items-center justify-center">
      {qrCode && (
        <img src={qrCode} alt="WeChat QR Code" className="w-40 h-40" />
      )}
    </div>
  );
}