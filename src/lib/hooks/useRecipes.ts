import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Recipe, ApiResponse, PaginatedResponse } from '../../types'
import { queryKeys } from '../queryClient'
import { useUIStore } from '../../stores/uiStore'

// Mock API functions - replace with actual API calls later
const api = {
  getRecipes: async (filters?: Record<string, any>): Promise<PaginatedResponse<Recipe>> => {
    // Mock implementation
    await new Promise(resolve => setTimeout(resolve, 1000))
    return {
      data: [],
      total: 0,
      page: 1,
      limit: 10,
      hasNext: false,
      hasPrev: false,
    }
  },

  getRecipe: async (id: string): Promise<Recipe> => {
    // Mock implementation
    await new Promise(resolve => setTimeout(resolve, 500))
    throw new Error('Recipe not found')
  },

  createRecipe: async (recipe: Omit<Recipe, 'id' | 'usageCount' | 'createdAt' | 'updatedAt'>): Promise<Recipe> => {
    // Mock implementation
    await new Promise(resolve => setTimeout(resolve, 1000))
    return {
      ...recipe,
      id: `recipe_${Date.now()}`,
      usageCount: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
    }
  },

  updateRecipe: async (id: string, updates: Partial<Recipe>): Promise<Recipe> => {
    // Mock implementation
    await new Promise(resolve => setTimeout(resolve, 800))
    throw new Error('Recipe not found')
  },

  deleteRecipe: async (id: string): Promise<void> => {
    // Mock implementation
    await new Promise(resolve => setTimeout(resolve, 500))
  },

  searchRecipes: async (query: string): Promise<Recipe[]> => {
    // Mock implementation
    await new Promise(resolve => setTimeout(resolve, 600))
    return []
  },

  getPopularRecipes: async (): Promise<Recipe[]> => {
    // Mock implementation
    await new Promise(resolve => setTimeout(resolve, 800))
    return []
  },

  getRecentRecipes: async (): Promise<Recipe[]> => {
    // Mock implementation
    await new Promise(resolve => setTimeout(resolve, 700))
    return []
  },
}

// Hooks for recipe operations
export const useRecipes = (filters?: Record<string, any>) => {
  return useQuery({
    queryKey: queryKeys.recipes.list(filters),
    queryFn: () => api.getRecipes(filters),
    staleTime: 2 * 60 * 1000, // 2 minutes
  })
}

export const useRecipe = (id: string) => {
  return useQuery({
    queryKey: queryKeys.recipes.detail(id),
    queryFn: () => api.getRecipe(id),
    enabled: !!id,
    staleTime: 5 * 60 * 1000, // 5 minutes
  })
}

export const useSearchRecipes = (query: string) => {
  return useQuery({
    queryKey: queryKeys.recipes.search(query),
    queryFn: () => api.searchRecipes(query),
    enabled: query.length >= 2,
    staleTime: 1 * 60 * 1000, // 1 minute for search results
  })
}

export const usePopularRecipes = () => {
  return useQuery({
    queryKey: queryKeys.recipes.popular(),
    queryFn: api.getPopularRecipes,
    staleTime: 10 * 60 * 1000, // 10 minutes for popular recipes
  })
}

export const useRecentRecipes = () => {
  return useQuery({
    queryKey: queryKeys.recipes.recent(),
    queryFn: api.getRecentRecipes,
    staleTime: 2 * 60 * 1000, // 2 minutes for recent recipes
  })
}

// Mutation hooks
export const useCreateRecipe = () => {
  const queryClient = useQueryClient()
  const { showNotification } = useUIStore()

  return useMutation({
    mutationFn: api.createRecipe,
    onSuccess: (newRecipe) => {
      // Invalidate recipe lists to refetch them
      queryClient.invalidateQueries({ queryKey: queryKeys.recipes.all() })
      
      // Add the new recipe to existing caches
      queryClient.setQueryData(queryKeys.recipes.detail(newRecipe.id), newRecipe)
      
      // Show success notification
      showNotification({
        type: 'success',
        message: 'Recipe created successfully!',
      })
    },
    onError: (error: any) => {
      showNotification({
        type: 'error',
        message: error.message || 'Failed to create recipe',
      })
    },
  })
}

export const useUpdateRecipe = () => {
  const queryClient = useQueryClient()
  const { showNotification } = useUIStore()

  return useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: Partial<Recipe> }) =>
      api.updateRecipe(id, updates),
    onSuccess: (updatedRecipe) => {
      // Update the specific recipe in cache
      queryClient.setQueryData(queryKeys.recipes.detail(updatedRecipe.id), updatedRecipe)
      
      // Invalidate recipe lists
      queryClient.invalidateQueries({ queryKey: queryKeys.recipes.all() })
      
      showNotification({
        type: 'success',
        message: 'Recipe updated successfully!',
      })
    },
    onError: (error: any) => {
      showNotification({
        type: 'error',
        message: error.message || 'Failed to update recipe',
      })
    },
  })
}

export const useDeleteRecipe = () => {
  const queryClient = useQueryClient()
  const { showNotification } = useUIStore()

  return useMutation({
    mutationFn: api.deleteRecipe,
    onSuccess: (_, deletedId) => {
      // Remove the recipe from cache
      queryClient.removeQueries({ queryKey: queryKeys.recipes.detail(deletedId) })
      
      // Invalidate recipe lists
      queryClient.invalidateQueries({ queryKey: queryKeys.recipes.all() })
      
      showNotification({
        type: 'success',
        message: 'Recipe deleted successfully!',
      })
    },
    onError: (error: any) => {
      showNotification({
        type: 'error',
        message: error.message || 'Failed to delete recipe',
      })
    },
  })
}