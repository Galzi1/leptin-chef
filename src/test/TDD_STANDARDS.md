# TDD/BDD Testing Standards for Leptin Chef

## Overview

This document establishes testing standards and guidelines for the Leptin Chef project, following Test-Driven Development (TDD) and Behavior-Driven Development (BDD) methodologies.

## TDD Workflow (Red-Green-Refactor)

### 1. Red Phase - Write Failing Tests
- Write a test that describes the desired behavior
- Test should fail initially (red)
- Focus on the interface and expected behavior, not implementation

### 2. Green Phase - Make Tests Pass
- Write minimal code to make the test pass
- Don't optimize or over-engineer at this stage
- Goal is to get to green as quickly as possible

### 3. Refactor Phase - Improve Code Quality
- Refactor both test and production code
- Maintain test coverage while improving design
- Tests should still pass after refactoring

## BDD Approach - Given-When-Then

### Structure
```typescript
describe('Feature: User Authentication', () => {
  describe('Scenario: User logs in with valid credentials', () => {
    it('should grant access when credentials are correct', () => {
      // Given - Initial state/conditions
      const validCredentials = { email: 'test@example.com', password: 'password' }
      
      // When - Action is performed
      const result = authenticateUser(validCredentials)
      
      // Then - Expected outcome
      expect(result.success).toBe(true)
      expect(result.user).toBeDefined()
    })
  })
})
```

## Testing Hierarchy

### 1. Unit Tests (70% of tests)
- Test individual functions, components, or modules in isolation
- Fast execution, no external dependencies
- Use templates: `component.bdd.template.ts`, `store.bdd.template.ts`

### 2. Integration Tests (20% of tests)
- Test interaction between multiple components/modules
- Test API routes and data flow
- Use templates: `integration.bdd.template.ts`, `api.bdd.template.ts`

### 3. End-to-End Tests (10% of tests)
- Test complete user workflows
- Test critical paths through the application
- Manual testing or future E2E framework integration

## File Naming Conventions

- Unit tests: `ComponentName.test.tsx`, `functionName.test.ts`
- Integration tests: `FeatureName.integration.test.tsx`
- API tests: `endpointName.api.test.ts`
- Test utilities: `testUtils.ts`, `mockData.ts`

## Test Organization

### Directory Structure
```
src/
├── test/
│   ├── setup.ts                 # Test environment setup
│   ├── utils.tsx               # Common test utilities
│   ├── api-utils.ts           # API testing utilities
│   └── templates/             # BDD test templates
├── components/
│   ├── ComponentName.tsx
│   └── __tests__/
│       └── ComponentName.test.tsx
├── stores/
│   ├── storeName.ts
│   └── __tests__/
│       └── storeName.test.ts
└── pages/
    └── api/
        ├── endpoint.ts
        └── __tests__/
            └── endpoint.api.test.ts
```

## Test Writing Guidelines

### 1. Test Names Should Be Descriptive
```typescript
// ❌ Bad
it('should work', () => {})

// ✅ Good
it('should display error message when invalid email is provided', () => {})
```

### 2. Use AAA Pattern (Arrange, Act, Assert)
```typescript
it('should update user profile when valid data is submitted', () => {
  // Arrange - Set up test data and conditions
  const user = createMockUser()
  const updateData = { displayName: 'New Name' }
  
  // Act - Perform the action
  const result = updateUserProfile(user.id, updateData)
  
  // Assert - Verify the outcome
  expect(result.displayName).toBe('New Name')
})
```

### 3. Test One Thing at a Time
Each test should verify a single behavior or outcome.

### 4. Use Meaningful Test Data
```typescript
// ❌ Bad
const user = { name: 'a', email: 'b' }

// ✅ Good
const user = createMockUser({
  displayName: 'John Doe',
  email: 'john.doe@example.com'
})
```

## Mock Strategy

### 1. Mock External Dependencies
- API calls
- Database connections
- Third-party services
- File system operations

### 2. Use Dependency Injection
Make components testable by injecting dependencies:
```typescript
// ❌ Hard to test
const saveData = async (data) => {
  await apiClient.post('/api/data', data)
}

// ✅ Easy to test
const saveData = async (data, client = apiClient) => {
  await client.post('/api/data', data)
}
```

### 3. Prefer Real Objects Over Mocks When Possible
- Use real objects for simple value objects
- Mock complex dependencies and I/O operations

## Coverage Requirements

### Minimum Coverage Thresholds
- Statements: 80%
- Branches: 80%
- Functions: 80%
- Lines: 80%

### Coverage Goals
- Critical business logic: 95%+
- UI components: 80%+
- Utility functions: 90%+

## Test Categories

### 1. Happy Path Tests
Test the main success scenarios where everything works as expected.

### 2. Error Handling Tests
Test how the system behaves when things go wrong:
- Invalid input
- Network failures
- Permission errors
- Server errors

### 3. Edge Case Tests
Test boundary conditions:
- Empty data
- Maximum limits
- Null/undefined values
- Special characters

### 4. Regression Tests
Add tests for every bug fix to prevent regressions.

## Performance Testing Guidelines

### 1. Component Rendering Performance
Test that components render within acceptable time limits.

### 2. Memory Leaks
Ensure components clean up properly when unmounted.

### 3. API Response Times
Mock API calls should simulate realistic response times.

## Testing Anti-Patterns to Avoid

### 1. Testing Implementation Details
Focus on behavior, not internal implementation.

### 2. Overly Complex Test Setup
If test setup is complex, consider refactoring the code under test.

### 3. Testing Too Much in One Test
Keep tests focused and atomic.

### 4. Ignoring Test Maintenance
Update tests when requirements change.

## Tools and Utilities

### Available Test Utilities
- `render()` - Custom render with providers
- `createMockUser()` - User test data factory
- `createMockRecipe()` - Recipe test data factory
- `createMockConversation()` - Conversation test data factory
- `createMockInventoryItem()` - Inventory test data factory
- `testApiHandler()` - API route testing helper
- `apiAssertions` - Common API test assertions

### Running Tests
```bash
# Run all tests
npm run test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage

# Run specific test file
npm run test ComponentName.test.tsx

# Run tests in UI mode
npm run test:ui
```

## Code Quality Gates

Before committing code, ensure:
1. All tests pass
2. Coverage thresholds are met
3. No linting errors
4. TypeScript compilation succeeds
5. New features have corresponding tests

## Example Workflows

### Adding a New Component (TDD)
1. Write failing test describing component behavior
2. Create minimal component implementation
3. Make test pass
4. Refactor and add more test cases
5. Add integration tests if needed

### Fixing a Bug (TDD)
1. Write test that reproduces the bug
2. Verify test fails
3. Fix the bug
4. Verify test passes
5. Add regression test

### Adding New API Endpoint (TDD)
1. Write API test describing expected behavior
2. Implement minimal endpoint
3. Make test pass
4. Add validation and error handling tests
5. Refactor and optimize

## Continuous Improvement

Regularly review and update these standards based on:
- Team feedback
- New testing patterns discovered
- Framework updates
- Project evolution

Remember: The goal is maintainable, reliable code that gives confidence in refactoring and adding new features.