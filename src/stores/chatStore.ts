import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { Message } from '../types'

export interface ChatState {
  messages: Message[]
  isLoading: boolean
  currentConversationId: string | null
  error: string | null
  addMessage: (message: Omit<Message, 'id' | 'timestamp'>) => void
  addMessages: (messages: Message[]) => void
  clearMessages: () => void
  setLoading: (loading: boolean) => void
  setError: (error: string | null) => void
  setCurrentConversation: (conversationId: string | null) => void
  updateMessage: (messageId: string, updates: Partial<Message>) => void
  removeMessage: (messageId: string) => void
}

const generateId = (): string => {
  return `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
}

export const useChatStore = create<ChatState>()(
  persist(
    (set, get) => ({
      messages: [],
      isLoading: false,
      currentConversationId: null,
      error: null,

      addMessage: (messageData) => {
        const newMessage: Message = {
          ...messageData,
          id: generateId(),
          timestamp: new Date(),
        }

        set((state) => ({
          messages: [...state.messages, newMessage],
          error: null, // Clear error when successfully adding message
        }))
      },

      addMessages: (messages) => {
        set((state) => ({
          messages: [...state.messages, ...messages],
          error: null,
        }))
      },

      clearMessages: () => {
        set({ messages: [] })
      },

      setLoading: (loading) => {
        set({ isLoading: loading })
      },

      setError: (error) => {
        set({ error })
      },

      setCurrentConversation: (conversationId) => {
        set({ 
          currentConversationId: conversationId,
          error: null, // Clear error when switching conversations
        })
      },

      updateMessage: (messageId, updates) => {
        set((state) => ({
          messages: state.messages.map((message) =>
            message.id === messageId 
              ? { ...message, ...updates }
              : message
          ),
        }))
      },

      removeMessage: (messageId) => {
        set((state) => ({
          messages: state.messages.filter((message) => message.id !== messageId),
        }))
      },
    }),
    {
      name: 'chat-storage',
      // Only persist messages and current conversation, not loading/error states
      partialize: (state) => ({
        messages: state.messages,
        currentConversationId: state.currentConversationId,
      }),
    }
  )
)