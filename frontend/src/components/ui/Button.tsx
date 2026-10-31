import React from 'react';
import { Loader2 } from 'lucide-react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'ghost' | 'danger' | 'outline' | 'secondary';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  icon?: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  loading = false,
  icon,
  className = '',
  disabled,
  ...props
}) => {
  let baseStyles = 'inline-flex items-center justify-center font-semibold rounded-xl transition cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed select-none gap-2';
  
  let sizeStyles = 'px-4 py-2.5 text-sm';
  if (size === 'sm') sizeStyles = 'px-3 py-1.5 text-xs';
  if (size === 'lg') sizeStyles = 'px-5 py-3 text-base';

  let variantStyles = 'bg-violet-600 text-white hover:bg-violet-700 shadow-xs shadow-violet-200';
  if (variant === 'ghost') {
    variantStyles = 'bg-transparent text-slate-700 hover:bg-slate-100 hover:text-slate-900 border border-slate-200';
  } else if (variant === 'outline') {
    variantStyles = 'bg-white text-violet-700 border border-violet-200 hover:bg-violet-50';
  } else if (variant === 'secondary') {
    variantStyles = 'bg-slate-100 text-slate-700 hover:bg-slate-200 border border-transparent';
  } else if (variant === 'danger') {
    variantStyles = 'bg-rose-600 text-white hover:bg-rose-700 shadow-xs shadow-rose-200';
  }

  return (
    <button
      disabled={disabled || loading}
      className={`${baseStyles} ${sizeStyles} ${variantStyles} ${className}`}
      {...props}
    >
      {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : icon}
      {children}
    </button>
  );
};
