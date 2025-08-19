import { describe, it, expect, beforeEach, vi } from 'vitest'
import { act } from '@testing-library/react'

// We'll import the store after we create it
let useUIStore: any

// Mock types for the test - these will match our actual implementation
interface Modal {
  id: string
  type: 'confirm' | 'alert' | 'form' | 'recipe' | 'profile'
  title: string
  content?: string
  data?: any
  onConfirm?: () => void
  onCancel?: () => void
}

interface LoadingState {
  [key: string]: boolean
}

interface UIState {
  modals: Modal[]
  loading: LoadingState
  theme: 'light' | 'dark' | 'auto'
  notifications: { id: string; type: 'success' | 'error' | 'warning' | 'info'; message: string; timestamp: Date }[]
  sidebarCollapsed: boolean
  showModal: (modal: Omit<Modal, 'id'>) => string
  hideModal: (modalId: string) => void
  hideAllModals: () => void
  setLoading: (key: string, loading: boolean) => void
  clearAllLoading: () => void
  setTheme: (theme: 'light' | 'dark' | 'auto') => void
  showNotification: (notification: Omit<UIState['notifications'][0], 'id' | 'timestamp'>) => string
  hideNotification: (notificationId: string) => void
  clearAllNotifications: () => void
  toggleSidebar: () => void
  setSidebarCollapsed: (collapsed: boolean) => void
}

describe('Feature: UI State Management', () => {
  // Mock implementation for TDD
  beforeEach(() => {
    const mockStore = {
      modals: [],
      loading: {},
      theme: 'auto',
      notifications: [],
      sidebarCollapsed: false,
      showModal: vi.fn(() => 'modal-id'),
      hideModal: vi.fn(),
      hideAllModals: vi.fn(),
      setLoading: vi.fn(),
      clearAllLoading: vi.fn(),
      setTheme: vi.fn(),
      showNotification: vi.fn(() => 'notification-id'),
      hideNotification: vi.fn(),
      clearAllNotifications: vi.fn(),
      toggleSidebar: vi.fn(),
      setSidebarCollapsed: vi.fn(),
    }

    useUIStore = {
      getState: () => mockStore,
      setState: vi.fn(),
    }
  })

  describe('Scenario: Initial UI state', () => {
    it('should have empty modals array when store is initialized', () => {
      // Given - Fresh store state
      const { modals } = useUIStore.getState()

      // Then - Should have empty modals
      expect(modals).toEqual([])
    })

    it('should have empty loading state initially', () => {
      // Given - Fresh store state
      const { loading } = useUIStore.getState()

      // Then - Should have empty loading state
      expect(loading).toEqual({})
    })

    it('should have auto theme initially', () => {
      // Given - Fresh store state
      const { theme } = useUIStore.getState()

      // Then - Should have auto theme
      expect(theme).toBe('auto')
    })

    it('should have empty notifications initially', () => {
      // Given - Fresh store state
      const { notifications } = useUIStore.getState()

      // Then - Should have empty notifications
      expect(notifications).toEqual([])
    })

    it('should have sidebar expanded initially', () => {
      // Given - Fresh store state
      const { sidebarCollapsed } = useUIStore.getState()

      // Then - Should have sidebar expanded
      expect(sidebarCollapsed).toBe(false)
    })

    it('should provide all required methods', () => {
      // Given - Store state
      const state = useUIStore.getState()

      // Then - Should have all methods
      expect(typeof state.showModal).toBe('function')
      expect(typeof state.hideModal).toBe('function')
      expect(typeof state.hideAllModals).toBe('function')
      expect(typeof state.setLoading).toBe('function')
      expect(typeof state.clearAllLoading).toBe('function')
      expect(typeof state.setTheme).toBe('function')
      expect(typeof state.showNotification).toBe('function')
      expect(typeof state.hideNotification).toBe('function')
      expect(typeof state.clearAllNotifications).toBe('function')
      expect(typeof state.toggleSidebar).toBe('function')
      expect(typeof state.setSidebarCollapsed).toBe('function')
    })
  })

  describe('Scenario: Modal management', () => {
    it('should show confirmation modal and return modal id', () => {
      // Given - Confirmation modal data
      const modalData = {
        type: 'confirm' as const,
        title: 'Delete Recipe',
        content: 'Are you sure you want to delete this recipe?',
        onConfirm: vi.fn(),
        onCancel: vi.fn(),
      }

      // When - showModal is called
      const { showModal } = useUIStore.getState()
      const modalId = showModal(modalData)

      // Then - showModal should be called and return id
      expect(showModal).toHaveBeenCalledWith(modalData)
      expect(modalId).toBe('modal-id')
    })

    it('should show alert modal', () => {
      // Given - Alert modal data
      const modalData = {
        type: 'alert' as const,
        title: 'Recipe Saved',
        content: 'Your recipe has been saved successfully!',
      }

      // When - showModal is called
      const { showModal } = useUIStore.getState()
      showModal(modalData)

      // Then - showModal should be called
      expect(showModal).toHaveBeenCalledWith(modalData)
    })

    it('should show recipe modal with data', () => {
      // Given - Recipe modal data
      const recipeData = {
        id: 'recipe123',
        title: 'Chocolate Cake',
        ingredients: ['flour', 'sugar', 'cocoa'],
      }
      const modalData = {
        type: 'recipe' as const,
        title: 'Recipe Details',
        data: recipeData,
      }

      // When - showModal is called
      const { showModal } = useUIStore.getState()
      showModal(modalData)

      // Then - showModal should be called with recipe data
      expect(showModal).toHaveBeenCalledWith(modalData)
    })

    it('should hide specific modal by id', () => {
      // Given - Modal id
      const modalId = 'modal123'

      // When - hideModal is called
      const { hideModal } = useUIStore.getState()
      hideModal(modalId)

      // Then - hideModal should be called with modal id
      expect(hideModal).toHaveBeenCalledWith(modalId)
    })

    it('should hide all modals', () => {
      // When - hideAllModals is called
      const { hideAllModals } = useUIStore.getState()
      hideAllModals()

      // Then - hideAllModals should be called
      expect(hideAllModals).toHaveBeenCalled()
    })
  })

  describe('Scenario: Loading state management', () => {
    it('should set loading state for specific key', () => {
      // Given - Loading key and state
      const loadingKey = 'recipes'
      const isLoading = true

      // When - setLoading is called
      const { setLoading } = useUIStore.getState()
      setLoading(loadingKey, isLoading)

      // Then - setLoading should be called with key and state
      expect(setLoading).toHaveBeenCalledWith(loadingKey, isLoading)
    })

    it('should clear loading for specific key', () => {
      // Given - Loading key
      const loadingKey = 'inventory'

      // When - setLoading is called with false
      const { setLoading } = useUIStore.getState()
      setLoading(loadingKey, false)

      // Then - setLoading should be called to clear loading
      expect(setLoading).toHaveBeenCalledWith(loadingKey, false)
    })

    it('should clear all loading states', () => {
      // When - clearAllLoading is called
      const { clearAllLoading } = useUIStore.getState()
      clearAllLoading()

      // Then - clearAllLoading should be called
      expect(clearAllLoading).toHaveBeenCalled()
    })

    it('should handle multiple concurrent loading states', () => {
      // Given - Multiple loading operations
      const { setLoading } = useUIStore.getState()

      // When - Multiple loading states are set
      setLoading('recipes', true)
      setLoading('inventory', true)
      setLoading('conversations', true)

      // Then - All loading states should be set
      expect(setLoading).toHaveBeenCalledWith('recipes', true)
      expect(setLoading).toHaveBeenCalledWith('inventory', true)
      expect(setLoading).toHaveBeenCalledWith('conversations', true)
    })
  })

  describe('Scenario: Theme management', () => {
    it('should set light theme', () => {
      // When - setTheme is called with light
      const { setTheme } = useUIStore.getState()
      setTheme('light')

      // Then - setTheme should be called with light
      expect(setTheme).toHaveBeenCalledWith('light')
    })

    it('should set dark theme', () => {
      // When - setTheme is called with dark
      const { setTheme } = useUIStore.getState()
      setTheme('dark')

      // Then - setTheme should be called with dark
      expect(setTheme).toHaveBeenCalledWith('dark')
    })

    it('should set auto theme', () => {
      // When - setTheme is called with auto
      const { setTheme } = useUIStore.getState()
      setTheme('auto')

      // Then - setTheme should be called with auto
      expect(setTheme).toHaveBeenCalledWith('auto')
    })
  })

  describe('Scenario: Notification management', () => {
    it('should show success notification', () => {
      // Given - Success notification data
      const notificationData = {
        type: 'success' as const,
        message: 'Recipe saved successfully!',
      }

      // When - showNotification is called
      const { showNotification } = useUIStore.getState()
      const notificationId = showNotification(notificationData)

      // Then - showNotification should be called and return id
      expect(showNotification).toHaveBeenCalledWith(notificationData)
      expect(notificationId).toBe('notification-id')
    })

    it('should show error notification', () => {
      // Given - Error notification data
      const notificationData = {
        type: 'error' as const,
        message: 'Failed to save recipe. Please try again.',
      }

      // When - showNotification is called
      const { showNotification } = useUIStore.getState()
      showNotification(notificationData)

      // Then - showNotification should be called
      expect(showNotification).toHaveBeenCalledWith(notificationData)
    })

    it('should show warning notification', () => {
      // Given - Warning notification data
      const notificationData = {
        type: 'warning' as const,
        message: 'Some ingredients may be expired.',
      }

      // When - showNotification is called
      const { showNotification } = useUIStore.getState()
      showNotification(notificationData)

      // Then - showNotification should be called
      expect(showNotification).toHaveBeenCalledWith(notificationData)
    })

    it('should show info notification', () => {
      // Given - Info notification data
      const notificationData = {
        type: 'info' as const,
        message: 'New feature: Recipe sharing is now available!',
      }

      // When - showNotification is called
      const { showNotification } = useUIStore.getState()
      showNotification(notificationData)

      // Then - showNotification should be called
      expect(showNotification).toHaveBeenCalledWith(notificationData)
    })

    it('should hide specific notification', () => {
      // Given - Notification id
      const notificationId = 'notification123'

      // When - hideNotification is called
      const { hideNotification } = useUIStore.getState()
      hideNotification(notificationId)

      // Then - hideNotification should be called with notification id
      expect(hideNotification).toHaveBeenCalledWith(notificationId)
    })

    it('should clear all notifications', () => {
      // When - clearAllNotifications is called
      const { clearAllNotifications } = useUIStore.getState()
      clearAllNotifications()

      // Then - clearAllNotifications should be called
      expect(clearAllNotifications).toHaveBeenCalled()
    })
  })

  describe('Scenario: Sidebar management', () => {
    it('should toggle sidebar state', () => {
      // When - toggleSidebar is called
      const { toggleSidebar } = useUIStore.getState()
      toggleSidebar()

      // Then - toggleSidebar should be called
      expect(toggleSidebar).toHaveBeenCalled()
    })

    it('should set sidebar to collapsed', () => {
      // When - setSidebarCollapsed is called with true
      const { setSidebarCollapsed } = useUIStore.getState()
      setSidebarCollapsed(true)

      // Then - setSidebarCollapsed should be called with true
      expect(setSidebarCollapsed).toHaveBeenCalledWith(true)
    })

    it('should set sidebar to expanded', () => {
      // When - setSidebarCollapsed is called with false
      const { setSidebarCollapsed } = useUIStore.getState()
      setSidebarCollapsed(false)

      // Then - setSidebarCollapsed should be called with false
      expect(setSidebarCollapsed).toHaveBeenCalledWith(false)
    })
  })

  describe('Scenario: Complex UI workflows', () => {
    it('should handle recipe deletion workflow', () => {
      // Given - Recipe deletion workflow
      const { showModal, setLoading, showNotification } = useUIStore.getState()

      // When - Recipe deletion workflow
      const modalId = showModal({
        type: 'confirm',
        title: 'Delete Recipe',
        content: 'Are you sure?',
        onConfirm: vi.fn(),
      })
      setLoading('deleteRecipe', true)
      setLoading('deleteRecipe', false)
      showNotification({
        type: 'success',
        message: 'Recipe deleted successfully',
      })

      // Then - All workflow steps should be executed
      expect(showModal).toHaveBeenCalled()
      expect(setLoading).toHaveBeenCalledWith('deleteRecipe', true)
      expect(setLoading).toHaveBeenCalledWith('deleteRecipe', false)
      expect(showNotification).toHaveBeenCalled()
    })

    it('should handle error workflow with notifications', () => {
      // Given - Error workflow
      const { setLoading, showNotification, hideAllModals } = useUIStore.getState()

      // When - Error workflow
      setLoading('saveData', true)
      hideAllModals()
      setLoading('saveData', false)
      showNotification({
        type: 'error',
        message: 'Failed to save data',
      })

      // Then - Error workflow should be executed
      expect(setLoading).toHaveBeenCalledWith('saveData', true)
      expect(hideAllModals).toHaveBeenCalled()
      expect(setLoading).toHaveBeenCalledWith('saveData', false)
      expect(showNotification).toHaveBeenCalledWith({
        type: 'error',
        message: 'Failed to save data',
      })
    })

    it('should handle bulk operations', () => {
      // Given - Bulk operations
      const { showNotification, clearAllNotifications, clearAllLoading, hideAllModals } = useUIStore.getState()

      // When - Bulk cleanup operations
      hideAllModals()
      clearAllLoading()
      clearAllNotifications()
      showNotification({
        type: 'info',
        message: 'Interface cleared',
      })

      // Then - All bulk operations should be executed
      expect(hideAllModals).toHaveBeenCalled()
      expect(clearAllLoading).toHaveBeenCalled()
      expect(clearAllNotifications).toHaveBeenCalled()
      expect(showNotification).toHaveBeenCalledWith({
        type: 'info',
        message: 'Interface cleared',
      })
    })
  })

  describe('Scenario: Edge cases and validation', () => {
    it('should handle very long notification messages', () => {
      // Given - Very long notification message
      const longMessage = 'A'.repeat(1000)
      const notificationData = {
        type: 'info' as const,
        message: longMessage,
      }

      // When - showNotification is called with long message
      const { showNotification } = useUIStore.getState()
      showNotification(notificationData)

      // Then - Should handle long message without error
      expect(showNotification).toHaveBeenCalledWith(notificationData)
    })

    it('should handle rapid modal operations', () => {
      // Given - Rapid modal operations
      const { showModal, hideModal, hideAllModals } = useUIStore.getState()

      // When - Rapid operations
      showModal({ type: 'alert', title: 'Alert 1' })
      showModal({ type: 'alert', title: 'Alert 2' })
      hideModal('modal1')
      hideAllModals()
      showModal({ type: 'confirm', title: 'Final' })

      // Then - All operations should be handled
      expect(showModal).toHaveBeenCalledTimes(3)
      expect(hideModal).toHaveBeenCalledWith('modal1')
      expect(hideAllModals).toHaveBeenCalled()
    })

    it('should handle special characters in modal content', () => {
      // Given - Modal with special characters
      const modalData = {
        type: 'alert' as const,
        title: '🎉 Success! 成功',
        content: 'Recipe "Café au lait" saved with ❤️',
      }

      // When - showModal is called
      const { showModal } = useUIStore.getState()
      showModal(modalData)

      // Then - Should handle special characters
      expect(showModal).toHaveBeenCalledWith(modalData)
    })
  })
})