/**
 * API Testing Utilities
 * 
 * Utilities for testing Next.js API routes with proper request/response mocking
 */

import { createRequest, createResponse } from 'node-mocks-http'
import type { NextApiRequest, NextApiResponse } from 'next'
import { vi } from 'vitest'

export type MockRequest = ReturnType<typeof createRequest> & NextApiRequest
export type MockResponse = ReturnType<typeof createResponse> & NextApiResponse

/**
 * Creates a mock HTTP request for testing API routes
 */
export function createMockRequest(options: {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH'
  url?: string
  query?: Record<string, string | string[]>
  body?: any
  headers?: Record<string, string>
  cookies?: Record<string, string>
}): MockRequest {
  return createRequest({
    method: options.method || 'GET',
    url: options.url || '/',
    query: options.query || {},
    body: options.body,
    headers: {
      'content-type': 'application/json',
      ...options.headers,
    },
    cookies: options.cookies || {},
  }) as MockRequest
}

/**
 * Creates a mock HTTP response for testing API routes
 */
export function createMockResponse(): MockResponse {
  const res = createResponse() as MockResponse
  
  // Add spy methods for testing
  res.status = vi.fn().mockReturnValue(res)
  res.json = vi.fn().mockReturnValue(res)
  res.send = vi.fn().mockReturnValue(res)
  res.end = vi.fn().mockReturnValue(res)
  res.setHeader = vi.fn().mockReturnValue(res)
  
  return res
}

/**
 * Test helper for API route handlers
 */
export async function testApiHandler(
  handler: (req: NextApiRequest, res: NextApiResponse) => Promise<void> | void,
  options: {
    method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH'
    url?: string
    query?: Record<string, string | string[]>
    body?: any
    headers?: Record<string, string>
    cookies?: Record<string, string>
  }
) {
  const req = createMockRequest(options)
  const res = createMockResponse()
  
  await handler(req, res)
  
  return { req, res }
}

/**
 * Assertions for API response testing
 */
export const apiAssertions = {
  expectStatus(res: MockResponse, expectedStatus: number) {
    expect(res.status).toHaveBeenCalledWith(expectedStatus)
  },

  expectJson(res: MockResponse, expectedData?: any) {
    expect(res.json).toHaveBeenCalled()
    if (expectedData !== undefined) {
      expect(res.json).toHaveBeenCalledWith(expectedData)
    }
  },

  expectError(res: MockResponse, status: number, message?: string) {
    expect(res.status).toHaveBeenCalledWith(status)
    expect(res.json).toHaveBeenCalled()
    
    if (message) {
      const callArgs = vi.mocked(res.json).mock.calls[0][0]
      expect(callArgs.error || callArgs.message).toContain(message)
    }
  },

  expectHeader(res: MockResponse, header: string, value: string) {
    expect(res.setHeader).toHaveBeenCalledWith(header, value)
  },
}

/**
 * Mock database for testing
 */
export const mockDatabase = {
  users: new Map(),
  recipes: new Map(),
  conversations: new Map(),
  inventory: new Map(),

  reset() {
    this.users.clear()
    this.recipes.clear()
    this.conversations.clear()
    this.inventory.clear()
  },

  seed(data: {
    users?: any[]
    recipes?: any[]
    conversations?: any[]
    inventory?: any[]
  }) {
    data.users?.forEach(user => this.users.set(user.id, user))
    data.recipes?.forEach(recipe => this.recipes.set(recipe.id, recipe))
    data.conversations?.forEach(conv => this.conversations.set(conv.id, conv))
    data.inventory?.forEach(item => this.inventory.set(item.id, item))
  },
}

/**
 * Authentication helpers for testing protected routes
 */
export const authHelpers = {
  createAuthHeaders(userId: string = 'test-user-id'): Record<string, string> {
    return {
      'authorization': `Bearer test-token-${userId}`,
    }
  },

  createAuthCookies(userId: string = 'test-user-id'): Record<string, string> {
    return {
      'auth-token': `test-token-${userId}`,
    }
  },
}