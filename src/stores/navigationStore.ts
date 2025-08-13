import { create } from 'zustand'

interface NavigationState {
  isDrawerOpen: boolean
  toggleDrawer: () => void
  openDrawer: () => void
  closeDrawer: () => void
}

export const useNavigationStore = create<NavigationState>((set) => ({
  isDrawerOpen: false,
  toggleDrawer: () => set((state) => ({ isDrawerOpen: !state.isDrawerOpen })),
  openDrawer: () => set({ isDrawerOpen: true }),
  closeDrawer: () => set({ isDrawerOpen: false }),
}))

