import { describe, it, expect } from 'vitest'
import { render, screen } from '@/test/utils'
import TopBar from '../TopBar'

describe('TopBar', () => {
  it('renders hamburger menu button', () => {
    render(<TopBar />)
    const menuButton = screen.getByLabelText('Toggle navigation menu')
    expect(menuButton).toBeInTheDocument()
  })

  it('displays correct page title for home page', () => {
    render(<TopBar />)
    expect(screen.getByText('Home')).toBeInTheDocument()
  })

  it('has proper Material Design styling', () => {
    render(<TopBar />)
    const header = screen.getByRole('banner')
    expect(header).toHaveClass('material-top-bar')
  })

  it('contains menu icon', () => {
    render(<TopBar />)
    const menuIcon = screen.getByText('menu')
    expect(menuIcon).toBeInTheDocument()
    expect(menuIcon).toHaveClass('material-icons')
  })
})

