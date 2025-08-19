import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { InventoryItem, ApiResponse, PaginatedResponse } from '../../types'
import { queryKeys } from '../queryClient'
import { useUIStore } from '../../stores/uiStore'

// Mock API functions - replace with actual API calls later
const api = {
  getInventoryItems: async (filters?: Record<string, any>): Promise<PaginatedResponse<InventoryItem>> => {
    // Mock implementation
    await new Promise(resolve => setTimeout(resolve, 800))
    return {
      data: [],
      total: 0,
      page: 1,
      limit: 20,
      hasNext: false,
      hasPrev: false,
    }
  },

  getInventoryItem: async (id: string): Promise<InventoryItem> => {
    // Mock implementation
    await new Promise(resolve => setTimeout(resolve, 400))
    throw new Error('Inventory item not found')
  },

  createInventoryItem: async (item: Omit<InventoryItem, 'id' | 'createdAt' | 'updatedAt'>): Promise<InventoryItem> => {
    // Mock implementation
    await new Promise(resolve => setTimeout(resolve, 600))
    return {
      ...item,
      id: `inventory_${Date.now()}`,
      createdAt: new Date(),
      updatedAt: new Date(),
    }
  },

  updateInventoryItem: async (id: string, updates: Partial<InventoryItem>): Promise<InventoryItem> => {
    // Mock implementation
    await new Promise(resolve => setTimeout(resolve, 600))
    throw new Error('Inventory item not found')
  },

  deleteInventoryItem: async (id: string): Promise<void> => {
    // Mock implementation
    await new Promise(resolve => setTimeout(resolve, 400))
  },

  getExpiringItems: async (): Promise<InventoryItem[]> => {
    // Mock implementation - items expiring within 7 days
    await new Promise(resolve => setTimeout(resolve, 500))
    return []
  },
}

// Hooks for inventory operations
export const useInventoryItems = (filters?: Record<string, any>) => {
  return useQuery({
    queryKey: queryKeys.inventory.list(filters),
    queryFn: () => api.getInventoryItems(filters),
    staleTime: 1 * 60 * 1000, // 1 minute - inventory changes frequently
  })
}

export const useInventoryItem = (id: string) => {
  return useQuery({
    queryKey: queryKeys.inventory.detail(id),
    queryFn: () => api.getInventoryItem(id),
    enabled: !!id,
    staleTime: 2 * 60 * 1000, // 2 minutes
  })
}

export const useExpiringItems = () => {
  return useQuery({
    queryKey: queryKeys.inventory.expiring(),
    queryFn: api.getExpiringItems,
    staleTime: 5 * 60 * 1000, // 5 minutes
    // Refetch more frequently for expiring items
    refetchInterval: 5 * 60 * 1000, // Every 5 minutes
  })
}

// Mutation hooks
export const useCreateInventoryItem = () => {
  const queryClient = useQueryClient()
  const { showNotification } = useUIStore()

  return useMutation({
    mutationFn: api.createInventoryItem,
    onSuccess: (newItem) => {
      // Invalidate inventory lists to refetch them
      queryClient.invalidateQueries({ queryKey: queryKeys.inventory.all() })
      
      // Add the new item to existing caches
      queryClient.setQueryData(queryKeys.inventory.detail(newItem.id), newItem)
      
      // Show success notification
      showNotification({
        type: 'success',
        message: 'Inventory item added successfully!',
      })
    },
    onError: (error: any) => {
      showNotification({
        type: 'error',
        message: error.message || 'Failed to add inventory item',
      })
    },
  })
}

export const useUpdateInventoryItem = () => {
  const queryClient = useQueryClient()
  const { showNotification } = useUIStore()

  return useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: Partial<InventoryItem> }) =>
      api.updateInventoryItem(id, updates),
    onSuccess: (updatedItem) => {
      // Update the specific item in cache
      queryClient.setQueryData(queryKeys.inventory.detail(updatedItem.id), updatedItem)
      
      // Invalidate inventory lists
      queryClient.invalidateQueries({ queryKey: queryKeys.inventory.all() })
      
      showNotification({
        type: 'success',
        message: 'Inventory item updated successfully!',
      })
    },
    onError: (error: any) => {
      showNotification({
        type: 'error',
        message: error.message || 'Failed to update inventory item',
      })
    },
  })
}

export const useDeleteInventoryItem = () => {
  const queryClient = useQueryClient()
  const { showNotification } = useUIStore()

  return useMutation({
    mutationFn: api.deleteInventoryItem,
    onSuccess: (_, deletedId) => {
      // Remove the item from cache
      queryClient.removeQueries({ queryKey: queryKeys.inventory.detail(deletedId) })
      
      // Invalidate inventory lists
      queryClient.invalidateQueries({ queryKey: queryKeys.inventory.all() })
      
      showNotification({
        type: 'success',
        message: 'Inventory item deleted successfully!',
      })
    },
    onError: (error: any) => {
      showNotification({
        type: 'error',
        message: error.message || 'Failed to delete inventory item',
      })
    },
  })
}

// Utility hooks
export const useInventoryStats = () => {
  const { data: inventoryItems } = useInventoryItems()
  const { data: expiringItems } = useExpiringItems()

  const stats = {
    totalItems: inventoryItems?.total || 0,
    expiringCount: expiringItems?.length || 0,
    categories: {} as Record<string, number>,
  }

  // Calculate category counts
  if (inventoryItems?.data) {
    inventoryItems.data.forEach(item => {
      stats.categories[item.category] = (stats.categories[item.category] || 0) + 1
    })
  }

  return stats
}