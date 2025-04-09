import { ChatMessage, LLMRequestOptions, LLMResponse, LLMServicePort } from '../ports/LLMServicePort';
import { Service, Inject } from 'typedi';
import { SERVICES } from '../../constants'; 
@Service()
export class LLMApplicationService {
  constructor(
    @Inject(SERVICES.LLM)
    private readonly llmService: LLMServicePort
  ) {}

  /**
   * Generate a chat completion from the LLM service
   * @param messages Array of chat messages representing the conversation history
   * @param options Optional parameters for the LLM request
   * @returns The LLM response
   */
  async generateChatCompletion(messages: ChatMessage[], options?: LLMRequestOptions): Promise<LLMResponse> {
    return this.llmService.generateChatCompletion(messages, options);
  }

  /**
   * Simple wrapper for generating a chat response with just user input and optional system prompt
   * @param userMessage The user message content
   * @param systemPrompt Optional system prompt to guide the model behavior
   * @param temperature Optional temperature parameter (0-1)
   * @param maxTokens Optional maximum tokens to generate
   * @returns The generated assistant response
   */
  async generateChatResponse(userMessage: string, systemPrompt?: string, temperature?: number, maxTokens?: number): Promise<string> {
    const messages: ChatMessage[] = [];
    
    if (systemPrompt) {
      messages.push({ role: 'system', content: systemPrompt });
    }
    
    messages.push({ role: 'user', content: userMessage });
    
    const response = await this.llmService.generateChatCompletion(messages, {
      temperature,
      maxTokens,
      systemPrompt
    });
    
    return response.text;
  }

  async generateTextCompletion(text: string, temperature?: number, maxTokens?: number): Promise<string> {
    const response = await this.llmService.generateCompletion(text, {
      temperature,
      maxTokens
    });

    return response.text;
  }
} 