import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@/test/utils'
import { createMockUser } from '@/test/utils'
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

describe('NavigationDrawer', () => {
  const mockCloseDrawer = vi.fn()

  beforeEach(() => {
    vi.clearAllMocks()
    
    // Mock user store
    const mockUser = createMockUser({ displayName: 'Test User' })
    vi.mocked(useUserStore).mockReturnValue({ user: mockUser })
    
    // Mock navigation store
    vi.mocked(useNavigationStore).mockReturnValue({
      isDrawerOpen: false,
      toggleDrawer: vi.fn(),
      openDrawer: vi.fn(),
      closeDrawer: mockCloseDrawer,
    })
  })

  it('renders navigation drawer with user avatar', () => {
    render(<NavigationDrawer />)
    
    expect(screen.getByText('Leptin Chef')).toBeInTheDocument()
    expect(screen.getByText('AI Cooking Assistant')).toBeInTheDocument()
    expect(screen.getByText('T')).toBeInTheDocument() // First letter of "Test User"
  })

  it('renders all navigation items', () => {
    render(<NavigationDrawer />)
    
    expect(screen.getByText('Home')).toBeInTheDocument()
    expect(screen.getByText('Conversations')).toBeInTheDocument()
    expect(screen.getByText('Saved Recipes')).toBeInTheDocument()
    expect(screen.getByText('My Inventory')).toBeInTheDocument()
    expect(screen.getByText('User Settings')).toBeInTheDocument()
  })

  it('has correct CSS classes when drawer is closed', () => {
    vi.mocked(useNavigationStore).mockReturnValue({
      isDrawerOpen: false,
      toggleDrawer: vi.fn(),
      openDrawer: vi.fn(),
      closeDrawer: mockCloseDrawer,
    })

    render(<NavigationDrawer />)
    const drawer = screen.getByRole('navigation')
    
    expect(drawer).toHaveClass('-translate-x-full')
    expect(drawer).not.toHaveClass('translate-x-0')
  })

  it('has correct CSS classes when drawer is open', () => {
    vi.mocked(useNavigationStore).mockReturnValue({
      isDrawerOpen: true,
      toggleDrawer: vi.fn(),
      openDrawer: vi.fn(),
      closeDrawer: mockCloseDrawer,
    })

    render(<NavigationDrawer />)
    const drawer = screen.getByRole('navigation')
    
    expect(drawer).toHaveClass('translate-x-0')
    expect(drawer).not.toHaveClass('-translate-x-full')
  })

  it('shows backdrop when drawer is open', () => {
    vi.mocked(useNavigationStore).mockReturnValue({
      isDrawerOpen: true,
      toggleDrawer: vi.fn(),
      openDrawer: vi.fn(),
      closeDrawer: mockCloseDrawer,
    })

    render(<NavigationDrawer />)
    
    // Backdrop should be present when drawer is open
    const backdrop = document.querySelector('.fixed.inset-0.bg-black.bg-opacity-50')
    expect(backdrop).toBeInTheDocument()
  })

  it('does not show backdrop when drawer is closed', () => {
    vi.mocked(useNavigationStore).mockReturnValue({
      isDrawerOpen: false,
      toggleDrawer: vi.fn(),
      openDrawer: vi.fn(),
      closeDrawer: mockCloseDrawer,
    })

    render(<NavigationDrawer />)
    
    // Backdrop should not be present when drawer is closed
    const backdrop = document.querySelector('.fixed.inset-0.bg-black.bg-opacity-50')
    expect(backdrop).not.toBeInTheDocument()
  })

  it('calls closeDrawer when backdrop is clicked', () => {
    vi.mocked(useNavigationStore).mockReturnValue({
      isDrawerOpen: true,
      toggleDrawer: vi.fn(),
      openDrawer: vi.fn(),
      closeDrawer: mockCloseDrawer,
    })

    render(<NavigationDrawer />)
    
    const backdrop = document.querySelector('.fixed.inset-0.bg-black.bg-opacity-50')
    expect(backdrop).toBeInTheDocument()
    
    fireEvent.click(backdrop!)
    
    expect(mockCloseDrawer).toHaveBeenCalledTimes(1)
  })

  it('calls closeDrawer when navigation item is clicked', () => {
    render(<NavigationDrawer />)
    
    const homeLink = screen.getByText('Home')
    fireEvent.click(homeLink)
    
    expect(mockCloseDrawer).toHaveBeenCalledTimes(1)
  })

  it('calls closeDrawer when user settings link is clicked', () => {
    render(<NavigationDrawer />)
    
    const userSettingsLink = screen.getByText('User Settings')
    fireEvent.click(userSettingsLink)
    
    expect(mockCloseDrawer).toHaveBeenCalledTimes(1)
  })

  it('has proper navigation links with correct hrefs', () => {
    render(<NavigationDrawer />)
    
    const homeLink = screen.getByText('Home').closest('a')
    const conversationsLink = screen.getByText('Conversations').closest('a')
    const savedRecipesLink = screen.getByText('Saved Recipes').closest('a')
    const inventoryLink = screen.getByText('My Inventory').closest('a')
    const userSettingsLink = screen.getByText('User Settings').closest('a')
    
    expect(homeLink).toHaveAttribute('href', '/')
    expect(conversationsLink).toHaveAttribute('href', '/conversations')
    expect(savedRecipesLink).toHaveAttribute('href', '/saved-recipes')
    expect(inventoryLink).toHaveAttribute('href', '/inventory')
    expect(userSettingsLink).toHaveAttribute('href', '/user')
  })

  it('has proper material icons for navigation items', () => {
    render(<NavigationDrawer />)
    
    expect(screen.getByText('home')).toHaveClass('material-icons')
    expect(screen.getByText('chat')).toHaveClass('material-icons')
    expect(screen.getByText('bookmark')).toHaveClass('material-icons')
    expect(screen.getByText('inventory')).toHaveClass('material-icons')
    expect(screen.getByText('person')).toHaveClass('material-icons')
  })

  it('has proper responsive classes for desktop view', () => {
    render(<NavigationDrawer />)
    const drawer = screen.getByRole('navigation')
    
    expect(drawer).toHaveClass('lg:relative', 'lg:translate-x-0', 'lg:z-auto')
  })
})
