import { ReactNode } from 'react';

interface BadgeProps {
  children: ReactNode;
  variant?: 'pending' | 'processing' | 'delivered' | 'approved' | 'rejected' | 'default' | 'cancelled';
  className?: string;
}

export function Badge({ children, variant = 'default', className = '' }: BadgeProps) {
  const variants = {
    pending: 'bg-yellow-100 text-yellow-800',
    processing: 'bg-blue-100 text-blue-800',
    delivered: 'bg-[#22C55E]/20 text-[#22C55E]',
    approved: 'bg-[#22C55E]/20 text-[#22C55E]',
    rejected: 'bg-red-100 text-red-700',
    cancelled: 'bg-gray-100 text-gray-600',
    default: 'bg-muted text-muted-foreground'
  };

  return (
    <span className={`inline-flex items-center px-3 py-1 rounded-full ${variants[variant]} ${className}`}>
      {children}
    </span>
  );
}