import { cn } from '@/lib/utils';
import type { InputHTMLAttributes } from 'react';

export const Input = ({ className, ...props }: InputHTMLAttributes<HTMLInputElement>) => (
  <input
    className={cn('h-10 w-full rounded-lg border border-border bg-[#0b1020] px-3 text-sm outline-none focus:border-accent', className)}
    {...props}
  />
);
