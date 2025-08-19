import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface Modal {
  id: string
  type: 'confirm' | 'alert' | 'form' | 'recipe' | 'profile'
  title: string
  content?: string
  data?: any
  onConfirm?: () => void
  onCancel?: () => void
}

export interface LoadingState {
  [key: string]: boolean
}

export interface Notification {
  id: string
  type: 'success' | 'error' | 'warning' | 'info'
  message: string
  timestamp: Date
}

export interface UIState {
  modals: Modal[]
  loading: LoadingState
  theme: 'light' | 'dark' | 'auto'
  notifications: Notification[]
  sidebarCollapsed: boolean
  showModal: (modal: Omit<Modal, 'id'>) => string
  hideModal: (modalId: string) => void
  hideAllModals: () => void
  setLoading: (key: string, loading: boolean) => void
  clearAllLoading: () => void
  setTheme: (theme: 'light' | 'dark' | 'auto') => void
  showNotification: (notification: Omit<Notification, 'id' | 'timestamp'>) => string
  hideNotification: (notificationId: string) => void
  clearAllNotifications: () => void
  toggleSidebar: () => void
  setSidebarCollapsed: (collapsed: boolean) => void
}

const generateId = (): string => {
  return `ui_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
}

export const useUIStore = create<UIState>()(
  persist(
    (set, get) => ({
      modals: [],
      loading: {},
      theme: 'auto',
      notifications: [],
      sidebarCollapsed: false,

      showModal: (modalData) => {
        const modal: Modal = {
          ...modalData,
          id: generateId(),
        }

        set((state) => ({
          modals: [...state.modals, modal],
        }))

        return modal.id
      },

      hideModal: (modalId) => {
        set((state) => ({
          modals: state.modals.filter((modal) => modal.id !== modalId),
        }))
      },

      hideAllModals: () => {
        set({ modals: [] })
      },

      setLoading: (key, loading) => {
        set((state) => ({
          loading: {
            ...state.loading,
            [key]: loading,
          },
        }))
      },

      clearAllLoading: () => {
        set({ loading: {} })
      },

      setTheme: (theme) => {
        set({ theme })
      },

      showNotification: (notificationData) => {
        const notification: Notification = {
          ...notificationData,
          id: generateId(),
          timestamp: new Date(),
        }

        set((state) => ({
          notifications: [...state.notifications, notification],
        }))

        // Auto-hide notification after 5 seconds for non-error notifications
        if (notification.type !== 'error') {
          setTimeout(() => {
            get().hideNotification(notification.id)
          }, 5000)
        }

        return notification.id
      },

      hideNotification: (notificationId) => {
        set((state) => ({
          notifications: state.notifications.filter(
            (notification) => notification.id !== notificationId
          ),
        }))
      },

      clearAllNotifications: () => {
        set({ notifications: [] })
      },

      toggleSidebar: () => {
        set((state) => ({
          sidebarCollapsed: !state.sidebarCollapsed,
        }))
      },

      setSidebarCollapsed: (collapsed) => {
        set({ sidebarCollapsed: collapsed })
      },
    }),
    {
      name: 'ui-storage',
      // Persist theme and sidebar preferences, but not modals/notifications/loading
      partialize: (state) => ({
        theme: state.theme,
        sidebarCollapsed: state.sidebarCollapsed,
      }),
    }
  )
)