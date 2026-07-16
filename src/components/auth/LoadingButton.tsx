import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';

interface LoadingButtonProps {
  isLoading: boolean;
  children: React.ReactNode;
  onClick?: () => void;
  type?: 'button' | 'submit';
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';
  className?: string;
  disabled?: boolean;
}

const LoadingButton = ({ 
  isLoading, 
  children, 
  onClick, 
  type = 'button',
  variant = 'default',
  className,
  disabled
}: LoadingButtonProps) => {
  return (
    <Button
      type={type}
      variant={variant}
      className={className}
      onClick={onClick}
      disabled={isLoading || disabled}
    >
      {isLoading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
      {children}
    </Button>
  );
};

export default LoadingButton;