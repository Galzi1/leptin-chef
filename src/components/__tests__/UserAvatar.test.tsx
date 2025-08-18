import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@/test/utils'
import { createMockUser } from '@/test/utils'
import UserAvatar from '../UserAvatar'

// Mock the user store
vi.mock('@/stores/userStore', () => ({
  useUserStore: vi.fn(),
}))

import { useUserStore } from '@/stores/userStore'

describe('UserAvatar', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('displays first letter of user name when no profile picture', () => {
    const mockUser = createMockUser({ displayName: 'John Doe' })
    vi.mocked(useUserStore).mockReturnValue({ user: mockUser })

    render(<UserAvatar />)
    const avatar = screen.getByText('J')
    expect(avatar).toBeInTheDocument()
  })

  it('has correct styling for text avatar', () => {
    const mockUser = createMockUser({ displayName: 'John Doe' })
    vi.mocked(useUserStore).mockReturnValue({ user: mockUser })

    render(<UserAvatar />)
    const avatarContainer = screen.getByText('J').parentElement
    expect(avatarContainer).toHaveClass('w-10', 'h-10', 'rounded-full', 'bg-primary-A400')
  })

  it('displays profile picture when available', () => {
    const mockUser = createMockUser({
      displayName: 'Test User',
      profilePicture: 'https://example.com/avatar.jpg',
    })
    vi.mocked(useUserStore).mockReturnValue({ user: mockUser })

    render(<UserAvatar />)
    const avatarImage = screen.getByAltText('Test User')
    expect(avatarImage).toBeInTheDocument()
    expect(avatarImage).toHaveAttribute('src', 'https://example.com/avatar.jpg')
  })

  it('falls back to "User" when no display name', () => {
    const mockUser = createMockUser({ displayName: '' })
    vi.mocked(useUserStore).mockReturnValue({ user: mockUser })

    render(<UserAvatar />)
    expect(screen.getByText('U')).toBeInTheDocument()
  })
})

