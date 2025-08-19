import { QueryClient } from '@tanstack/react-query'

// Create a client with sensible defaults for the Leptin Chef app
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Stale time - data is considered fresh for 5 minutes
      staleTime: 5 * 60 * 1000,
      // Cache time - data stays in cache for 10 minutes after being unused
      gcTime: 10 * 60 * 1000,
      // Retry failed queries 2 times with exponential backoff
      retry: 2,
      // Refetch on window focus for better UX
      refetchOnWindowFocus: true,
      // Don't refetch on reconnect to avoid unnecessary requests
      refetchOnReconnect: false,
    },
    mutations: {
      // Retry mutations once on network errors
      retry: 1,
    },
  },
})

// Query keys for consistent cache management
export const queryKeys = {
  // User related queries
  user: {
    profile: () => ['user', 'profile'] as const,
    preferences: () => ['user', 'preferences'] as const,
  },
  // Recipe related queries
  recipes: {
    all: () => ['recipes'] as const,
    list: (filters?: Record<string, any>) => ['recipes', 'list', filters] as const,
    detail: (id: string) => ['recipes', 'detail', id] as const,
    search: (query: string) => ['recipes', 'search', query] as const,
    popular: () => ['recipes', 'popular'] as const,
    recent: () => ['recipes', 'recent'] as const,
  },
  // Inventory related queries
  inventory: {
    all: () => ['inventory'] as const,
    list: (filters?: Record<string, any>) => ['inventory', 'list', filters] as const,
    detail: (id: string) => ['inventory', 'detail', id] as const,
    expiring: () => ['inventory', 'expiring'] as const,
  },
  // Conversation related queries
  conversations: {
    all: () => ['conversations'] as const,
    list: (filters?: Record<string, any>) => ['conversations', 'list', filters] as const,
    detail: (id: string) => ['conversations', 'detail', id] as const,
    messages: (conversationId: string) => ['conversations', conversationId, 'messages'] as const,
    search: (query: string) => ['conversations', 'search', query] as const,
  },
} as const

// Type-safe query key factory
export type QueryKeys = typeof queryKeys