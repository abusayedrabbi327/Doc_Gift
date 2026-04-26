import { ButtonHTMLAttributes } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'outline';
  size?: 'sm' | 'md' | 'lg';
}

export function Button({
  variant = 'primary',
  size = 'md',
  className = '',
  children,
  disabled,
  ...props
}: ButtonProps) {
  const baseStyles = 'rounded-xl transition-all duration-200 inline-flex items-center justify-center gap-2';

  const variants = {
    primary: 'bg-primary text-primary-foreground hover:opacity-90 shadow-sm',
    secondary: 'bg-secondary text-secondary-foreground hover:opacity-90 shadow-sm',
    danger: 'bg-destructive text-destructive-foreground hover:opacity-90 shadow-sm',
    outline: 'border-2 border-primary text-primary hover:bg-primary hover:text-primary-foreground'
  };

  const sizes = {
    sm: 'px-4 py-2',
    md: 'px-6 py-3',
    lg: 'px-8 py-4'
  };

  const disabledStyles = 'opacity-50 cursor-not-allowed';

  return (
    <button
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${disabled ? disabledStyles : ''} ${className}`}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
}
