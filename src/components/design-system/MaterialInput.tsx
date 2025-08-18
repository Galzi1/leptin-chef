import React, { forwardRef } from 'react'

export interface MaterialInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'> {
  label?: string
  error?: string
  helperText?: string
  size?: 'small' | 'medium' | 'large'
  fullWidth?: boolean
  required?: boolean
}

export const MaterialInput = forwardRef<HTMLInputElement, MaterialInputProps>(({
  label,
  error,
  helperText,
  size = 'medium',
  fullWidth = true,
  required = false,
  className = '',
  id,
  ...props
}, ref) => {
  const inputId = id || `input-${Math.random().toString(36).substr(2, 9)}`
  
  const baseClasses = 'border rounded-md transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-0'
  
  const sizeClasses = {
    small: 'px-sm py-xs text-sm',
    medium: 'px-md py-sm text-base',
    large: 'px-lg py-md text-lg'
  }
  
  const stateClasses = error
    ? 'border-red-500 focus:ring-red-500 focus:border-red-500'
    : 'border-surface-4 focus:ring-primary-A400 focus:border-primary-A400'
  
  const widthClasses = fullWidth ? 'w-full' : ''
  
  const inputClasses = [
    baseClasses,
    sizeClasses[size],
    stateClasses,
    widthClasses,
    className
  ].filter(Boolean).join(' ')
  
  return (
    <div className={`${fullWidth ? 'w-full' : ''} space-y-xs`}>
      {label && (
        <label 
          htmlFor={inputId}
          className="block text-sm font-medium text-on-surface-1"
        >
          {label}
          {required && <span className="text-red-500 ml-xs">*</span>}
        </label>
      )}
      
      <input
        ref={ref}
        id={inputId}
        className={inputClasses}
        required={required}
        aria-invalid={error ? 'true' : 'false'}
        aria-describedby={error ? `${inputId}-error` : helperText ? `${inputId}-helper` : undefined}
        {...props}
      />
      
      {error && (
        <p 
          id={`${inputId}-error`}
          className="text-sm text-red-500"
          role="alert"
        >
          {error}
        </p>
      )}
      
      {helperText && !error && (
        <p 
          id={`${inputId}-helper`}
          className="text-sm text-on-surface-4"
        >
          {helperText}
        </p>
      )}
    </div>
  )
})

MaterialInput.displayName = 'MaterialInput'
