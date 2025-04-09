# End-to-End (E2E) Tests

This directory contains end-to-end tests that verify the complete functionality of the API, testing the entire request-response cycle through all layers of the hexagonal architecture.

## Test Categories

1. **Real API Tests** (`textCompletion.e2e.test.ts`)
   - Tests the Text Completion API with actual LLM providers
   - Requires the application to be running and properly configured
   - Will make real API calls to the configured LLM provider

2. **Mock Tests** (`mockLLM.e2e.test.ts`)
   - Uses a mock LLM adapter that does not make external API calls
   - Faster and doesn't require external credentials
   - Good for CI/CD pipelines and development

## Running the Tests

### Prerequisites

For running real API tests:
- Server must be running (`npm run dev`)
- Valid API keys in `.env` file
- Proper configuration in environment variables

For mock tests:
- No external dependencies required

### Commands

Run all E2E tests:
```bash
npm run test:e2e
```

Run only mock E2E tests (recommended for CI/CD):
```bash
npx jest src/tests/e2e/mockLLM.e2e.test.ts
```

Run only real API E2E tests:
```bash
npx jest src/tests/e2e/textCompletion.e2e.test.ts
```

## Notes

- E2E tests may take longer to run, especially with actual API calls
- Mock tests provide a deterministic output for reliable testing
- For CI/CD environments, use the mock adapter by setting `LLM_PROVIDER_TYPE=mock` in the environment

## Adding New Tests

When adding new E2E tests:

1. Consider if a real API test is necessary or if a mock would suffice
2. Add appropriate timeouts for external API calls
3. Use the helper functions in `setup.ts` to reduce duplication
4. Ensure proper cleanup in afterAll() hooks 