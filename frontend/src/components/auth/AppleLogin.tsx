import { useState, useEffect } from 'react';
import { Button } from '../ui/Button';
import { Loader2 } from 'lucide-react';
import { toastManager } from '../../utils/toast-manager';

interface AppleLoginProps {
  onSuccess: (data: any) => void;
}

export function AppleLogin({ onSuccess }: AppleLoginProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [isScriptLoaded, setIsScriptLoaded] = useState(false);

  useEffect(() => {
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
  }, []);

  const handleAppleLogin = async () => {
    try {
      setIsLoading(true);

      const data = await window.AppleID.auth.signIn();
      
      const response = await fetch('/api/auth/apple/callback', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          code: data.authorization.code,
          id_token: data.authorization.id_token,
          state: data.authorization.state
        })
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || 'Apple login failed');
      }

      onSuccess(result.data);
    } catch (error) {
      toastManager.error(error instanceof Error ? error.message : 'Login failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button
      type="button"
      variant="outline"
      onClick={handleAppleLogin}
      disabled={isLoading || !isScriptLoaded}
      className="w-full flex items-center justify-center space-x-2"
    >
      {isLoading ? (
        <Loader2 className="w-5 h-5 animate-spin" />
      ) : (
        <>
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
            <path d="M17.05 20.28c-.98.95-2.05.88-3.08.38-1.07-.52-2.04-.53-3.17 0-1.44.69-2.2.53-3.01-.38C3.31 15.85 3.96 8.62 8.56 8.12c1.21-.13 2.09.29 2.78.65.69.36 1.27.66 2.29.66s1.58-.3 2.29-.66c.69-.36 1.57-.78 2.78-.65.87.09 3.29.42 4.85 3.15-.13.09-2.89 1.7-2.85 5.05.04 4 3.48 5.35 3.52 5.38-.03.1-.57 1.96-1.87 3.88-.98 1.45-2.01 2.89-3.28 2.7zm-.35-17.16c-.71.87-1.87 1.55-3.01 1.46-.15-1.14.42-2.35 1.07-3.1C15.46.6 16.89 0 17.88 0c.14 1.2-.35 2.35-1.18 3.12z"/>
          </svg>
          <span>Continue with Apple</span>
        </>
      )}
    </Button>
  );
}