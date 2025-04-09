import { ChatMessage, LLMRequestOptions, LLMResponse, LLMServicePort } from '../../../../application/ports/LLMServicePort';

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
   * Generate a chat completion response without calling any external API
   * @param messages The array of chat messages
   * @param options Optional parameters 
   * @returns A mock LLM response
   */
  async generateChatCompletion(messages: ChatMessage[], options?: LLMRequestOptions): Promise<LLMResponse> {
    // Validate input
    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      throw new Error('Messages must be a non-empty array');
    }

    // Use default options if not provided
    const mergedOptions = {
      model: options?.model || this.config.defaultModel,
      maxTokens: options?.maxTokens || this.config.defaultMaxTokens,
      temperature: options?.temperature || this.config.defaultTemperature,
      systemPrompt: options?.systemPrompt
    };

    // Extract the last user message for generating a response
    const lastUserMessage = [...messages].reverse().find(m => m.role === 'user');
    if (!lastUserMessage) {
      throw new Error('No user message found in the conversation');
    }

    // Generate a simple predictable response based on the input
    const mockCompletions = [
      "I'm using the hexagonal architecture pattern with TypeScript.",
      "The chat interface allows for multi-turn conversations.",
      "This is a mock response for testing the chat completion functionality.",
      "You can use system prompts to guide the model's behavior."
    ];
    
    // Choose a completion based on some aspect of the input to make it deterministic
    const index = lastUserMessage.content.length % mockCompletions.length;
    const completion = mockCompletions[index];
    
    // Calculate fake token usage based on messages length
    const messageString = messages.map(m => m.content).join(' ');
    const promptTokens = Math.ceil(messageString.length / 4);
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