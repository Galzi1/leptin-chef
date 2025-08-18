import { describe, it, expect } from 'vitest'
import {
  UserSchema,
  CreateUserSchema,
  UpdateUserSchema,
  RecipeSchema,
  CreateRecipeSchema,
  UpdateRecipeSchema,
  IngredientSchema,
  ConversationSchema,
  CreateConversationSchema,
  UpdateConversationSchema,
  MessageSchema,
  InventoryItemSchema,
  CreateInventoryItemSchema,
  UpdateInventoryItemSchema,
  PaginationSchema,
  SearchSchema,
  LoginFormSchema,
  ProfileFormSchema,
  PreferencesFormSchema,
} from '../validation'

describe('Feature: Data Validation Schemas', () => {
  describe('Scenario: User Schema Validation', () => {
    describe('Given a complete user object', () => {
      it('should validate successfully when all required fields are provided', () => {
        // Given - Complete valid user data
        const validUser = {
          id: '123e4567-e89b-12d3-a456-426614174000',
          displayName: 'John Doe',
          profilePicture: 'https://example.com/profile.jpg',
          measurementStyle: 'metric' as const,
          createdAt: new Date('2024-01-01'),
          updatedAt: new Date('2024-01-01'),
        }

        // When - Schema validation is performed
        const result = UserSchema.safeParse(validUser)

        // Then - Validation should succeed
        expect(result.success).toBe(true)
        if (result.success) {
          expect(result.data).toEqual(validUser)
        }
      })

      it('should validate successfully without optional profilePicture', () => {
        // Given - User data without optional field
        const validUser = {
          id: '123e4567-e89b-12d3-a456-426614174000',
          displayName: 'John Doe',
          measurementStyle: 'metric' as const,
          createdAt: new Date('2024-01-01'),
          updatedAt: new Date('2024-01-01'),
        }

        // When - Schema validation is performed
        const result = UserSchema.safeParse(validUser)

        // Then - Validation should succeed
        expect(result.success).toBe(true)
      })
    })

    describe('Given invalid user data', () => {
      it('should fail validation when displayName is empty', () => {
        // Given - User with empty display name
        const invalidUser = {
          id: '123e4567-e89b-12d3-a456-426614174000',
          displayName: '',
          measurementStyle: 'metric' as const,
          createdAt: new Date('2024-01-01'),
          updatedAt: new Date('2024-01-01'),
        }

        // When - Schema validation is performed
        const result = UserSchema.safeParse(invalidUser)

        // Then - Validation should fail
        expect(result.success).toBe(false)
        if (!result.success) {
          expect(result.error.issues[0].message).toContain('Display name is required')
        }
      })

      it('should fail validation when measurementStyle is invalid', () => {
        // Given - User with invalid measurement style
        const invalidUser = {
          id: '123e4567-e89b-12d3-a456-426614174000',
          displayName: 'John Doe',
          measurementStyle: 'imperial',
          createdAt: new Date('2024-01-01'),
          updatedAt: new Date('2024-01-01'),
        }

        // When - Schema validation is performed
        const result = UserSchema.safeParse(invalidUser)

        // Then - Validation should fail
        expect(result.success).toBe(false)
      })

      it('should fail validation when id is not a valid UUID', () => {
        // Given - User with invalid UUID
        const invalidUser = {
          id: 'invalid-uuid',
          displayName: 'John Doe',
          measurementStyle: 'metric' as const,
          createdAt: new Date('2024-01-01'),
          updatedAt: new Date('2024-01-01'),
        }

        // When - Schema validation is performed
        const result = UserSchema.safeParse(invalidUser)

        // Then - Validation should fail
        expect(result.success).toBe(false)
      })
    })

    describe('Given CreateUserSchema', () => {
      it('should validate user creation data without id and timestamps', () => {
        // Given - User creation data
        const createUserData = {
          displayName: 'John Doe',
          measurementStyle: 'metric' as const,
        }

        // When - Schema validation is performed
        const result = CreateUserSchema.safeParse(createUserData)

        // Then - Validation should succeed
        expect(result.success).toBe(true)
      })
    })

    describe('Given UpdateUserSchema', () => {
      it('should validate partial user update data', () => {
        // Given - Partial user update data
        const updateData = {
          displayName: 'Jane Doe',
        }

        // When - Schema validation is performed
        const result = UpdateUserSchema.safeParse(updateData)

        // Then - Validation should succeed
        expect(result.success).toBe(true)
      })
    })
  })

  describe('Scenario: Recipe Schema Validation', () => {
    describe('Given a complete recipe object', () => {
      it('should validate successfully when all required fields are provided', () => {
        // Given - Complete valid recipe data
        const validRecipe = {
          id: '123e4567-e89b-12d3-a456-426614174000',
          title: 'Chocolate Chip Cookies',
          description: 'Delicious homemade cookies',
          picture: 'https://example.com/cookies.jpg',
          ingredients: [
            {
              id: '123e4567-e89b-12d3-a456-426614174001',
              name: 'Flour',
              amount: 2,
              unit: 'cups',
              notes: 'All-purpose flour',
            },
          ],
          method: ['Mix ingredients', 'Bake for 15 minutes'],
          servings: 4,
          prepTime: 15,
          cookTime: 15,
          difficulty: 'easy' as const,
          tags: ['dessert', 'cookies'],
          usageCount: 5,
          createdAt: new Date('2024-01-01'),
          updatedAt: new Date('2024-01-01'),
        }

        // When - Schema validation is performed
        const result = RecipeSchema.safeParse(validRecipe)

        // Then - Validation should succeed
        expect(result.success).toBe(true)
      })

      it('should fail validation when ingredients array is empty', () => {
        // Given - Recipe with empty ingredients
        const invalidRecipe = {
          id: '123e4567-e89b-12d3-a456-426614174000',
          title: 'Chocolate Chip Cookies',
          ingredients: [],
          method: ['Mix ingredients', 'Bake for 15 minutes'],
          servings: 4,
          prepTime: 15,
          cookTime: 15,
          difficulty: 'easy' as const,
          tags: ['dessert', 'cookies'],
          usageCount: 5,
          createdAt: new Date('2024-01-01'),
          updatedAt: new Date('2024-01-01'),
        }

        // When - Schema validation is performed
        const result = RecipeSchema.safeParse(invalidRecipe)

        // Then - Validation should fail
        expect(result.success).toBe(false)
        if (!result.success) {
          expect(result.error.issues[0].message).toContain('At least one ingredient is required')
        }
      })
    })

    describe('Given ingredient validation', () => {
      it('should validate ingredient with all required fields', () => {
        // Given - Valid ingredient data
        const validIngredient = {
          id: '123e4567-e89b-12d3-a456-426614174001',
          name: 'Flour',
          amount: 2,
          unit: 'cups',
          notes: 'All-purpose flour',
        }

        // When - Schema validation is performed
        const result = IngredientSchema.safeParse(validIngredient)

        // Then - Validation should succeed
        expect(result.success).toBe(true)
      })

      it('should fail validation when amount is negative', () => {
        // Given - Ingredient with negative amount
        const invalidIngredient = {
          id: '123e4567-e89b-12d3-a456-426614174001',
          name: 'Flour',
          amount: -1,
          unit: 'cups',
        }

        // When - Schema validation is performed
        const result = IngredientSchema.safeParse(invalidIngredient)

        // Then - Validation should fail
        expect(result.success).toBe(false)
        if (!result.success) {
          expect(result.error.issues[0].message).toContain('Amount must be positive')
        }
      })
    })
  })

  describe('Scenario: Conversation Schema Validation', () => {
    describe('Given a complete conversation object', () => {
      it('should validate successfully when all required fields are provided', () => {
        // Given - Complete valid conversation data
        const validConversation = {
          id: '123e4567-e89b-12d3-a456-426614174000',
          title: 'Recipe Discussion',
          summary: 'Discussion about chocolate chip cookies',
          messages: [
            {
              id: '123e4567-e89b-12d3-a456-426614174001',
              content: 'How do I make cookies?',
              role: 'user' as const,
              timestamp: new Date('2024-01-01'),
            },
            {
              id: '123e4567-e89b-12d3-a456-426614174002',
              content: 'Here is a cookie recipe...',
              role: 'assistant' as const,
              timestamp: new Date('2024-01-01'),
              recipeId: '123e4567-e89b-12d3-a456-426614174003',
            },
          ],
          createdAt: new Date('2024-01-01'),
          updatedAt: new Date('2024-01-01'),
        }

        // When - Schema validation is performed
        const result = ConversationSchema.safeParse(validConversation)

        // Then - Validation should succeed
        expect(result.success).toBe(true)
      })
    })

    describe('Given message validation', () => {
      it('should validate message with valid role', () => {
        // Given - Valid message data
        const validMessage = {
          id: '123e4567-e89b-12d3-a456-426614174001',
          content: 'Hello, how can I help you?',
          role: 'assistant' as const,
          timestamp: new Date('2024-01-01'),
        }

        // When - Schema validation is performed
        const result = MessageSchema.safeParse(validMessage)

        // Then - Validation should succeed
        expect(result.success).toBe(true)
      })

      it('should fail validation with invalid role', () => {
        // Given - Message with invalid role
        const invalidMessage = {
          id: '123e4567-e89b-12d3-a456-426614174001',
          content: 'Hello',
          role: 'admin',
          timestamp: new Date('2024-01-01'),
        }

        // When - Schema validation is performed
        const result = MessageSchema.safeParse(invalidMessage)

        // Then - Validation should fail
        expect(result.success).toBe(false)
      })
    })
  })

  describe('Scenario: Inventory Schema Validation', () => {
    describe('Given a complete inventory item object', () => {
      it('should validate successfully when all required fields are provided', () => {
        // Given - Complete valid inventory item data
        const validInventoryItem = {
          id: '123e4567-e89b-12d3-a456-426614174000',
          name: 'Tomatoes',
          quantity: 5,
          unit: 'pieces',
          category: 'vegetables',
          expiryDate: new Date('2024-12-31'),
          notes: 'Fresh from garden',
          createdAt: new Date('2024-01-01'),
          updatedAt: new Date('2024-01-01'),
        }

        // When - Schema validation is performed
        const result = InventoryItemSchema.safeParse(validInventoryItem)

        // Then - Validation should succeed
        expect(result.success).toBe(true)
      })

      it('should validate successfully without optional fields', () => {
        // Given - Inventory item without optional fields
        const validInventoryItem = {
          id: '123e4567-e89b-12d3-a456-426614174000',
          name: 'Salt',
          quantity: 1,
          unit: 'kg',
          category: 'spices',
          createdAt: new Date('2024-01-01'),
          updatedAt: new Date('2024-01-01'),
        }

        // When - Schema validation is performed
        const result = InventoryItemSchema.safeParse(validInventoryItem)

        // Then - Validation should succeed
        expect(result.success).toBe(true)
      })

      it('should fail validation when quantity is not positive', () => {
        // Given - Inventory item with zero quantity
        const invalidInventoryItem = {
          id: '123e4567-e89b-12d3-a456-426614174000',
          name: 'Empty Container',
          quantity: 0,
          unit: 'pieces',
          category: 'containers',
          createdAt: new Date('2024-01-01'),
          updatedAt: new Date('2024-01-01'),
        }

        // When - Schema validation is performed
        const result = InventoryItemSchema.safeParse(invalidInventoryItem)

        // Then - Validation should fail
        expect(result.success).toBe(false)
        if (!result.success) {
          expect(result.error.issues[0].message).toContain('Quantity must be positive')
        }
      })
    })
  })

  describe('Scenario: API Schema Validation', () => {
    describe('Given pagination parameters', () => {
      it('should validate valid pagination data', () => {
        // Given - Valid pagination parameters
        const validPagination = {
          page: 1,
          limit: 10,
        }

        // When - Schema validation is performed
        const result = PaginationSchema.safeParse(validPagination)

        // Then - Validation should succeed
        expect(result.success).toBe(true)
      })

      it('should fail validation when page is less than 1', () => {
        // Given - Invalid pagination with page 0
        const invalidPagination = {
          page: 0,
          limit: 10,
        }

        // When - Schema validation is performed
        const result = PaginationSchema.safeParse(invalidPagination)

        // Then - Validation should fail
        expect(result.success).toBe(false)
        if (!result.success) {
          expect(result.error.issues[0].message).toContain('Page must be at least 1')
        }
      })

      it('should fail validation when limit exceeds 100', () => {
        // Given - Invalid pagination with limit over 100
        const invalidPagination = {
          page: 1,
          limit: 150,
        }

        // When - Schema validation is performed
        const result = PaginationSchema.safeParse(invalidPagination)

        // Then - Validation should fail
        expect(result.success).toBe(false)
        if (!result.success) {
          expect(result.error.issues[0].message).toContain('Limit cannot exceed 100')
        }
      })
    })

    describe('Given search parameters', () => {
      it('should validate search data with query and pagination', () => {
        // Given - Valid search parameters
        const validSearch = {
          query: 'chocolate',
          page: 1,
          limit: 20,
        }

        // When - Schema validation is performed
        const result = SearchSchema.safeParse(validSearch)

        // Then - Validation should succeed
        expect(result.success).toBe(true)
      })

      it('should fail validation when query is empty', () => {
        // Given - Search with empty query
        const invalidSearch = {
          query: '',
          page: 1,
          limit: 20,
        }

        // When - Schema validation is performed
        const result = SearchSchema.safeParse(invalidSearch)

        // Then - Validation should fail
        expect(result.success).toBe(false)
        if (!result.success) {
          expect(result.error.issues[0].message).toContain('Search query is required')
        }
      })
    })
  })

  describe('Scenario: Form Schema Validation', () => {
    describe('Given login form data', () => {
      it('should validate valid login credentials', () => {
        // Given - Valid login form data
        const validLogin = {
          email: 'user@example.com',
          password: 'password123',
        }

        // When - Schema validation is performed
        const result = LoginFormSchema.safeParse(validLogin)

        // Then - Validation should succeed
        expect(result.success).toBe(true)
      })

      it('should fail validation with invalid email format', () => {
        // Given - Login with invalid email
        const invalidLogin = {
          email: 'not-an-email',
          password: 'password123',
        }

        // When - Schema validation is performed
        const result = LoginFormSchema.safeParse(invalidLogin)

        // Then - Validation should fail
        expect(result.success).toBe(false)
        if (!result.success) {
          expect(result.error.issues[0].message).toContain('Invalid email address')
        }
      })

      it('should fail validation with short password', () => {
        // Given - Login with short password
        const invalidLogin = {
          email: 'user@example.com',
          password: '123',
        }

        // When - Schema validation is performed
        const result = LoginFormSchema.safeParse(invalidLogin)

        // Then - Validation should fail
        expect(result.success).toBe(false)
        if (!result.success) {
          expect(result.error.issues[0].message).toContain('Password must be at least 6 characters')
        }
      })
    })

    describe('Given profile form data', () => {
      it('should validate valid profile data', () => {
        // Given - Valid profile form data
        const validProfile = {
          displayName: 'John Doe',
          measurementStyle: 'metric' as const,
        }

        // When - Schema validation is performed
        const result = ProfileFormSchema.safeParse(validProfile)

        // Then - Validation should succeed
        expect(result.success).toBe(true)
      })
    })

    describe('Given preferences form data', () => {
      it('should validate valid preferences data', () => {
        // Given - Valid preferences form data
        const validPreferences = {
          measurementStyle: 'us' as const,
          notifications: true,
          theme: 'dark' as const,
        }

        // When - Schema validation is performed
        const result = PreferencesFormSchema.safeParse(validPreferences)

        // Then - Validation should succeed
        expect(result.success).toBe(true)
      })
    })
  })

  describe('Scenario: Edge Cases and Boundary Testing', () => {
    describe('Given string length limits', () => {
      it('should validate displayName at maximum length', () => {
        // Given - DisplayName at 50 character limit
        const userData = {
          displayName: 'A'.repeat(50),
          measurementStyle: 'metric' as const,
        }

        // When - Schema validation is performed
        const result = CreateUserSchema.safeParse(userData)

        // Then - Validation should succeed
        expect(result.success).toBe(true)
      })

      it('should fail validation when displayName exceeds maximum length', () => {
        // Given - DisplayName exceeding 50 character limit
        const userData = {
          displayName: 'A'.repeat(51),
          measurementStyle: 'metric' as const,
        }

        // When - Schema validation is performed
        const result = CreateUserSchema.safeParse(userData)

        // Then - Validation should fail
        expect(result.success).toBe(false)
        if (!result.success) {
          expect(result.error.issues[0].message).toContain('Display name must be less than 50 characters')
        }
      })
    })

    describe('Given numeric boundaries', () => {
      it('should validate zero prep time and cook time', () => {
        // Given - Recipe with zero prep and cook time
        const recipeData = {
          title: 'No-Prep Recipe',
          ingredients: [
            {
              id: '123e4567-e89b-12d3-a456-426614174001',
              name: 'Water',
              amount: 1,
              unit: 'cup',
            },
          ],
          method: ['Serve immediately'],
          servings: 1,
          prepTime: 0,
          cookTime: 0,
          difficulty: 'easy' as const,
          tags: ['quick'],
        }

        // When - Schema validation is performed
        const result = CreateRecipeSchema.safeParse(recipeData)

        // Then - Validation should succeed
        expect(result.success).toBe(true)
      })

      it('should fail validation with negative prep time', () => {
        // Given - Recipe with negative prep time
        const recipeData = {
          title: 'Invalid Recipe',
          ingredients: [
            {
              id: '123e4567-e89b-12d3-a456-426614174001',
              name: 'Water',
              amount: 1,
              unit: 'cup',
            },
          ],
          method: ['Serve'],
          servings: 1,
          prepTime: -5,
          cookTime: 0,
          difficulty: 'easy' as const,
          tags: [],
        }

        // When - Schema validation is performed
        const result = CreateRecipeSchema.safeParse(recipeData)

        // Then - Validation should fail
        expect(result.success).toBe(false)
        if (!result.success) {
          expect(result.error.issues[0].message).toContain('Prep time cannot be negative')
        }
      })
    })
  })
})