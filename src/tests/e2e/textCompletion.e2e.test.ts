import dotenv from 'dotenv';
import { checkServerHealth, defaultCompletionRequest, makeCompletionRequest } from './setup';

// Load environment variables for tests
dotenv.config();

describe('Text Completion E2E Tests', () => {
  // Verify server is running before all tests
  beforeAll(async () => {
    const isHealthy = await checkServerHealth();
    if (!isHealthy) {
      throw new Error('Server is not healthy. Please ensure server is running before running E2E tests.');
    }
  });

  describe('POST /api/text-completion/complete', () => {
    it('should complete text successfully', async () => {
      // Make request to the API
      const response = await makeCompletionRequest(defaultCompletionRequest);

      // Assertions
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('completion');
      expect(response.body).toHaveProperty('originalText', defaultCompletionRequest.text);
      expect(typeof response.body.completion).toBe('string');
      expect(response.body.completion.length).toBeGreaterThan(0);
    }, 30000); // Increased timeout as LLM calls can take time

    it('should return 400 for missing text', async () => {
      // Test with missing text
      const { text, ...testDataWithoutText } = defaultCompletionRequest;

      // Make request to the API
      const response = await makeCompletionRequest(testDataWithoutText);

      // Assertions
      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error');
    });

    it('should handle invalid temperature parameter', async () => {
      // Test with invalid temperature
      const testData = {
        ...defaultCompletionRequest,
        temperature: 'invalid' // should be a number
      };

      // Make request to the API
      const response = await makeCompletionRequest(testData);

      // The API might handle this by using a default temperature
      // or it might return an error - test accordingly
      if (response.status === 200) {
        expect(response.body).toHaveProperty('completion');
        expect(response.body).toHaveProperty('originalText', testData.text);
      } else {
        expect(response.status).toBe(400);
        expect(response.body).toHaveProperty('error');
      }
    });

    it('should handle very long input text', async () => {
      // Create a long text input
      const longText = 'This is a test '.repeat(50); // Repeat to make it long
      
      const testData = {
        ...defaultCompletionRequest,
        text: longText
      };

      // Make request to the API
      const response = await makeCompletionRequest(testData);
      
      // Assertions
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('completion');
      expect(response.body).toHaveProperty('originalText', longText);
    }, 40000); // Longer timeout for long input
  });
}); 