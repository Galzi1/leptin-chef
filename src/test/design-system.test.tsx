import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { 
  MaterialButton,
  MaterialCard,
  MaterialInput,
  MaterialListItem,
  MaterialTopBar,
  MaterialNavigationDrawer
} from '../components/design-system'

describe('Design System Components', () => {
  describe('MaterialButton', () => {
    it('renders primary button with correct styling', () => {
      render(<MaterialButton>Click me</MaterialButton>)
      const button = screen.getByRole('button', { name: /click me/i })
      expect(button).toBeInTheDocument()
      expect(button).toHaveClass('bg-primary-A400', 'text-white')
    })

    it('renders outlined button variant', () => {
      render(<MaterialButton variant="outlined">Outlined Button</MaterialButton>)
      const button = screen.getByRole('button', { name: /outlined button/i })
      expect(button).toHaveClass('border', 'border-primary-A400', 'text-primary-A400')
    })

    it('applies custom className', () => {
      render(<MaterialButton className="custom-class">Custom Button</MaterialButton>)
      const button = screen.getByRole('button', { name: /custom button/i })
      expect(button).toHaveClass('custom-class')
    })

    it('handles disabled state', () => {
      render(<MaterialButton disabled>Disabled Button</MaterialButton>)
      const button = screen.getByRole('button', { name: /disabled button/i })
      expect(button).toBeDisabled()
    })
  })

  describe('MaterialCard', () => {
    it('renders card with children content', () => {
      render(
        <MaterialCard>
          <div>Card content</div>
        </MaterialCard>
      )
      expect(screen.getByText('Card content')).toBeInTheDocument()
    })

    it('applies custom className', () => {
      render(<MaterialCard className="custom-card">Content</MaterialCard>)
      const card = screen.getByText('Content').closest('div')
      expect(card).toHaveClass('custom-card')
    })

    it('renders with elevation variant', () => {
      render(<MaterialCard elevation="high">Elevated Card</MaterialCard>)
      const card = screen.getByText('Elevated Card').closest('div')
      expect(card).toHaveClass('shadow-material-3')
    })
  })

  describe('MaterialInput', () => {
    it('renders input with label', () => {
      render(<MaterialInput label="Email" placeholder="Enter email" />)
      expect(screen.getByLabelText('Email')).toBeInTheDocument()
      expect(screen.getByPlaceholderText('Enter email')).toBeInTheDocument()
    })

    it('shows error state', () => {
      render(<MaterialInput label="Email" error="Invalid email" />)
      expect(screen.getByText('Invalid email')).toBeInTheDocument()
    })

    it('handles required field', () => {
      render(<MaterialInput label="Email" required />)
      const input = screen.getByLabelText(/Email/)
      expect(input).toBeRequired()
    })
  })

  describe('MaterialListItem', () => {
    it('renders list item with content', () => {
      render(<MaterialListItem>List item content</MaterialListItem>)
      expect(screen.getByText('List item content')).toBeInTheDocument()
    })

    it('handles click events', () => {
      const handleClick = vi.fn()
      render(<MaterialListItem onClick={handleClick}>Clickable item</MaterialListItem>)
      screen.getByText('Clickable item').click()
      expect(handleClick).toHaveBeenCalledOnce()
    })

    it('applies custom className', () => {
      render(<MaterialListItem className="custom-item">Content</MaterialListItem>)
      const item = screen.getByText('Content').closest('div')
      expect(item).toHaveClass('custom-item')
    })
  })

  describe('MaterialTopBar', () => {
    it('renders top bar with title', () => {
      render(<MaterialTopBar title="App Title" />)
      expect(screen.getByText('App Title')).toBeInTheDocument()
    })

    it('renders with navigation icon', () => {
      const onMenuClick = vi.fn()
      render(<MaterialTopBar title="Title" onMenuClick={onMenuClick} />)
      const menuButton = screen.getByRole('button', { name: /menu/i })
      expect(menuButton).toBeInTheDocument()
    })

    it('renders with action buttons', () => {
      render(
        <MaterialTopBar 
          title="Title" 
          actions={<button>Action</button>} 
        />
      )
      expect(screen.getByRole('button', { name: /action/i })).toBeInTheDocument()
    })
  })

  describe('MaterialNavigationDrawer', () => {
    it('renders navigation drawer when open', () => {
      render(
        <MaterialNavigationDrawer open>
          <div>Navigation content</div>
        </MaterialNavigationDrawer>
      )
      expect(screen.getByText('Navigation content')).toBeInTheDocument()
    })

    it('does not render when closed', () => {
      render(
        <MaterialNavigationDrawer open={false}>
          <div>Navigation content</div>
        </MaterialNavigationDrawer>
      )
      expect(screen.queryByText('Navigation content')).not.toBeInTheDocument()
    })

    it('handles close event', () => {
      const onClose = vi.fn()
      render(
        <MaterialNavigationDrawer open onClose={onClose}>
          <div>Content</div>
        </MaterialNavigationDrawer>
      )
      const overlay = document.querySelector('.fixed.inset-0.bg-black.bg-opacity-50') as HTMLElement
      expect(overlay).toBeInTheDocument()
      overlay.click()
      expect(onClose).toHaveBeenCalledOnce()
    })
  })
})

describe('Design System Utilities', () => {
  it('applies responsive container classes', () => {
    render(<div className="container-responsive">Content</div>)
    const container = screen.getByText('Content')
    expect(container).toHaveClass('container-responsive')
  })

  it('applies responsive text classes', () => {
    render(<div className="text-responsive">Text</div>)
    const text = screen.getByText('Text')
    expect(text).toHaveClass('text-responsive')
  })

  it('applies responsive spacing classes', () => {
    render(<div className="spacing-responsive">Content</div>)
    const content = screen.getByText('Content')
    expect(content).toHaveClass('spacing-responsive')
  })
})
