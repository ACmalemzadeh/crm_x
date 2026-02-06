import type { ButtonHTMLAttributes, ReactNode } from 'react'

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'primary' | 'link'
  children: ReactNode
}

export function Button({
  variant = 'primary',
  children,
  className = '',
  ...props
}: ButtonProps) {
  const baseClass = variant === 'link' ? 'link' : 'btn'
  return (
    <button className={`${baseClass} ${className}`} {...props}>
      {children}
    </button>
  )
}
