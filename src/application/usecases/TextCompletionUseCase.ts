import { LLMApplicationService } from '../services/LLMApplicationService';

export interface TextCompletionRequest {
  text: string;
  maxTokens?: number;
  temperature?: number;
}

export interface TextCompletionResponse {
  completion: string;
  originalText: string;
  usage?: {
    promptTokens?: number;
    completionTokens?: number;
    totalTokens?: number;
  };
}

/**
 * Use case for text completion functionality
 */
export class TextCompletionUseCase {
  constructor(private readonly llmService: LLMApplicationService) {}

  /**
   * Complete the provided text using the LLM service
   * @param request The text completion request containing the text to complete
   * @returns The completed text response
   */
  async completeText(request: TextCompletionRequest): Promise<TextCompletionResponse> {
    const { text, maxTokens, temperature } = request;
    
    // Call the LLM service to generate the completion
    const response = await this.llmService.generateTextCompletion(text, temperature, maxTokens);
    
    // Return the formatted response
    return {
      completion: response,
      originalText: text,
    };
  }
} 