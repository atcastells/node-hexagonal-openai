import request from 'supertest';
import express from 'express';
import dotenv from 'dotenv';
import { TextCompletionController } from '../../infrastructure/adapters/primary/http/controllers/TextCompletionController';
import { TextCompletionUseCase } from '../../application/usecases/TextCompletionUseCase';
import { LLMApplicationService } from '../../application/services/LLMApplicationService';
import { MockLLMAdapter } from '../../infrastructure/adapters/secondary/llm/MockLLMAdapter';

// Load environment variables
dotenv.config();

describe('Text Completion E2E Tests with Mock LLM', () => {
  // Set up a test app with mock dependencies
  const app = express();
  let server: any;
  
  beforeAll(() => {
    // Configure app
    app.use(express.json());
    
    // Set up the adapter chain with mock LLM
    const mockAdapter = new MockLLMAdapter();
    const llmService = new LLMApplicationService(mockAdapter);
    const textCompletionUseCase = new TextCompletionUseCase(llmService);
    const textCompletionController = new TextCompletionController(textCompletionUseCase);
    
    // Add routes
    app.post('/api/text-completion/complete', (req, res) => 
      textCompletionController.completeText(req, res)
    );
    
    // Add health check
    app.get('/health', (req, res) => {
      res.status(200).json({ status: 'ok', message: 'Test server is running' });
    });
    
    // Start server on a test port
    const port = 3001;
    server = app.listen(port);
  });
  
  afterAll((done) => {
    // Clean up the test server only, not the main server
    if (server) {
      server.close(() => {
        console.log('Mock test server closed successfully');
        done();
      });
    } else {
      done();
    }
  });

  describe('POST /api/text-completion/complete with mock LLM', () => {
    it('should complete text successfully using mock adapter', async () => {
      // Test data
      const testData = {
        text: 'Implement a Node.js server with',
        maxTokens: 50,
        temperature: 0.5
      };

      // Make request to the test API
      const response = await request(app)
        .post('/api/text-completion/complete')
        .send(testData)
        .set('Accept', 'application/json');

      // Assertions
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('completion');
      expect(response.body).toHaveProperty('originalText', testData.text);
      expect(typeof response.body.completion).toBe('string');
      expect(response.body.completion.length).toBeGreaterThan(0);
      
      // Should contain one of our mock responses
      const mockResponses = [
        "an Express framework for handling HTTP requests.",
        "Typescript to ensure type safety in the codebase.",
        "hexagonal architecture to separate concerns.",
        "dependency injection for better maintainability."
      ];
      expect(mockResponses).toContain(response.body.completion);
    });

    it('should include usage information in response', async () => {
      // Test data
      const testData = {
        text: 'Implement a Node.js API',
        maxTokens: 50
      };

      // Make request to the test API
      const response = await request(app)
        .post('/api/text-completion/complete')
        .send(testData)
        .set('Accept', 'application/json');

      // Assertions for usage stats
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('usage');
      expect(response.body.usage).toHaveProperty('promptTokens');
      expect(response.body.usage).toHaveProperty('completionTokens');
      expect(response.body.usage).toHaveProperty('totalTokens');
      
      // Check token math
      expect(response.body.usage.totalTokens).toBe(
        response.body.usage.promptTokens + response.body.usage.completionTokens
      );
    });
  });
}); 