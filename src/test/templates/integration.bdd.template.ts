/**
 * BDD Integration Test Template
 * 
 * This template provides a structure for writing BDD-style integration tests
 * that test the interaction between multiple components, stores, and services.
 * 
 * Usage:
 * 1. Copy this template
 * 2. Replace [FeatureName] with your actual feature name
 * 3. Replace placeholder scenarios with actual test cases
 * 4. Follow the Given-When-Then structure for each test
 */

import { describe, it, expect, beforeEach, vi } from 'vitest'
import { screen, fireEvent, waitFor } from '@testing-library/react'
import { render, createMockUser, createMockRecipe } from '../utils'
import { App } from '../../App' // Or specific feature component

// Mock external services
vi.mock('../../services/api', () => ({
  apiClient: {
    get: vi.fn(),
    post: vi.fn(),
    put: vi.fn(),
    delete: vi.fn(),
  },
}))

describe('FeatureName Integration', () => {
  describe('Feature: [End-to-end user workflow]', () => {
    beforeEach(() => {
      vi.clearAllMocks()
      // Reset any global state
    })

    describe('Scenario: User completes full workflow', () => {
      it('should allow user to [complete workflow description]', async () => {
        // Given - User is on the application with initial data
        const mockUser = createMockUser()
        const mockRecipe = createMockRecipe()
        
        // Mock API responses
        vi.mocked(apiClient.get).mockResolvedValueOnce({ data: mockUser })
        vi.mocked(apiClient.post).mockResolvedValueOnce({ data: mockRecipe })

        // When - Application is loaded
        render(<App />)

        // Then - Initial state should be displayed
        expect(screen.getByText('Welcome')).toBeInTheDocument()

        // When - User navigates to feature
        const featureLink = screen.getByRole('link', { name: /feature name/i })
        fireEvent.click(featureLink)

        // Then - Feature page should load
        await waitFor(() => {
          expect(screen.getByText('Feature Page Title')).toBeInTheDocument()
        })

        // When - User performs primary action
        const actionButton = screen.getByRole('button', { name: /primary action/i })
        fireEvent.click(actionButton)

        // Then - Action should complete successfully
        await waitFor(() => {
          expect(screen.getByText('Success message')).toBeInTheDocument()
        })

        // And - API should have been called correctly
        expect(vi.mocked(apiClient.post)).toHaveBeenCalledWith('/api/endpoint', {
          expectedData: 'value'
        })
      })

      it('should handle workflow errors gracefully', async () => {
        // Given - API will return an error
        vi.mocked(apiClient.post).mockRejectedValueOnce(new Error('API Error'))

        // When - User attempts the workflow
        render(<App />)
        const actionButton = screen.getByRole('button', { name: /primary action/i })
        fireEvent.click(actionButton)

        // Then - Error should be displayed to user
        await waitFor(() => {
          expect(screen.getByText('Error occurred')).toBeInTheDocument()
        })
      })
    })

    describe('Scenario: Cross-component communication', () => {
      it('should synchronize state between components', async () => {
        // Given - Multiple components that share state
        render(<App />)

        // When - State is modified in one component
        const input = screen.getByLabelText(/input field/i)
        fireEvent.change(input, { target: { value: 'new value' } })

        // Then - Other components should reflect the change
        await waitFor(() => {
          expect(screen.getByText('new value')).toBeInTheDocument()
        })
      })
    })
  })

  describe('Feature: [Another integration feature]', () => {
    // Additional integration tests
  })
})