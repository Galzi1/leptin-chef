/**
 * BDD API Test Template
 * 
 * This template provides a structure for writing BDD-style tests for Next.js API routes
 * following the Given-When-Then pattern.
 * 
 * Usage:
 * 1. Copy this template
 * 2. Replace [EndpointName] with your actual API endpoint name
 * 3. Replace placeholder scenarios with actual test cases
 * 4. Follow the Given-When-Then structure for each test
 */

import { describe, it, expect, beforeEach, vi } from 'vitest'
import { testApiHandler, apiAssertions, mockDatabase, authHelpers } from '../api-utils'
import handler from '../../pages/api/endpoint-name' // Replace with actual API route import
import { createMockUser, createMockRecipe } from '../utils'

describe('API: /api/endpoint-name', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockDatabase.reset()
  })

  describe('Feature: [API Feature Name]', () => {
    describe('Scenario: GET request with valid parameters', () => {
      it('should return data when valid request is made', async () => {
        // Given - Database has test data
        const mockUser = createMockUser()
        mockDatabase.seed({ users: [mockUser] })

        // When - GET request is made to the endpoint
        const { res } = await testApiHandler(handler, {
          method: 'GET',
          query: { id: mockUser.id },
          headers: authHelpers.createAuthHeaders(mockUser.id),
        })

        // Then - Response should be successful
        apiAssertions.expectStatus(res, 200)
        apiAssertions.expectJson(res, {
          success: true,
          data: expect.objectContaining({
            id: mockUser.id,
            displayName: mockUser.displayName,
          }),
        })
      })

      it('should return 404 when resource not found', async () => {
        // Given - Database is empty
        mockDatabase.reset()

        // When - GET request is made for non-existent resource
        const { res } = await testApiHandler(handler, {
          method: 'GET',
          query: { id: 'non-existent-id' },
          headers: authHelpers.createAuthHeaders(),
        })

        // Then - Should return 404 error
        apiAssertions.expectError(res, 404, 'Resource not found')
      })
    })

    describe('Scenario: POST request creates new resource', () => {
      it('should create resource when valid data is provided', async () => {
        // Given - User is authenticated and has valid data
        const mockUser = createMockUser()
        const newResourceData = {
          name: 'Test Resource',
          description: 'Test description',
        }

        // When - POST request is made with valid data
        const { res } = await testApiHandler(handler, {
          method: 'POST',
          body: newResourceData,
          headers: authHelpers.createAuthHeaders(mockUser.id),
        })

        // Then - Resource should be created successfully
        apiAssertions.expectStatus(res, 201)
        apiAssertions.expectJson(res, {
          success: true,
          data: expect.objectContaining({
            id: expect.any(String),
            name: newResourceData.name,
            description: newResourceData.description,
            createdAt: expect.any(String),
          }),
        })
      })

      it('should validate required fields', async () => {
        // Given - Request data is missing required fields
        const invalidData = {
          // Missing required fields
          description: 'Test description',
        }

        // When - POST request is made with invalid data
        const { res } = await testApiHandler(handler, {
          method: 'POST',
          body: invalidData,
          headers: authHelpers.createAuthHeaders(),
        })

        // Then - Should return validation error
        apiAssertions.expectError(res, 400, 'validation')
      })
    })

    describe('Scenario: PUT request updates existing resource', () => {
      it('should update resource when valid data is provided', async () => {
        // Given - Resource exists in database
        const existingResource = createMockRecipe()
        mockDatabase.seed({ recipes: [existingResource] })
        const updateData = { title: 'Updated Title' }

        // When - PUT request is made with valid update data
        const { res } = await testApiHandler(handler, {
          method: 'PUT',
          query: { id: existingResource.id },
          body: updateData,
          headers: authHelpers.createAuthHeaders(),
        })

        // Then - Resource should be updated successfully
        apiAssertions.expectStatus(res, 200)
        apiAssertions.expectJson(res, {
          success: true,
          data: expect.objectContaining({
            id: existingResource.id,
            title: updateData.title,
            updatedAt: expect.any(String),
          }),
        })
      })
    })

    describe('Scenario: DELETE request removes resource', () => {
      it('should delete resource when valid ID is provided', async () => {
        // Given - Resource exists in database
        const existingResource = createMockRecipe()
        mockDatabase.seed({ recipes: [existingResource] })

        // When - DELETE request is made
        const { res } = await testApiHandler(handler, {
          method: 'DELETE',
          query: { id: existingResource.id },
          headers: authHelpers.createAuthHeaders(),
        })

        // Then - Resource should be deleted successfully
        apiAssertions.expectStatus(res, 204)
      })
    })

    describe('Scenario: Authentication and authorization', () => {
      it('should require authentication', async () => {
        // Given - No authentication headers provided
        // When - Request is made without authentication
        const { res } = await testApiHandler(handler, {
          method: 'GET',
        })

        // Then - Should return 401 unauthorized
        apiAssertions.expectError(res, 401, 'authentication required')
      })

      it('should check user permissions', async () => {
        // Given - User does not have required permissions
        const unauthorizedUser = createMockUser({ role: 'guest' })

        // When - Request is made by unauthorized user
        const { res } = await testApiHandler(handler, {
          method: 'POST',
          body: { name: 'Test' },
          headers: authHelpers.createAuthHeaders(unauthorizedUser.id),
        })

        // Then - Should return 403 forbidden
        apiAssertions.expectError(res, 403, 'insufficient permissions')
      })
    })

    describe('Scenario: Error handling', () => {
      it('should handle server errors gracefully', async () => {
        // Given - Database operation will fail
        vi.mocked(mockDatabase.users.get).mockImplementation(() => {
          throw new Error('Database connection failed')
        })

        // When - Request is made that triggers database error
        const { res } = await testApiHandler(handler, {
          method: 'GET',
          query: { id: 'test-id' },
          headers: authHelpers.createAuthHeaders(),
        })

        // Then - Should return 500 server error
        apiAssertions.expectError(res, 500, 'Internal server error')
      })

      it('should handle malformed requests', async () => {
        // Given - Request has malformed JSON body
        // When - POST request is made with invalid JSON
        const { res } = await testApiHandler(handler, {
          method: 'POST',
          headers: {
            'content-type': 'application/json',
            ...authHelpers.createAuthHeaders(),
          },
          // Simulate malformed JSON by providing invalid body
        })

        // Then - Should return 400 bad request
        apiAssertions.expectError(res, 400, 'Invalid request format')
      })
    })
  })

  describe('Feature: [Another API Feature]', () => {
    // Additional API endpoint tests following the same pattern
  })
})