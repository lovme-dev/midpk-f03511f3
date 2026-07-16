import { useMemo } from 'react';
import { Progress } from '@/components/ui/progress';

interface PasswordStrengthMeterProps {
  password: string;
}

const PasswordStrengthMeter = ({ password }: PasswordStrengthMeterProps) => {
  const strength = useMemo(() => {
    if (!password) return { score: 0, label: '', color: '' };
    
    let score = 0;
    const checks = {
      length: password.length >= 8,
      lowercase: /[a-z]/.test(password),
      uppercase: /[A-Z]/.test(password),
      number: /\d/.test(password),
      special: /[!@#$%^&*(),.?":{}|<>]/.test(password),
    };
    
    score = Object.values(checks).filter(Boolean).length;
    
    const levels = [
      { score: 0, label: '', color: 'transparent' },
      { score: 1, label: 'Very Weak', color: 'hsl(0 84% 60%)' },
      { score: 2, label: 'Weak', color: 'hsl(25 95% 53%)' },
      { score: 3, label: 'Fair', color: 'hsl(48 96% 53%)' },
      { score: 4, label: 'Good', color: 'hsl(142 76% 36%)' },
      { score: 5, label: 'Strong', color: 'hsl(142 76% 36%)' },
    ];
    
    return levels[score];
  }, [password]);

  if (!password) return null;

  return (
    <div className="space-y-2">
      <Progress 
        value={(strength.score / 5) * 100} 
        className="h-2"
        style={{ 
          background: 'hsl(var(--muted))',
        }}
      />
      <div className="flex justify-between text-xs">
        <span className="text-muted-foreground">Password strength:</span>
        <span 
          className="font-medium"
          style={{ color: strength.color }}
        >
          {strength.label}
        </span>
      </div>
    </div>
  );
};

export default PasswordStrengthMeter;