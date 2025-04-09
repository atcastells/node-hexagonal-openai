import { Container } from 'typedi';
import { LLMServicePort } from '../../application/ports/LLMServicePort';
import { LLMAdapterFactory, LLMProviderConfig } from '../adapters/secondary/llm/LLMAdapterFactory';
import { LLMApplicationService } from '../../application/services/LLMApplicationService';
import { ChatCompletionUseCase } from '../../application/usecases/ChatCompletionUseCase';
import { TextCompletionUseCase } from '../../application/usecases/TextCompletionUseCase';
import { ChatCompletionController } from '../adapters/primary/http/controllers/ChatCompletionController';
import { TextCompletionController } from '../adapters/primary/http/controllers/TextCompletionController';
import { SERVICES } from '../../constants';
/**
 * Configure the DI container with all required services
 * @param config The LLM provider configuration
 */
export function configureContainer(config: LLMProviderConfig): void {
  // Register the LLM adapter as a service
  const llmAdapter = LLMAdapterFactory.createAdapter(config);
  Container.set(SERVICES.LLM, llmAdapter);
  
  // The rest of the services are automatically registered via @Service decorators
  // We can get instances of them directly from the container
}

/**
 * Get the ChatCompletionUseCase from the container
 * @returns A configured instance of ChatCompletionUseCase
 */
export function getChatCompletionUseCase(): ChatCompletionUseCase {
  return Container.get(ChatCompletionUseCase);
}

/**
 * Get the TextCompletionUseCase from the container
 * @returns A configured instance of TextCompletionUseCase
 */
export function getTextCompletionUseCase(): TextCompletionUseCase {
  return Container.get(TextCompletionUseCase);
}

/**
 * Get the ChatCompletionController from the container
 * @returns A configured instance of ChatCompletionController
 */
export function getChatCompletionController(): ChatCompletionController {
  return Container.get(ChatCompletionController);
}

/**
 * Get the TextCompletionController from the container
 * @returns A configured instance of TextCompletionController
 */
export function getTextCompletionController(): TextCompletionController {
  return Container.get(TextCompletionController);
} 