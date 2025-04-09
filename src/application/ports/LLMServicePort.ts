export interface LLMRequestOptions {
  model?: string;
  temperature?: number;
  maxTokens?: number;
  topP?: number;
  frequencyPenalty?: number;
  presencePenalty?: number;
  stop?: string[];
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
   * Generates a completion for the given prompt using the configured LLM provider
   * @param prompt The prompt to generate a completion for
   * @param options Optional parameters for the completion request
   * @returns A promise that resolves to the completion response
   */
  generateCompletion(prompt: string, options?: LLMRequestOptions): Promise<LLMResponse>;
} 