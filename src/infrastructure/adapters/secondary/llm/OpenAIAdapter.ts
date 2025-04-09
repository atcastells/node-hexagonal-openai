import { ChatMessage, LLMRequestOptions, LLMResponse } from '../../../../application/ports/LLMServicePort';
import { AbstractLLMProviderAdapter } from './AbstractLLMProviderAdapter';

interface OpenAIErrorResponse {
  error?: {
    message?: string;
  };
}

interface OpenAICompletionResponse {
  choices: {
    text?: string;
    message?: {
      content: string;
    };
    index?: number;
    finish_reason?: string;
  }[];
  usage?: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
}

export class OpenAIAdapter extends AbstractLLMProviderAdapter {
  constructor(config: {
    apiKey: string;
    baseUrl: string;
    defaultModel: string;
    defaultMaxTokens: number;
    defaultTemperature: number;
  }) {
    super(config);
  }

  async generateChatCompletion(messages: ChatMessage[], options?: LLMRequestOptions): Promise<LLMResponse> {
    const mergedOptions = this.mergeOptions(options);
    const modelName = mergedOptions.model || this.config.defaultModel;
    
    try {
      // Prepare messages array with system prompt if provided
      let messagesList = [...messages];
      
      // If systemPrompt is provided in options and there's no system message yet, add it
      if (mergedOptions.systemPrompt && !messages.some(m => m.role === 'system')) {
        messagesList = [
          { role: 'system', content: mergedOptions.systemPrompt },
          ...messagesList
        ];
      }
      
      const requestBody = {
        model: modelName,
        messages: messagesList,
        max_tokens: mergedOptions.maxTokens,
        temperature: mergedOptions.temperature,
        top_p: mergedOptions.topP,
        frequency_penalty: mergedOptions.frequencyPenalty,
        presence_penalty: mergedOptions.presencePenalty,
        stop: mergedOptions.stop,
      };

      const response = await fetch(`${this.config.baseUrl}/v1/chat/completions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.config.apiKey}`
        },
        body: JSON.stringify(requestBody)
      });

      if (!response.ok) {
        const errorData = await response.json() as OpenAIErrorResponse;
        throw new Error(`OpenAI API error: ${errorData.error?.message || response.statusText}`);
      }

      const data = await response.json() as OpenAICompletionResponse;
      const textContent = data.choices[0]?.message?.content || '';
      
      return {
        text: textContent,
        usage: {
          promptTokens: data.usage?.prompt_tokens,
          completionTokens: data.usage?.completion_tokens,
          totalTokens: data.usage?.total_tokens,
        },
      };
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Failed to generate chat completion: ${error.message}`);
      }
      throw new Error('Failed to generate chat completion');
    }
  }
  
  async generateCompletion(prompt: string, options?: LLMRequestOptions): Promise<LLMResponse> {
    const mergedOptions = this.mergeOptions(options);
    const modelName = mergedOptions.model || this.config.defaultModel;
    
    try {
      const requestBody = {
        model: modelName,
        prompt: prompt,
        max_tokens: mergedOptions.maxTokens,
        temperature: mergedOptions.temperature,
        top_p: mergedOptions.topP,
        frequency_penalty: mergedOptions.frequencyPenalty,
        presence_penalty: mergedOptions.presencePenalty,
        stop: mergedOptions.stop,
      };

      const response = await fetch(`${this.config.baseUrl}/v1/completions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.config.apiKey}`
        },
        body: JSON.stringify(requestBody)
      });

      if (!response.ok) {
        const errorData = await response.json() as OpenAIErrorResponse;
        throw new Error(`OpenAI API error: ${errorData.error?.message || response.statusText}`);
      }

      const data = await response.json() as OpenAICompletionResponse;
      const textContent = data.choices[0]?.text || '';
      
      return {
        text: textContent,
        usage: {
          promptTokens: data.usage?.prompt_tokens,
          completionTokens: data.usage?.completion_tokens,
          totalTokens: data.usage?.total_tokens,
        },
      };
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Failed to generate completion: ${error.message}`);
      }
      throw new Error('Failed to generate completion');
    }
  }
} 