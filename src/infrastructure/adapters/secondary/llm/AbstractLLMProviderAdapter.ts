import { LLMRequestOptions, LLMResponse, LLMServicePort } from '../../../../application/ports/LLMServicePort';

export abstract class AbstractLLMProviderAdapter implements LLMServicePort {
  constructor(protected readonly config: {
    apiKey?: string;
    baseUrl: string;
    defaultModel: string;
    defaultMaxTokens: number;
    defaultTemperature: number;
  }) {}

  abstract generateCompletion(prompt: string, options?: LLMRequestOptions): Promise<LLMResponse>;

  protected mergeOptions(options?: LLMRequestOptions): LLMRequestOptions {
    return {
      model: options?.model || this.config.defaultModel,
      maxTokens: options?.maxTokens || this.config.defaultMaxTokens,
      temperature: options?.temperature || this.config.defaultTemperature,
      topP: options?.topP || 1,
      frequencyPenalty: options?.frequencyPenalty || 0,
      presencePenalty: options?.presencePenalty || 0,
      stop: options?.stop || [],
    };
  }
} 