import { useState } from 'react';
import { FacebookProvider, LoginButton } from 'react-facebook';
import { Button } from '../ui/Button';
import { Loader2 } from 'lucide-react';
import { toastManager } from '../../utils/toast-manager';

interface FacebookLoginProps {
  onSuccess: (data: any) => void;
}

export function FacebookLogin({ onSuccess }: FacebookLoginProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handleFacebookResponse = async (response: any) => {
    try {
      setIsLoading(true);
      const result = await fetch('/api/auth/facebook/callback', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          accessToken: response.accessToken,
        }),
      });

      const data = await result.json();

      if (!result.ok) {
        throw new Error(data.message || 'Facebook login failed');
      }

      onSuccess(data.data);
    } catch (error) {
      toastManager.error(error instanceof Error ? error.message : 'Login failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <FacebookProvider appId={import.meta.env.VITE_FACEBOOK_APP_ID}>
      <LoginButton
        scope="email,public_profile"
        onSuccess={handleFacebookResponse}
        onError={(error) => {
          toastManager.error('Facebook login failed');
          console.error('Facebook Login Error:', error);
        }}
      >
        <Button
          type="button"
          variant="outline"
          disabled={isLoading}
          className="w-full flex items-center justify-center space-x-2"
        >
          {isLoading ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            <>
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
              </svg>
              <span>Continue with Facebook</span>
            </>
          )}
        </Button>
      </LoginButton>
    </FacebookProvider>
  );
}