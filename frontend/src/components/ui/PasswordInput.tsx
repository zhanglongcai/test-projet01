import { useState } from 'react';
import { Eye, EyeOff, Lock } from 'lucide-react';
import { Input } from './Input';
import { getPasswordStrength } from '../../utils/password';

interface PasswordInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  showStrength?: boolean;
}

export function PasswordInput({ showStrength = false, ...props }: PasswordInputProps) {
  const [showPassword, setShowPassword] = useState(false);
  const strength = props.value ? getPasswordStrength(props.value as string) : null;

  return (
    <div className="space-y-2">
      <div className="relative">
        <Input
          type={showPassword ? 'text' : 'password'}
          icon={<Lock className="w-5 h-5 text-gray-400" />}
          {...props}
        />
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="absolute inset-y-0 right-0 pr-3 flex items-center"
        >
          {showPassword ? (
            <EyeOff className="h-5 w-5 text-gray-400" />
          ) : (
            <Eye className="h-5 w-5 text-gray-400" />
          )}
        </button>
      </div>

      {showStrength && strength && (
        <div className="space-y-1">
          <div className="h-1 w-full bg-gray-200 rounded-full overflow-hidden">
            <div
              className={`h-full transition-all duration-300 ${
                strength.score === 5
                  ? 'bg-green-500'
                  : strength.score >= 3
                  ? 'bg-yellow-500'
                  : 'bg-red-500'
              }`}
              style={{ width: `${(strength.score / 5) * 100}%` }}
            />
          </div>
          <p className="text-xs text-gray-500">{strength.feedback}</p>
        </div>
      )}
    </div>
  );
}