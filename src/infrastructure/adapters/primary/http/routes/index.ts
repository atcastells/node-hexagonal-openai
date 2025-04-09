import { Router } from 'express';
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
  router.use('/text-completion', createTextCompletionRouter(llmConfig));
  
  return router;
}; 