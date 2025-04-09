export interface ChatMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export interface LLMRequestOptions {
  model?: string;
  temperature?: number;
  maxTokens?: number;
  topP?: number;
  frequencyPenalty?: number;
  presencePenalty?: number;
  stop?: string[];
  systemPrompt?: string;
}

export interface LLMResponse {
  text: string;
  usage?: {
    promptTokens?: number;
    completionTokens?: number;
    totalTokens?: number;
  };
}

export interface LLMServicePort {
  /**
   * Generates a chat completion for the given messages using the configured LLM provider
   * @param messages Array of chat messages representing the conversation history
   * @param options Optional parameters for the chat completion request
   * @returns A promise that resolves to the completion response
   */
  generateChatCompletion(messages: ChatMessage[], options?: LLMRequestOptions): Promise<LLMResponse>;
  generateCompletion(prompt: string, options?: LLMRequestOptions): Promise<LLMResponse>;
} 