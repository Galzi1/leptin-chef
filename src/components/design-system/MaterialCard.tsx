import React from 'react'

export interface MaterialCardProps {
  children: React.ReactNode
  elevation?: 'low' | 'medium' | 'high' | 'none'
  className?: string
  padding?: 'none' | 'small' | 'medium' | 'large'
}

export const MaterialCard: React.FC<MaterialCardProps> = ({
  children,
  elevation = 'low',
  className = '',
  padding = 'medium'
}) => {
  const baseClasses = 'bg-surface-0 rounded-lg'
  
  const elevationClasses = {
    none: '',
    low: 'shadow-material-1',
    medium: 'shadow-material-2',
    high: 'shadow-material-3'
  }
  
  const paddingClasses = {
    none: '',
    small: 'p-sm',
    medium: 'p-md',
    large: 'p-lg'
  }
  
  const classes = [
    baseClasses,
    elevationClasses[elevation],
    paddingClasses[padding],
    className
  ].filter(Boolean).join(' ')
  
  return (
    <div className={classes}>
      {children}
    </div>
  )
}
