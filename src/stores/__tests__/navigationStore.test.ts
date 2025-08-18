import { describe, it, expect, beforeEach } from 'vitest'
import { act } from '@testing-library/react'
import { useNavigationStore } from '../navigationStore'

describe('NavigationStore', () => {
  beforeEach(() => {
    // Reset the store to initial state before each test
    act(() => {
      useNavigationStore.setState({
        isDrawerOpen: false,
        toggleDrawer: useNavigationStore.getState().toggleDrawer,
        openDrawer: useNavigationStore.getState().openDrawer,
        closeDrawer: useNavigationStore.getState().closeDrawer,
      })
    })
  })

  it('should have drawer closed by default', () => {
    const { isDrawerOpen } = useNavigationStore.getState()
    expect(isDrawerOpen).toBe(false)
  })

  it('should toggle drawer state when toggleDrawer is called', () => {
    const { toggleDrawer } = useNavigationStore.getState()
    
    // Initially closed
    expect(useNavigationStore.getState().isDrawerOpen).toBe(false)
    
    // Toggle to open
    act(() => {
      toggleDrawer()
    })
    expect(useNavigationStore.getState().isDrawerOpen).toBe(true)
    
    // Toggle to closed
    act(() => {
      toggleDrawer()
    })
    expect(useNavigationStore.getState().isDrawerOpen).toBe(false)
  })

  it('should open drawer when openDrawer is called', () => {
    const { openDrawer } = useNavigationStore.getState()
    
    // Initially closed
    expect(useNavigationStore.getState().isDrawerOpen).toBe(false)
    
    // Open drawer
    act(() => {
      openDrawer()
    })
    expect(useNavigationStore.getState().isDrawerOpen).toBe(true)
    
    // Should remain open if called again
    act(() => {
      openDrawer()
    })
    expect(useNavigationStore.getState().isDrawerOpen).toBe(true)
  })

  it('should close drawer when closeDrawer is called', () => {
    const { closeDrawer, openDrawer } = useNavigationStore.getState()
    
    // First open the drawer
    act(() => {
      openDrawer()
    })
    expect(useNavigationStore.getState().isDrawerOpen).toBe(true)
    
    // Close drawer
    act(() => {
      closeDrawer()
    })
    expect(useNavigationStore.getState().isDrawerOpen).toBe(false)
    
    // Should remain closed if called again
    act(() => {
      closeDrawer()
    })
    expect(useNavigationStore.getState().isDrawerOpen).toBe(false)
  })

  it('should provide all required methods', () => {
    const state = useNavigationStore.getState()
    
    expect(typeof state.toggleDrawer).toBe('function')
    expect(typeof state.openDrawer).toBe('function')
    expect(typeof state.closeDrawer).toBe('function')
    expect(typeof state.isDrawerOpen).toBe('boolean')
  })

  it('should maintain state consistency across multiple toggles', () => {
    const { toggleDrawer } = useNavigationStore.getState()
    
    // Perform multiple toggles
    act(() => {
      toggleDrawer() // false -> true
      toggleDrawer() // true -> false
      toggleDrawer() // false -> true
      toggleDrawer() // true -> false
    })
    
    expect(useNavigationStore.getState().isDrawerOpen).toBe(false)
  })

  it('should handle rapid successive calls correctly', () => {
    const { toggleDrawer, openDrawer, closeDrawer } = useNavigationStore.getState()
    
    // Rapid successive calls
    act(() => {
      openDrawer()
      closeDrawer()
      openDrawer()
      toggleDrawer()
    })
    
    // Should end up closed (open -> close -> open -> toggle(open->close))
    expect(useNavigationStore.getState().isDrawerOpen).toBe(false)
  })
})
