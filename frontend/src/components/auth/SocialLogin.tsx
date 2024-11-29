import { GoogleLogin } from './GoogleLogin';
import { FacebookLogin } from './FacebookLogin';
import { GitHubLogin } from './GitHubLogin';
import { AppleLogin } from './AppleLogin';

interface SocialLoginProps {
  onSuccess: (data: any) => void;
}

export function SocialLogin({ onSuccess }: SocialLoginProps) {
  return (
    <div className="grid grid-cols-1 gap-3">
      <GoogleLogin onSuccess={onSuccess} />
      <FacebookLogin onSuccess={onSuccess} />
      <GitHubLogin onSuccess={onSuccess} />
      <AppleLogin onSuccess={onSuccess} />
    </div>
  );
}