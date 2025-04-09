import { Router } from 'express';
import { LLMProviderConfig } from '../../../secondary/llm/LLMAdapterFactory';
import { getChatCompletionController } from '../../../../config/container';

export const createChatCompletionRouter = (config: LLMProviderConfig): Router => {
  const router = Router();
  
  // Get controller from container
  const chatCompletionController = getChatCompletionController();
  
  // Define routes
  router.post('/generate', (req, res) => chatCompletionController.generateChatCompletion(req, res));
  
  return router;
}; 