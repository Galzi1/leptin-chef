import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@/test/utils'
import TopBar from '../TopBar'

// Mock the navigation store
vi.mock('@/stores/navigationStore', () => ({
  useNavigationStore: vi.fn(),
}))

import { useNavigationStore } from '@/stores/navigationStore'

describe('TopBar', () => {
  const mockToggleDrawer = vi.fn()

  beforeEach(() => {
    vi.clearAllMocks()
    vi.mocked(useNavigationStore).mockReturnValue({
      isDrawerOpen: false,
      toggleDrawer: mockToggleDrawer,
      openDrawer: vi.fn(),
      closeDrawer: vi.fn(),
    })
  })

  it('renders hamburger menu button', () => {
    render(<TopBar />)
    const menuButton = screen.getByLabelText('Toggle navigation menu')
    expect(menuButton).toBeInTheDocument()
  })

  it('displays correct page title for home page', () => {
    render(<TopBar />)
    expect(screen.getByText('Home')).toBeInTheDocument()
  })

  it('contains menu icon', () => {
    render(<TopBar />)
    const menuIcon = screen.getByText('menu')
    expect(menuIcon).toBeInTheDocument()
    expect(menuIcon).toHaveClass('material-icons')
  })

  it('calls toggleDrawer when hamburger button is clicked', () => {
    render(<TopBar />)
    const menuButton = screen.getByLabelText('Toggle navigation menu')
    
    fireEvent.click(menuButton)
    
    expect(mockToggleDrawer).toHaveBeenCalledTimes(1)
  })

  it('has proper accessibility attributes', () => {
    render(<TopBar />)
    const menuButton = screen.getByLabelText('Toggle navigation menu')
    
    expect(menuButton).toHaveAttribute('aria-label', 'Toggle navigation menu')
  })

  it('has proper styling classes', () => {
    render(<TopBar />)
    const menuButton = screen.getByLabelText('Toggle navigation menu')
    
    expect(menuButton).toHaveClass('p-sm', 'rounded-md', 'hover:bg-surface-2', 'transition-colors', 'duration-200')
  })

  it('displays correct page title for home page', () => {
    render(<TopBar />)
    expect(screen.getByText('Home')).toBeInTheDocument()
  })
})

