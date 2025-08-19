import React from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Conversation, Message, ApiResponse, PaginatedResponse } from '../../types'
import { queryKeys } from '../queryClient'
import { useChatStore } from '../../stores/chatStore'
import { useUIStore } from '../../stores/uiStore'

// Mock API functions - replace with actual API calls later
const api = {
  getConversations: async (filters?: Record<string, any>): Promise<PaginatedResponse<Conversation>> => {
    // Mock implementation
    await new Promise(resolve => setTimeout(resolve, 600))
    return {
      data: [],
      total: 0,
      page: 1,
      limit: 10,
      hasNext: false,
      hasPrev: false,
    }
  },

  getConversation: async (id: string): Promise<Conversation> => {
    // Mock implementation
    await new Promise(resolve => setTimeout(resolve, 400))
    throw new Error('Conversation not found')
  },

  createConversation: async (conversation: Omit<Conversation, 'id' | 'createdAt' | 'updatedAt'>): Promise<Conversation> => {
    // Mock implementation
    await new Promise(resolve => setTimeout(resolve, 500))
    return {
      ...conversation,
      id: `conversation_${Date.now()}`,
      createdAt: new Date(),
      updatedAt: new Date(),
    }
  },

  updateConversation: async (id: string, updates: Partial<Conversation>): Promise<Conversation> => {
    // Mock implementation
    await new Promise(resolve => setTimeout(resolve, 400))
    throw new Error('Conversation not found')
  },

  deleteConversation: async (id: string): Promise<void> => {
    // Mock implementation
    await new Promise(resolve => setTimeout(resolve, 300))
  },

  getConversationMessages: async (conversationId: string): Promise<Message[]> => {
    // Mock implementation
    await new Promise(resolve => setTimeout(resolve, 400))
    return []
  },

  sendMessage: async (conversationId: string, message: Omit<Message, 'id' | 'timestamp'>): Promise<Message> => {
    // Mock implementation
    await new Promise(resolve => setTimeout(resolve, 1000))
    return {
      ...message,
      id: `msg_${Date.now()}`,
      timestamp: new Date(),
    }
  },

  searchConversations: async (query: string): Promise<Conversation[]> => {
    // Mock implementation
    await new Promise(resolve => setTimeout(resolve, 500))
    return []
  },
}

// Hooks for conversation operations
export const useConversations = (filters?: Record<string, any>) => {
  return useQuery({
    queryKey: queryKeys.conversations.list(filters),
    queryFn: () => api.getConversations(filters),
    staleTime: 2 * 60 * 1000, // 2 minutes
  })
}

export const useConversation = (id: string) => {
  return useQuery({
    queryKey: queryKeys.conversations.detail(id),
    queryFn: () => api.getConversation(id),
    enabled: !!id,
    staleTime: 5 * 60 * 1000, // 5 minutes
  })
}

export const useConversationMessages = (conversationId: string) => {
  return useQuery({
    queryKey: queryKeys.conversations.messages(conversationId),
    queryFn: () => api.getConversationMessages(conversationId),
    enabled: !!conversationId,
    staleTime: 30 * 1000, // 30 seconds - messages change frequently
    refetchInterval: 30 * 1000, // Poll for new messages every 30 seconds
  })
}

export const useSearchConversations = (query: string) => {
  return useQuery({
    queryKey: queryKeys.conversations.search(query),
    queryFn: () => api.searchConversations(query),
    enabled: query.length >= 2,
    staleTime: 1 * 60 * 1000, // 1 minute for search results
  })
}

// Mutation hooks
export const useCreateConversation = () => {
  const queryClient = useQueryClient()
  const { showNotification } = useUIStore()
  const { setCurrentConversation } = useChatStore()

  return useMutation({
    mutationFn: api.createConversation,
    onSuccess: (newConversation) => {
      // Invalidate conversation lists
      queryClient.invalidateQueries({ queryKey: queryKeys.conversations.all() })
      
      // Add the new conversation to existing caches
      queryClient.setQueryData(queryKeys.conversations.detail(newConversation.id), newConversation)
      
      // Set as current conversation
      setCurrentConversation(newConversation.id)
      
      showNotification({
        type: 'success',
        message: 'New conversation started!',
      })
    },
    onError: (error: any) => {
      showNotification({
        type: 'error',
        message: error.message || 'Failed to create conversation',
      })
    },
  })
}

export const useUpdateConversation = () => {
  const queryClient = useQueryClient()
  const { showNotification } = useUIStore()

  return useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: Partial<Conversation> }) =>
      api.updateConversation(id, updates),
    onSuccess: (updatedConversation) => {
      // Update the specific conversation in cache
      queryClient.setQueryData(queryKeys.conversations.detail(updatedConversation.id), updatedConversation)
      
      // Invalidate conversation lists
      queryClient.invalidateQueries({ queryKey: queryKeys.conversations.all() })
      
      showNotification({
        type: 'success',
        message: 'Conversation updated!',
      })
    },
    onError: (error: any) => {
      showNotification({
        type: 'error',
        message: error.message || 'Failed to update conversation',
      })
    },
  })
}

export const useDeleteConversation = () => {
  const queryClient = useQueryClient()
  const { showNotification } = useUIStore()
  const { setCurrentConversation, clearMessages } = useChatStore()

  return useMutation({
    mutationFn: api.deleteConversation,
    onSuccess: (_, deletedId) => {
      // Remove the conversation from cache
      queryClient.removeQueries({ queryKey: queryKeys.conversations.detail(deletedId) })
      queryClient.removeQueries({ queryKey: queryKeys.conversations.messages(deletedId) })
      
      // Invalidate conversation lists
      queryClient.invalidateQueries({ queryKey: queryKeys.conversations.all() })
      
      // Clear current conversation if it was the deleted one
      const { currentConversationId } = useChatStore.getState()
      if (currentConversationId === deletedId) {
        setCurrentConversation(null)
        clearMessages()
      }
      
      showNotification({
        type: 'success',
        message: 'Conversation deleted!',
      })
    },
    onError: (error: any) => {
      showNotification({
        type: 'error',
        message: error.message || 'Failed to delete conversation',
      })
    },
  })
}

export const useSendMessage = () => {
  const queryClient = useQueryClient()
  const { showNotification } = useUIStore()
  const { addMessage, setLoading, setError } = useChatStore()

  return useMutation({
    mutationFn: ({ conversationId, message }: { conversationId: string; message: Omit<Message, 'id' | 'timestamp'> }) => {
      setLoading(true)
      setError(null)
      return api.sendMessage(conversationId, message)
    },
    onSuccess: (sentMessage, { conversationId }) => {
      // Add message to chat store
      addMessage({
        content: sentMessage.content,
        role: sentMessage.role,
        recipeId: sentMessage.recipeId,
      })
      
      // Invalidate conversation messages to refetch
      queryClient.invalidateQueries({ 
        queryKey: queryKeys.conversations.messages(conversationId) 
      })
      
      // Update conversation's updatedAt timestamp
      queryClient.invalidateQueries({ 
        queryKey: queryKeys.conversations.detail(conversationId) 
      })
      
      setLoading(false)
    },
    onError: (error: any, { conversationId }) => {
      setLoading(false)
      setError(error.message || 'Failed to send message')
      
      showNotification({
        type: 'error',
        message: error.message || 'Failed to send message',
      })
    },
  })
}

// Utility hook for managing chat state with server sync
export const useChatSync = (conversationId: string | null) => {
  const { data: messages, isLoading } = useConversationMessages(conversationId || '')
  const { setCurrentConversation, addMessages, clearMessages } = useChatStore()

  // Sync server messages with local chat store
  React.useEffect(() => {
    if (conversationId) {
      setCurrentConversation(conversationId)
      if (messages) {
        clearMessages()
        addMessages(messages)
      }
    } else {
      setCurrentConversation(null)
      clearMessages()
    }
  }, [conversationId, messages, setCurrentConversation, addMessages, clearMessages])

  return { isLoading }
}