'use client'
import { cn } from '@/lib/utils'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger'
  size?: 'sm' | 'md' | 'lg'
  as?: 'button' | 'a'
  href?: string
}

export default function Button({
  variant = 'primary',
  size = 'md',
  className,
  children,
  ...props
}: ButtonProps) {
  const base = 'inline-flex items-center justify-center gap-2 font-medium rounded-md transition-colors duration-150 disabled:opacity-50 disabled:cursor-not-allowed'

  const variants = {
    primary: 'bg-primary text-white hover:bg-primary-dark',
    secondary: 'bg-transparent text-primary border border-primary border-[1.5px] hover:bg-primary-light',
    ghost: 'bg-transparent text-neutral-900 border border-neutral-100 hover:bg-surface',
    danger: 'bg-transparent text-danger border border-red-200 hover:bg-red-50',
  }

  const sizes = {
    sm: 'px-3 py-[7px] text-[12px]',
    md: 'px-5 py-[10px] text-[14px]',
    lg: 'px-6 py-[12px] text-[15px]',
  }

  return (
    <button className={cn(base, variants[variant], sizes[size], className)} {...props}>
      {children}
    </button>
  )
}
