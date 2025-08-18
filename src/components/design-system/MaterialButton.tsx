import React from 'react'

export interface MaterialButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'outlined' | 'text'
  size?: 'small' | 'medium' | 'large'
  children: React.ReactNode
  className?: string
}

export const MaterialButton: React.FC<MaterialButtonProps> = ({
  variant = 'primary',
  size = 'medium',
  children,
  className = '',
  disabled = false,
  ...props
}) => {
  const baseClasses = 'font-medium transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2'
  
  const variantClasses = {
    primary: 'bg-primary-A400 text-white hover:bg-primary-A700 focus:ring-primary-A400',
    outlined: 'border border-primary-A400 text-primary-A400 bg-transparent hover:bg-primary-A400 hover:text-white focus:ring-primary-A400',
    text: 'text-primary-A400 bg-transparent hover:bg-primary-50 focus:ring-primary-A400'
  }
  
  const sizeClasses = {
    small: 'px-sm py-xs text-sm rounded-sm',
    medium: 'px-lg py-sm text-base rounded-md',
    large: 'px-xl py-md text-lg rounded-lg'
  }
  
  const disabledClasses = disabled 
    ? 'opacity-50 cursor-not-allowed' 
    : 'cursor-pointer'
  
  const classes = [
    baseClasses,
    variantClasses[variant],
    sizeClasses[size],
    disabledClasses,
    className
  ].filter(Boolean).join(' ')
  
  return (
    <button
      className={classes}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  )
}
