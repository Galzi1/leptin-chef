import React, { useEffect } from 'react'

export interface MaterialNavigationDrawerProps {
  open: boolean
  onClose?: () => void
  children: React.ReactNode
  className?: string
  width?: 'narrow' | 'medium' | 'wide'
}

export const MaterialNavigationDrawer: React.FC<MaterialNavigationDrawerProps> = ({
  open,
  onClose,
  children,
  className = '',
  width = 'medium'
}) => {
  const widthClasses = {
    narrow: 'w-64',
    medium: 'w-80',
    wide: 'w-96'
  }
  
  const baseClasses = 'bg-surface-0 shadow-material-2 h-full transform transition-transform duration-300 ease-in-out fixed top-0 left-0 z-50'
  
  const transformClasses = open ? 'translate-x-0' : '-translate-x-full'
  
  const classes = [
    baseClasses,
    widthClasses[width],
    transformClasses,
    className
  ].filter(Boolean).join(' ')
  
  // Handle escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && open && onClose) {
        onClose()
      }
    }
    
    if (open) {
      document.addEventListener('keydown', handleEscape)
      // Prevent body scroll when drawer is open
      document.body.style.overflow = 'hidden'
    }
    
    return () => {
      document.removeEventListener('keydown', handleEscape)
      document.body.style.overflow = 'unset'
    }
  }, [open, onClose])
  
  if (!open) {
    return null
  }
  
  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50 z-40"
        onClick={onClose}
        role="presentation"
        aria-hidden="true"
      />
      
      {/* Drawer */}
      <nav
        className={classes}
        role="navigation"
        aria-label="Main navigation"
      >
        <div className="h-full overflow-y-auto">
          {children}
        </div>
      </nav>
    </>
  )
}
