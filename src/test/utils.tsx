import React, { ReactElement } from 'react'
import { render, RenderOptions } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

// Create a custom render function that includes providers
const AllTheProviders = ({ children }: { children: React.ReactNode }) => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  })

  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        {children}
      </BrowserRouter>
    </QueryClientProvider>
  )
}

const customRender = (
  ui: ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>,
) => render(ui, { wrapper: AllTheProviders, ...options })

// Re-export everything
export * from '@testing-library/react'

// Override render method
export { customRender as render }

// Test data factories
export const createMockUser = (overrides = {}) => ({
  id: 'test-user-id',
  displayName: 'Test User',
  measurementStyle: 'metric' as const,
  createdAt: new Date('2023-01-01'),
  updatedAt: new Date('2023-01-01'),
  ...overrides,
})

export const createMockRecipe = (overrides = {}) => ({
  id: 'test-recipe-id',
  title: 'Test Recipe',
  description: 'A test recipe',
  ingredients: [
    {
      id: 'ingredient-1',
      name: 'Test Ingredient',
      amount: 1,
      unit: 'cup',
    },
  ],
  method: ['Step 1: Test method'],
  servings: 4,
  prepTime: 15,
  cookTime: 30,
  difficulty: 'easy' as const,
  tags: ['test'],
  usageCount: 0,
  createdAt: new Date('2023-01-01'),
  updatedAt: new Date('2023-01-01'),
  ...overrides,
})

export const createMockConversation = (overrides = {}) => ({
  id: 'test-conversation-id',
  title: 'Test Conversation',
  summary: 'A test conversation about cooking',
  messages: [
    {
      id: 'message-1',
      content: 'Hello, I need help with cooking',
      role: 'user' as const,
      timestamp: new Date('2023-01-01T10:00:00Z'),
    },
  ],
  createdAt: new Date('2023-01-01'),
  updatedAt: new Date('2023-01-01'),
  ...overrides,
})

export const createMockInventoryItem = (overrides = {}) => ({
  id: 'test-item-id',
  name: 'Test Item',
  quantity: 1,
  unit: 'piece',
  category: 'vegetables',
  createdAt: new Date('2023-01-01'),
  updatedAt: new Date('2023-01-01'),
  ...overrides,
})

