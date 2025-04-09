import { LLMRequestOptions, LLMResponse, LLMServicePort } from '../../../../application/ports/LLMServicePort';

/**
 * Mock implementation of the LLM adapter for testing
 * This avoids making actual API calls during tests
 */
export class MockLLMAdapter implements LLMServicePort {
  /**
   * Default configuration options
   */
  private config = {
    defaultModel: 'mock-model',
    defaultMaxTokens: 100,
    defaultTemperature: 0.7
  };

  /**
   * Generate a completion response without calling any external API
   * @param prompt The prompt text
   * @param options Optional parameters 
   * @returns A mock LLM response
   */
  async generateCompletion(prompt: string, options?: LLMRequestOptions): Promise<LLMResponse> {
    // Validate input
    if (!prompt || typeof prompt !== 'string') {
      throw new Error('Prompt must be a non-empty string');
    }

    // Use default options if not provided
    const mergedOptions = {
      model: options?.model || this.config.defaultModel,
      maxTokens: options?.maxTokens || this.config.defaultMaxTokens,
      temperature: options?.temperature || this.config.defaultTemperature
    };

    // Generate a simple predictable response based on the input
    const mockCompletions = [
      "an Express framework for handling HTTP requests.",
      "Typescript to ensure type safety in the codebase.",
      "hexagonal architecture to separate concerns.",
      "dependency injection for better maintainability."
    ];
    
    // Choose a completion based on some aspect of the input to make it deterministic
    const index = prompt.length % mockCompletions.length;
    const completion = mockCompletions[index];
    
    // Calculate fake token usage based on input/output length
    const promptTokens = Math.ceil(prompt.length / 4);
    const completionTokens = Math.ceil(completion.length / 4);
    
    // Return a structured response similar to a real LLM
    return {
      text: completion,
      usage: {
        promptTokens,
        completionTokens,
        totalTokens: promptTokens + completionTokens
      }
    };
  }
} 