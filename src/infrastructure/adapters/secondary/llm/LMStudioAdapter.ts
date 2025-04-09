import { ChatMessage, LLMRequestOptions, LLMResponse } from '../../../../application/ports/LLMServicePort';
import { AbstractLLMProviderAdapter } from './AbstractLLMProviderAdapter';

interface LMStudioErrorResponse {
  error?: {
    message?: string;
  };
}

interface LMStudioCompletionResponse {
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

export class LMStudioAdapter extends AbstractLLMProviderAdapter {
  constructor(config: {
    baseUrl: string;
    defaultModel: string;
    defaultMaxTokens: number;
    defaultTemperature: number;
  }) {
    super(config);
  }

  async generateChatCompletion(messages: ChatMessage[], options?: LLMRequestOptions): Promise<LLMResponse> {
    const mergedOptions = this.mergeOptions(options);
    
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
        model: mergedOptions.model,
        messages: messagesList,
        max_tokens: mergedOptions.maxTokens,
        temperature: mergedOptions.temperature,
        top_p: mergedOptions.topP,
        frequency_penalty: mergedOptions.frequencyPenalty,
        presence_penalty: mergedOptions.presencePenalty,
        stop: mergedOptions.stop,
      };

      // LM Studio supports chat completions API
      const response = await fetch(`${this.config.baseUrl}/v1/chat/completions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        const errorData = await response.json() as LMStudioErrorResponse;
        throw new Error(`LM Studio API error: ${errorData.error?.message || response.statusText}`);
      }

      const data = await response.json() as LMStudioCompletionResponse;
      
      return {
        text: data.choices[0]?.message?.content || '',
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
} 