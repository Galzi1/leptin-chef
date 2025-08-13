import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface User {
  id: string
  displayName: string
  profilePicture?: string
  measurementStyle: 'metric' | 'us'
  createdAt: Date
  updatedAt: Date
}

interface UserState {
  user: User | null
  setUser: (user: User) => void
  updateUser: (updates: Partial<User>) => void
  clearUser: () => void
}

const defaultUser: User = {
  id: 'default-user',
  displayName: 'User',
  measurementStyle: 'metric',
  createdAt: new Date(),
  updatedAt: new Date(),
}

export const useUserStore = create<UserState>()(
  persist(
    (set, get) => ({
      user: defaultUser,
      setUser: (user) => set({ user }),
      updateUser: (updates) => {
        const currentUser = get().user
        if (currentUser) {
          set({
            user: {
              ...currentUser,
              ...updates,
              updatedAt: new Date(),
            },
          })
        }
      },
      clearUser: () => set({ user: null }),
    }),
    {
      name: 'user-storage',
    }
  )
)

