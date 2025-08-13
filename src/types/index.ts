// User related types
export interface User {
  id: string
  displayName: string
  profilePicture?: string
  measurementStyle: 'metric' | 'us'
  createdAt: Date
  updatedAt: Date
}

// Recipe related types
export interface Recipe {
  id: string
  title: string
  description?: string
  picture?: string
  ingredients: Ingredient[]
  method: string[]
  servings: number
  prepTime: number // in minutes
  cookTime: number // in minutes
  difficulty: 'easy' | 'medium' | 'hard'
  tags: string[]
  usageCount: number
  createdAt: Date
  updatedAt: Date
}

export interface Ingredient {
  id: string
  name: string
  amount: number
  unit: string
  notes?: string
}

// Conversation related types
export interface Conversation {
  id: string
  title: string
  summary: string
  messages: Message[]
  createdAt: Date
  updatedAt: Date
}

export interface Message {
  id: string
  content: string
  role: 'user' | 'assistant'
  timestamp: Date
  recipeId?: string // if message contains a recipe
}

// Inventory related types
export interface InventoryItem {
  id: string
  name: string
  quantity: number
  unit: string
  category: string
  expiryDate?: Date
  notes?: string
  createdAt: Date
  updatedAt: Date
}

// API Response types
export interface ApiResponse<T> {
  success: boolean
  data?: T
  error?: string
  message?: string
}

export interface PaginatedResponse<T> {
  data: T[]
  total: number
  page: number
  limit: number
  hasNext: boolean
  hasPrev: boolean
}

