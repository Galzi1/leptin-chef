import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { User } from '../types'

export interface UserPreferences {
  measurementStyle: 'metric' | 'us'
  notifications: boolean
  theme: 'light' | 'dark' | 'auto'
  autoSaveRecipes: boolean
  showNutritionalInfo: boolean
  defaultServings: number
}

export interface UserState {
  user: User | null
  preferences: UserPreferences
  isAuthenticated: boolean
  setUser: (user: User) => void
  updateUser: (updates: Partial<User>) => void
  clearUser: () => void
  updatePreferences: (preferences: Partial<UserPreferences>) => void
  setAuthenticated: (authenticated: boolean) => void
  resetToDefaults: () => void
}

const defaultUser: User = {
  id: 'default-user',
  displayName: 'User',
  measurementStyle: 'metric',
  createdAt: new Date(),
  updatedAt: new Date(),
}

const defaultPreferences: UserPreferences = {
  measurementStyle: 'metric',
  notifications: true,
  theme: 'auto',
  autoSaveRecipes: true,
  showNutritionalInfo: false,
  defaultServings: 4,
}

export const useUserStore = create<UserState>()(
  persist(
    (set, get) => ({
      user: defaultUser,
      preferences: defaultPreferences,
      isAuthenticated: false,

      setUser: (user) => {
        set({ 
          user,
          isAuthenticated: true,
          // Sync measurement style with user preferences
          preferences: {
            ...get().preferences,
            measurementStyle: user.measurementStyle,
          }
        })
      },

      updateUser: (updates) => {
        const currentUser = get().user
        if (currentUser) {
          const updatedUser = {
            ...currentUser,
            ...updates,
            updatedAt: new Date(),
          }
          set({
            user: updatedUser,
            // Sync measurement style with preferences if it changed
            preferences: updates.measurementStyle ? {
              ...get().preferences,
              measurementStyle: updates.measurementStyle,
            } : get().preferences,
          })
        }
      },

      clearUser: () => {
        set({ 
          user: null,
          isAuthenticated: false,
        })
      },

      updatePreferences: (preferenceUpdates) => {
        const currentPreferences = get().preferences
        const currentUser = get().user
        const newPreferences = { ...currentPreferences, ...preferenceUpdates }

        set({ preferences: newPreferences })

        // If measurement style changed and we have a user, sync it
        if (preferenceUpdates.measurementStyle && currentUser) {
          set({
            user: {
              ...currentUser,
              measurementStyle: preferenceUpdates.measurementStyle,
              updatedAt: new Date(),
            }
          })
        }
      },

      setAuthenticated: (authenticated) => {
        set({ isAuthenticated: authenticated })
      },

      resetToDefaults: () => {
        set({
          user: defaultUser,
          preferences: defaultPreferences,
          isAuthenticated: false,
        })
      },
    }),
    {
      name: 'user-storage',
      // Persist all user state and preferences
      partialize: (state) => ({
        user: state.user,
        preferences: state.preferences,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
)

