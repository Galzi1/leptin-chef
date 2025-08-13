import { describe, it, expect } from 'vitest'
import { render, screen } from '@/test/utils'
import UserAvatar from '../UserAvatar'

describe('UserAvatar', () => {
  it('displays first letter of user name when no profile picture', () => {
    render(<UserAvatar />)
    const avatar = screen.getByText('U')
    expect(avatar).toBeInTheDocument()
  })

  it('has correct styling for text avatar', () => {
    render(<UserAvatar />)
    const avatarContainer = screen.getByText('U').parentElement
    expect(avatarContainer).toHaveClass('w-10', 'h-10', 'rounded-full', 'bg-primary-A400')
  })

  it('displays profile picture when available', () => {
    // Mock user with profile picture
    const mockUser = {
      id: 'test-user',
      displayName: 'Test User',
      profilePicture: 'https://example.com/avatar.jpg',
      measurementStyle: 'metric' as const,
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    // Mock the store
    vi.mock('@/stores/userStore', () => ({
      useUserStore: () => ({ user: mockUser }),
    }))

    render(<UserAvatar />)
    const avatarImage = screen.getByAltText('Test User')
    expect(avatarImage).toBeInTheDocument()
    expect(avatarImage).toHaveAttribute('src', 'https://example.com/avatar.jpg')
  })

  it('falls back to "User" when no display name', () => {
    const mockUser = {
      id: 'test-user',
      displayName: '',
      measurementStyle: 'metric' as const,
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    vi.mock('@/stores/userStore', () => ({
      useUserStore: () => ({ user: mockUser }),
    }))

    render(<UserAvatar />)
    expect(screen.getByText('U')).toBeInTheDocument()
  })
})

