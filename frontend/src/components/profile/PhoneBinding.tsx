import { useState } from 'react';
import { Phone, Loader2 } from 'lucide-react';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { toastManager } from '../../utils/toast-manager';

interface PhoneBindingProps {
  currentPhone?: string;
  onBind: (data: { phone: string; code: string }) => Promise<void>;
  onUnbind?: () => Promise<void>;
}

export function PhoneBinding({ currentPhone, onBind, onUnbind }: PhoneBindingProps) {
  const [phone, setPhone] = useState('');
  const [code, setCode] = useState('');
  const [isSendingCode, setIsSendingCode] = useState(false);
  const [isBinding, setIsBinding] = useState(false);
  const [isUnbinding, setIsUnbinding] = useState(false);
  const [countdown, setCountdown] = useState(0);

  const handleSendCode = async () => {
    if (!phone) {
      toastManager.error('请输入手机号');
      return;
    }

    if (!/^1[3-9]\d{9}$/.test(phone)) {
      toastManager.error('请输入正确的手机号');
      return;
    }

    try {
      setIsSendingCode(true);
      const response = await fetch('/api/auth/phone/send-code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || '发送验证码失败');
      }

      toastManager.success('验证码已发送');
      setCountdown(60);
      const timer = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } catch (error) {
      toastManager.error(error instanceof Error ? error.message : '发送验证码失败');
    } finally {
      setIsSendingCode(false);
    }
  };

  const handleBind = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!phone || !code) {
      toastManager.error('请填写所有必填项');
      return;
    }

    try {
      setIsBinding(true);
      await onBind({ phone, code });
      setPhone('');
      setCode('');
    } finally {
      setIsBinding(false);
    }
  };

  const handleUnbind = async () => {
    if (!onUnbind) return;
    
    try {
      setIsUnbinding(true);
      await onUnbind();
    } finally {
      setIsUnbinding(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium text-gray-900">手机号绑定</h3>
        {currentPhone && onUnbind && (
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

      {currentPhone ? (
        <div className="flex items-center space-x-2 text-gray-500">
          <Phone className="w-5 h-5" />
          <span>{currentPhone}</span>
        </div>
      ) : (
        <form onSubmit={handleBind} className="space-y-4">
          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
              手机号
            </label>
            <div className="mt-1">
              <Input
                id="phone"
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
                icon={<Phone className="w-5 h-5 text-gray-400" />}
                placeholder="请输入手机号"
              />
            </div>
          </div>

          <div>
            <label htmlFor="code" className="block text-sm font-medium text-gray-700">
              验证码
            </label>
            <div className="mt-1 flex space-x-4">
              <Input
                id="code"
                type="text"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                required
                placeholder="请输入验证码"
                className="flex-1"
              />
              <Button
                type="button"
                variant="outline"
                onClick={handleSendCode}
                disabled={isSendingCode || countdown > 0}
              >
                {isSendingCode ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : countdown > 0 ? (
                  `${countdown}s后重试`
                ) : (
                  '发送验证码'
                )}
              </Button>
            </div>
          </div>

          <Button
            type="submit"
            className="w-full"
            disabled={isBinding}
          >
            {isBinding ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              '绑定手机号'
            )}
          </Button>
        </form>
      )}
    </div>
  );
}