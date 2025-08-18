import React from 'react'

export interface MaterialTopBarProps {
  title: string
  onMenuClick?: () => void
  actions?: React.ReactNode
  className?: string
  showMenuButton?: boolean
}

export const MaterialTopBar: React.FC<MaterialTopBarProps> = ({
  title,
  onMenuClick,
  actions,
  className = '',
  showMenuButton = true
}) => {
  const baseClasses = 'bg-surface-0 shadow-material-1 px-md py-sm flex items-center justify-between'
  
  const classes = [baseClasses, className].filter(Boolean).join(' ')
  
  const MenuIcon = () => (
    <svg 
      className="w-6 h-6" 
      fill="none" 
      stroke="currentColor" 
      viewBox="0 0 24 24"
    >
      <path 
        strokeLinecap="round" 
        strokeLinejoin="round" 
        strokeWidth={2} 
        d="M4 6h16M4 12h16M4 18h16" 
      />
    </svg>
  )
  
  return (
    <header className={classes}>
      <div className="flex items-center space-x-md">
        {showMenuButton && onMenuClick && (
          <button
            onClick={onMenuClick}
            className="p-xs rounded-md hover:bg-surface-2 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary-A400 focus:ring-offset-2"
            aria-label="Menu"
          >
            <MenuIcon />
          </button>
        )}
        
        <h1 className="text-lg font-medium text-on-surface-1">
          {title}
        </h1>
      </div>
      
      {actions && (
        <div className="flex items-center space-x-sm">
          {actions}
        </div>
      )}
    </header>
  )
}
