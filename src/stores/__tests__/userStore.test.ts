import { describe, it, expect, beforeEach } from 'vitest'
import { act } from '@testing-library/react'
import { useUserStore, User } from '../userStore'

describe('Feature: User State Management', () => {
  beforeEach(() => {
    // Reset the store to initial state before each test
    act(() => {
      useUserStore.setState({
        user: {
          id: 'default-user',
          displayName: 'User',
          measurementStyle: 'metric',
          createdAt: new Date('2024-01-01'),
          updatedAt: new Date('2024-01-01'),
        },
      })
    })
  })

  describe('Scenario: Initial user state', () => {
    it('should have default user when store is initialized', () => {
      // Given - Fresh store state
      const { user } = useUserStore.getState()

      // Then - Should have default user
      expect(user).not.toBeNull()
      expect(user?.id).toBe('default-user')
      expect(user?.displayName).toBe('User')
      expect(user?.measurementStyle).toBe('metric')
      expect(user?.profilePicture).toBeUndefined()
    })

    it('should provide all required methods', () => {
      // Given - Store state
      const state = useUserStore.getState()

      // Then - Should have all methods
      expect(typeof state.setUser).toBe('function')
      expect(typeof state.updateUser).toBe('function')
      expect(typeof state.clearUser).toBe('function')
      expect(state.user).toBeDefined()
    })
  })

  describe('Scenario: Setting user data', () => {
    it('should set complete user data when setUser is called', () => {
      // Given - New user data
      const newUser: User = {
        id: '123e4567-e89b-12d3-a456-426614174000',
        displayName: 'John Doe',
        profilePicture: 'https://example.com/avatar.jpg',
        measurementStyle: 'us',
        createdAt: new Date('2024-01-15'),
        updatedAt: new Date('2024-01-15'),
      }

      // When - setUser is called
      act(() => {
        useUserStore.getState().setUser(newUser)
      })

      // Then - User should be updated completely
      const { user } = useUserStore.getState()
      expect(user).toEqual(newUser)
      expect(user?.id).toBe('123e4567-e89b-12d3-a456-426614174000')
      expect(user?.displayName).toBe('John Doe')
      expect(user?.profilePicture).toBe('https://example.com/avatar.jpg')
      expect(user?.measurementStyle).toBe('us')
    })

    it('should handle user with minimal required fields', () => {
      // Given - User with only required fields
      const minimalUser: User = {
        id: 'minimal-user',
        displayName: 'Minimal User',
        measurementStyle: 'metric',
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date('2024-01-01'),
      }

      // When - setUser is called
      act(() => {
        useUserStore.getState().setUser(minimalUser)
      })

      // Then - User should be set correctly
      const { user } = useUserStore.getState()
      expect(user?.id).toBe('minimal-user')
      expect(user?.displayName).toBe('Minimal User')
      expect(user?.profilePicture).toBeUndefined()
      expect(user?.measurementStyle).toBe('metric')
    })
  })

  describe('Scenario: Updating user data', () => {
    it('should update display name and set new updatedAt timestamp', () => {
      // Given - Initial user state and current time before update
      const beforeUpdateTime = new Date()

      // When - updateUser is called with display name change
      act(() => {
        useUserStore.getState().updateUser({ displayName: 'Updated Name' })
      })

      // Then - Display name should be updated with new timestamp
      const { user } = useUserStore.getState()
      expect(user?.displayName).toBe('Updated Name')
      expect(user?.id).toBe('default-user') // Should remain unchanged
      expect(user?.measurementStyle).toBe('metric') // Should remain unchanged
      expect(user?.updatedAt.getTime()).toBeGreaterThanOrEqual(beforeUpdateTime.getTime())
    })

    it('should update measurement style preference', () => {
      // Given - User with metric preference
      expect(useUserStore.getState().user?.measurementStyle).toBe('metric')

      // When - updateUser is called to change to US measurements
      act(() => {
        useUserStore.getState().updateUser({ measurementStyle: 'us' })
      })

      // Then - Measurement style should be updated
      const { user } = useUserStore.getState()
      expect(user?.measurementStyle).toBe('us')
      expect(user?.displayName).toBe('User') // Other fields unchanged
      expect(user?.id).toBe('default-user')
    })

    it('should update profile picture URL', () => {
      // Given - User without profile picture
      expect(useUserStore.getState().user?.profilePicture).toBeUndefined()

      // When - updateUser is called with profile picture
      const profilePictureUrl = 'https://example.com/new-avatar.jpg'
      act(() => {
        useUserStore.getState().updateUser({ profilePicture: profilePictureUrl })
      })

      // Then - Profile picture should be set
      const { user } = useUserStore.getState()
      expect(user?.profilePicture).toBe(profilePictureUrl)
    })

    it('should update multiple fields at once', () => {
      // Given - Current user state
      const beforeTime = new Date()

      // When - updateUser is called with multiple changes
      const updates = {
        displayName: 'Multi Update User',
        measurementStyle: 'us' as const,
        profilePicture: 'https://example.com/multi.jpg',
      }
      act(() => {
        useUserStore.getState().updateUser(updates)
      })

      // Then - All fields should be updated
      const { user } = useUserStore.getState()
      expect(user?.displayName).toBe('Multi Update User')
      expect(user?.measurementStyle).toBe('us')
      expect(user?.profilePicture).toBe('https://example.com/multi.jpg')
      expect(user?.id).toBe('default-user') // Should remain unchanged
      expect(user?.updatedAt.getTime()).toBeGreaterThanOrEqual(beforeTime.getTime())
    })

    it('should handle empty updates gracefully', () => {
      // Given - Current user state and timestamp
      const originalUser = useUserStore.getState().user
      const beforeTime = new Date()

      // When - updateUser is called with empty object
      act(() => {
        useUserStore.getState().updateUser({})
      })

      // Then - Only updatedAt should change
      const { user } = useUserStore.getState()
      expect(user?.id).toBe(originalUser?.id)
      expect(user?.displayName).toBe(originalUser?.displayName)
      expect(user?.measurementStyle).toBe(originalUser?.measurementStyle)
      expect(user?.profilePicture).toBe(originalUser?.profilePicture)
      expect(user?.updatedAt.getTime()).toBeGreaterThanOrEqual(beforeTime.getTime())
    })

    it('should not update when user is null', () => {
      // Given - Cleared user state
      act(() => {
        useUserStore.getState().clearUser()
      })
      expect(useUserStore.getState().user).toBeNull()

      // When - updateUser is called with null user
      act(() => {
        useUserStore.getState().updateUser({ displayName: 'Should Not Update' })
      })

      // Then - User should remain null
      expect(useUserStore.getState().user).toBeNull()
    })
  })

  describe('Scenario: Clearing user data', () => {
    it('should set user to null when clearUser is called', () => {
      // Given - User with data
      const userWithData: User = {
        id: 'test-user',
        displayName: 'Test User',
        profilePicture: 'https://example.com/test.jpg',
        measurementStyle: 'us',
        createdAt: new Date(),
        updatedAt: new Date(),
      }
      act(() => {
        useUserStore.getState().setUser(userWithData)
      })
      expect(useUserStore.getState().user).not.toBeNull()

      // When - clearUser is called
      act(() => {
        useUserStore.getState().clearUser()
      })

      // Then - User should be null
      expect(useUserStore.getState().user).toBeNull()
    })

    it('should handle clearing already null user', () => {
      // Given - Already null user
      act(() => {
        useUserStore.getState().clearUser()
      })
      expect(useUserStore.getState().user).toBeNull()

      // When - clearUser is called again
      act(() => {
        useUserStore.getState().clearUser()
      })

      // Then - User should remain null without error
      expect(useUserStore.getState().user).toBeNull()
    })
  })

  describe('Scenario: State persistence behavior', () => {
    it('should maintain state consistency across multiple operations', () => {
      // Given - Series of operations
      const testUser: User = {
        id: 'consistency-test',
        displayName: 'Consistency Test',
        measurementStyle: 'metric',
        createdAt: new Date(),
        updatedAt: new Date(),
      }

      // When - Multiple operations are performed
      act(() => {
        const { setUser, updateUser, clearUser } = useUserStore.getState()
        setUser(testUser)
        updateUser({ displayName: 'Updated' })
        updateUser({ measurementStyle: 'us' })
        // Don't clear - should maintain state
      })

      // Then - Final state should be consistent
      const { user } = useUserStore.getState()
      expect(user?.id).toBe('consistency-test')
      expect(user?.displayName).toBe('Updated')
      expect(user?.measurementStyle).toBe('us')
    })

    it('should handle rapid successive updates correctly', () => {
      // Given - Initial state
      const { updateUser } = useUserStore.getState()

      // When - Rapid successive updates
      act(() => {
        updateUser({ displayName: 'First' })
        updateUser({ displayName: 'Second' })
        updateUser({ measurementStyle: 'us' })
        updateUser({ displayName: 'Final' })
      })

      // Then - Should have final values
      const { user } = useUserStore.getState()
      expect(user?.displayName).toBe('Final')
      expect(user?.measurementStyle).toBe('us')
    })
  })

  describe('Scenario: TypeScript interface compliance', () => {
    it('should accept valid User objects with all fields', () => {
      // Given - Complete user object
      const completeUser: User = {
        id: 'complete-user',
        displayName: 'Complete User',
        profilePicture: 'https://example.com/complete.jpg',
        measurementStyle: 'metric',
        createdAt: new Date('2024-01-01T10:00:00Z'),
        updatedAt: new Date('2024-01-01T10:00:00Z'),
      }

      // When - User is set
      act(() => {
        useUserStore.getState().setUser(completeUser)
      })

      // Then - All fields should be accessible and correct
      const { user } = useUserStore.getState()
      expect(user?.id).toBe('complete-user')
      expect(user?.displayName).toBe('Complete User')
      expect(user?.profilePicture).toBe('https://example.com/complete.jpg')
      expect(user?.measurementStyle).toBe('metric')
      expect(user?.createdAt).toEqual(new Date('2024-01-01T10:00:00Z'))
      expect(user?.updatedAt).toEqual(new Date('2024-01-01T10:00:00Z'))
    })

    it('should handle partial updates with proper typing', () => {
      // Given - Existing user
      const { updateUser } = useUserStore.getState()

      // When - Partial update is applied
      act(() => {
        updateUser({
          displayName: 'Partial Update',
          profilePicture: 'https://example.com/partial.jpg',
        })
      })

      // Then - Updated fields should be correct, others unchanged
      const { user } = useUserStore.getState()
      expect(user?.displayName).toBe('Partial Update')
      expect(user?.profilePicture).toBe('https://example.com/partial.jpg')
      expect(user?.id).toBe('default-user') // Unchanged
      expect(user?.measurementStyle).toBe('metric') // Unchanged
    })
  })
})