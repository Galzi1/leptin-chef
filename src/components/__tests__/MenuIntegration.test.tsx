import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@/test/utils'
import { createMockUser } from '@/test/utils'
import TopBar from '../TopBar'
import NavigationDrawer from '../NavigationDrawer'

// Mock the navigation store
vi.mock('@/stores/navigationStore', () => ({
  useNavigationStore: vi.fn(),
}))

// Mock the user store
vi.mock('@/stores/userStore', () => ({
  useUserStore: vi.fn(),
}))

import { useNavigationStore } from '@/stores/navigationStore'
import { useUserStore } from '@/stores/userStore'

describe('Menu Integration', () => {
  const mockToggleDrawer = vi.fn()
  const mockCloseDrawer = vi.fn()

  beforeEach(() => {
    vi.clearAllMocks()
    
    // Mock user store
    const mockUser = createMockUser({ displayName: 'Test User' })
    vi.mocked(useUserStore).mockReturnValue({ user: mockUser })
    
    // Mock navigation store
    vi.mocked(useNavigationStore).mockReturnValue({
      isDrawerOpen: false,
      toggleDrawer: mockToggleDrawer,
      openDrawer: vi.fn(),
      closeDrawer: mockCloseDrawer,
    })
  })

  it('should start with menu closed by default', () => {
    render(
      <>
        <TopBar />
        <NavigationDrawer />
      </>
    )
    
    // Menu should be closed initially
    const drawer = screen.getByRole('navigation')
    expect(drawer).toHaveClass('-translate-x-full')
    expect(drawer).not.toHaveClass('translate-x-0')
    
    // No backdrop should be visible
    const backdrop = document.querySelector('.fixed.inset-0.bg-black.bg-opacity-50')
    expect(backdrop).not.toBeInTheDocument()
  })

  it('should open menu when hamburger button is clicked', () => {
    // Mock the store to return open state after toggle
    vi.mocked(useNavigationStore).mockReturnValue({
      isDrawerOpen: true,
      toggleDrawer: mockToggleDrawer,
      openDrawer: vi.fn(),
      closeDrawer: mockCloseDrawer,
    })

    render(
      <>
        <TopBar />
        <NavigationDrawer />
      </>
    )
    
    const menuButton = screen.getByLabelText('Toggle navigation menu')
    fireEvent.click(menuButton)
    
    expect(mockToggleDrawer).toHaveBeenCalledTimes(1)
    
    // Menu should be open
    const drawer = screen.getByRole('navigation')
    expect(drawer).toHaveClass('translate-x-0')
    expect(drawer).not.toHaveClass('-translate-x-full')
    
    // Backdrop should be visible
    const backdrop = document.querySelector('.fixed.inset-0.bg-black.bg-opacity-50')
    expect(backdrop).toBeInTheDocument()
  })

  it('should close menu when hamburger button is clicked again', () => {
    // Start with menu open
    vi.mocked(useNavigationStore).mockReturnValue({
      isDrawerOpen: true,
      toggleDrawer: mockToggleDrawer,
      openDrawer: vi.fn(),
      closeDrawer: mockCloseDrawer,
    })

    render(
      <>
        <TopBar />
        <NavigationDrawer />
      </>
    )
    
    const menuButton = screen.getByLabelText('Toggle navigation menu')
    fireEvent.click(menuButton)
    
    expect(mockToggleDrawer).toHaveBeenCalledTimes(1)
  })

  it('should close menu when backdrop is clicked', () => {
    // Start with menu open
    vi.mocked(useNavigationStore).mockReturnValue({
      isDrawerOpen: true,
      toggleDrawer: mockToggleDrawer,
      openDrawer: vi.fn(),
      closeDrawer: mockCloseDrawer,
    })

    render(
      <>
        <TopBar />
        <NavigationDrawer />
      </>
    )
    
    const backdrop = document.querySelector('.fixed.inset-0.bg-black.bg-opacity-50')
    expect(backdrop).toBeInTheDocument()
    
    fireEvent.click(backdrop!)
    
    expect(mockCloseDrawer).toHaveBeenCalledTimes(1)
  })

  it('should close menu when navigation item is clicked', () => {
    // Start with menu open
    vi.mocked(useNavigationStore).mockReturnValue({
      isDrawerOpen: true,
      toggleDrawer: mockToggleDrawer,
      openDrawer: vi.fn(),
      closeDrawer: mockCloseDrawer,
    })

    render(
      <>
        <TopBar />
        <NavigationDrawer />
      </>
    )
    
    // Use getAllByText and select the navigation link specifically
    const homeLinks = screen.getAllByText('Home')
    const homeNavigationLink = homeLinks.find(link => link.closest('a[href="/"]'))
    expect(homeNavigationLink).toBeInTheDocument()
    
    fireEvent.click(homeNavigationLink!)
    
    expect(mockCloseDrawer).toHaveBeenCalledTimes(1)
  })

  it('should maintain proper z-index layering', () => {
    // Start with menu open
    vi.mocked(useNavigationStore).mockReturnValue({
      isDrawerOpen: true,
      toggleDrawer: mockToggleDrawer,
      openDrawer: vi.fn(),
      closeDrawer: mockCloseDrawer,
    })

    render(
      <>
        <TopBar />
        <NavigationDrawer />
      </>
    )
    
    const backdrop = document.querySelector('.fixed.inset-0.bg-black.bg-opacity-50')
    const drawer = screen.getByRole('navigation')
    
    expect(backdrop).toHaveClass('z-40')
    expect(drawer).toHaveClass('z-50')
  })

  it('should have proper responsive behavior', () => {
    render(
      <>
        <TopBar />
        <NavigationDrawer />
      </>
    )
    
    const drawer = screen.getByRole('navigation')
    
    // Should have responsive classes for desktop
    expect(drawer).toHaveClass('lg:relative', 'lg:translate-x-0', 'lg:z-auto')
    
    // Backdrop should be hidden on desktop
    const backdrop = document.querySelector('.fixed.inset-0.bg-black.bg-opacity-50')
    if (backdrop) {
      expect(backdrop).toHaveClass('lg:hidden')
    }
  })

  it('should handle multiple rapid clicks correctly', () => {
    render(
      <>
        <TopBar />
        <NavigationDrawer />
      </>
    )
    
    const menuButton = screen.getByLabelText('Toggle navigation menu')
    
    // Rapid successive clicks
    fireEvent.click(menuButton)
    fireEvent.click(menuButton)
    fireEvent.click(menuButton)
    
    expect(mockToggleDrawer).toHaveBeenCalledTimes(3)
  })
})
