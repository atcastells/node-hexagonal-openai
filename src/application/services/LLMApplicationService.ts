import { LLMRequestOptions, LLMResponse, LLMServicePort } from '../ports/LLMServicePort';

export class LLMApplicationService {
  constructor(private readonly llmService: LLMServicePort) {}

  /**
   * Generate a completion from the LLM service
   * @param prompt The prompt to send to the LLM
   * @param options Optional parameters for the LLM request
   * @returns The LLM response
   */
  async generateCompletion(prompt: string, options?: LLMRequestOptions): Promise<LLMResponse> {
    return this.llmService.generateCompletion(prompt, options);
  }

  /**
   * Simple wrapper for common text generation with minimal options
   * @param prompt The prompt to generate text from
   * @param temperature Optional temperature parameter (0-1)
   * @param maxTokens Optional maximum tokens to generate
   * @returns The generated text
   */
  async generateText(prompt: string, temperature?: number, maxTokens?: number): Promise<string> {
    const response = await this.llmService.generateCompletion(prompt, {
      temperature,
      maxTokens
    });
    return response.text;
  }
} 