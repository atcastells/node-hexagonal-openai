import { LLMServicePort } from '../../../../application/ports/LLMServicePort';
import { LMStudioAdapter } from './LMStudioAdapter';
import { OpenAIAdapter } from './OpenAIAdapter';
import { MockLLMAdapter } from './MockLLMAdapter';

export type LLMProviderType = 'lmstudio' | 'openai' | 'mock';

export interface LLMProviderConfig {
  type: LLMProviderType;
  apiKey?: string;
  baseUrl: string;
  defaultModel: string;
  defaultMaxTokens: number;
  defaultTemperature: number;
}

export class LLMAdapterFactory {
  static createAdapter(config: LLMProviderConfig): LLMServicePort {
    switch (config.type) {
      case 'lmstudio':
        return new LMStudioAdapter({
          baseUrl: config.baseUrl,
          defaultModel: config.defaultModel,
          defaultMaxTokens: config.defaultMaxTokens,
          defaultTemperature: config.defaultTemperature,
        });
        
      case 'openai':
        if (!config.apiKey) {
          throw new Error('API Key is required for OpenAI adapter');
        }
        
        return new OpenAIAdapter({
          apiKey: config.apiKey,
          baseUrl: config.baseUrl,
          defaultModel: config.defaultModel,
          defaultMaxTokens: config.defaultMaxTokens,
          defaultTemperature: config.defaultTemperature,
        });
        
      case 'mock':
        // Return the mock adapter for testing purposes
        return new MockLLMAdapter();
        
      default:
        throw new Error(`Unsupported LLM provider type: ${config.type}`);
    }
  }
} 