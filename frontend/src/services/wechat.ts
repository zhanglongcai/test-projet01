import { toast } from 'react-hot-toast';

export async function generateQrCode() {
  const response = await fetch('/api/wechat/qrcode');
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'Failed to generate QR code');
  }

  return data.data;
}

export async function checkScanStatus(sceneStr: string) {
  const response = await fetch(`/api/wechat/scan-status/${sceneStr}`);
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'Failed to check scan status');
  }

  return data.data;
}

export async function startQrCodePolling(sceneStr: string, onSuccess: (data: any) => void) {
  const pollInterval = 2000; // 2 seconds
  const maxAttempts = 150; // 5 minutes
  let attempts = 0;

  const poll = async () => {
    try {
      const result = await checkScanStatus(sceneStr);

      if (result.status === 'SCANNED') {
        onSuccess(result);
        return;
      }

      attempts++;
      
      if (attempts >= maxAttempts) {
        toast.error('QR code expired. Please refresh to try again.');
        return;
      }

      setTimeout(poll, pollInterval);
    } catch (error) {
      if (error instanceof Error && error.message === 'QR code expired') {
        toast.error('QR code expired. Please refresh to try again.');
        return;
      }
      setTimeout(poll, pollInterval);
    }
  };

  poll();
}