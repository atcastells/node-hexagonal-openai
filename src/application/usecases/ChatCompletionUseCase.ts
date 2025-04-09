import { ChatMessage } from '../ports/LLMServicePort';
import { LLMApplicationService } from '../services/LLMApplicationService';

export interface ChatCompletionRequest {
  messages: ChatMessage[];
  maxTokens?: number;
  temperature?: number;
  systemPrompt?: string;
}

export interface ChatCompletionResponse {
  message: ChatMessage;
  usage?: {
    promptTokens?: number;
    completionTokens?: number;
    totalTokens?: number;
  };
}

/**
 * Use case for chat completion functionality
 */
export class ChatCompletionUseCase {
  constructor(private readonly llmService: LLMApplicationService) {}

  /**
   * Process a chat completion request using the LLM service
   * @param request The chat completion request containing the conversation history
   * @returns The chat completion response with the assistant's message
   */
  async generateChatCompletion(request: ChatCompletionRequest): Promise<ChatCompletionResponse> {
    const { messages, maxTokens, temperature, systemPrompt } = request;
    
    // Call the LLM service to generate the completion
    const response = await this.llmService.generateChatCompletion(messages, {
      maxTokens,
      temperature,
      systemPrompt
    });
    
    // Return the formatted response
    return {
      message: {
        role: 'assistant',
        content: response.text
      },
      usage: response.usage
    };
  }
} 