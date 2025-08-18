import React from 'react'

export interface MaterialListItemProps {
  children: React.ReactNode
  onClick?: () => void
  className?: string
  disabled?: boolean
  selected?: boolean
  dense?: boolean
}

export const MaterialListItem: React.FC<MaterialListItemProps> = ({
  children,
  onClick,
  className = '',
  disabled = false,
  selected = false,
  dense = false
}) => {
  const baseClasses = 'flex items-center transition-colors duration-200'
  
  const stateClasses = disabled
    ? 'opacity-50 cursor-not-allowed'
    : onClick
    ? 'cursor-pointer hover:bg-surface-2'
    : ''
  
  const selectedClasses = selected ? 'bg-primary-50 text-primary-A400' : ''
  
  const paddingClasses = dense ? 'px-sm py-xs' : 'px-md py-sm'
  
  const classes = [
    baseClasses,
    paddingClasses,
    stateClasses,
    selectedClasses,
    className
  ].filter(Boolean).join(' ')
  
  const handleClick = () => {
    if (!disabled && onClick) {
      onClick()
    }
  }
  
  return (
    <div
      className={classes}
      onClick={handleClick}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick && !disabled ? 0 : undefined}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          handleClick()
        }
      }}
    >
      {children}
    </div>
  )
}
