import { Router } from 'express';
import { createChatCompletionRouter } from './chatCompletionRoutes';
import { createTextCompletionRouter } from './textCompletionRoutes';
import { LLMProviderConfig } from '../../../secondary/llm/LLMAdapterFactory';

/**
 * Create and configure all API routes
 * @param llmConfig Configuration for the LLM provider
 * @returns Configured router with all application routes
 */
export const createApiRouter = (llmConfig: LLMProviderConfig): Router => {
  const router = Router();
  
  // Register routes
  router.use('/chat', createChatCompletionRouter(llmConfig));
  router.use('/text', createTextCompletionRouter(llmConfig));
  
  return router;
}; 