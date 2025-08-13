import { z } from 'zod'

// User validation schemas
export const UserSchema = z.object({
  id: z.string().uuid(),
  displayName: z.string().min(1, 'Display name is required').max(50, 'Display name must be less than 50 characters'),
  profilePicture: z.string().url().optional(),
  measurementStyle: z.enum(['metric', 'us']),
  createdAt: z.date(),
  updatedAt: z.date(),
})

export const CreateUserSchema = UserSchema.omit({ id: true, createdAt: true, updatedAt: true })
export const UpdateUserSchema = CreateUserSchema.partial()

// Recipe validation schemas
export const IngredientSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(1, 'Ingredient name is required'),
  amount: z.number().positive('Amount must be positive'),
  unit: z.string().min(1, 'Unit is required'),
  notes: z.string().optional(),
})

export const RecipeSchema = z.object({
  id: z.string().uuid(),
  title: z.string().min(1, 'Recipe title is required').max(100, 'Title must be less than 100 characters'),
  description: z.string().max(500, 'Description must be less than 500 characters').optional(),
  picture: z.string().url().optional(),
  ingredients: z.array(IngredientSchema).min(1, 'At least one ingredient is required'),
  method: z.array(z.string().min(1, 'Method step cannot be empty')).min(1, 'At least one method step is required'),
  servings: z.number().int().positive('Servings must be a positive integer'),
  prepTime: z.number().int().min(0, 'Prep time cannot be negative'),
  cookTime: z.number().int().min(0, 'Cook time cannot be negative'),
  difficulty: z.enum(['easy', 'medium', 'hard']),
  tags: z.array(z.string().min(1, 'Tag cannot be empty')),
  usageCount: z.number().int().min(0, 'Usage count cannot be negative'),
  createdAt: z.date(),
  updatedAt: z.date(),
})

export const CreateRecipeSchema = RecipeSchema.omit({ id: true, usageCount: true, createdAt: true, updatedAt: true })
export const UpdateRecipeSchema = CreateRecipeSchema.partial()

// Conversation validation schemas
export const MessageSchema = z.object({
  id: z.string().uuid(),
  content: z.string().min(1, 'Message content is required'),
  role: z.enum(['user', 'assistant']),
  timestamp: z.date(),
  recipeId: z.string().uuid().optional(),
})

export const ConversationSchema = z.object({
  id: z.string().uuid(),
  title: z.string().min(1, 'Conversation title is required').max(100, 'Title must be less than 100 characters'),
  summary: z.string().max(200, 'Summary must be less than 200 characters'),
  messages: z.array(MessageSchema),
  createdAt: z.date(),
  updatedAt: z.date(),
})

export const CreateConversationSchema = ConversationSchema.omit({ id: true, createdAt: true, updatedAt: true })
export const UpdateConversationSchema = CreateConversationSchema.partial()

// Inventory validation schemas
export const InventoryItemSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(1, 'Item name is required').max(100, 'Name must be less than 100 characters'),
  quantity: z.number().positive('Quantity must be positive'),
  unit: z.string().min(1, 'Unit is required'),
  category: z.string().min(1, 'Category is required'),
  expiryDate: z.date().optional(),
  notes: z.string().max(200, 'Notes must be less than 200 characters').optional(),
  createdAt: z.date(),
  updatedAt: z.date(),
})

export const CreateInventoryItemSchema = InventoryItemSchema.omit({ id: true, createdAt: true, updatedAt: true })
export const UpdateInventoryItemSchema = CreateInventoryItemSchema.partial()

// API validation schemas
export const PaginationSchema = z.object({
  page: z.number().int().min(1, 'Page must be at least 1'),
  limit: z.number().int().min(1, 'Limit must be at least 1').max(100, 'Limit cannot exceed 100'),
})

export const SearchSchema = z.object({
  query: z.string().min(1, 'Search query is required'),
  ...PaginationSchema.shape,
})

// Form validation schemas
export const LoginFormSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
})

export const ProfileFormSchema = z.object({
  displayName: z.string().min(1, 'Display name is required').max(50, 'Display name must be less than 50 characters'),
  measurementStyle: z.enum(['metric', 'us']),
})

export const PreferencesFormSchema = z.object({
  measurementStyle: z.enum(['metric', 'us']),
  notifications: z.boolean(),
  theme: z.enum(['light', 'dark', 'auto']),
})

