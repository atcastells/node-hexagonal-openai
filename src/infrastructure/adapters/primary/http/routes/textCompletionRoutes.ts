import { Router } from 'express';
import { LLMProviderConfig } from '../../../secondary/llm/LLMAdapterFactory';
import { getTextCompletionController } from '../../../../config/container';

export const createTextCompletionRouter = (config: LLMProviderConfig): Router => {
  const router = Router();
  
  // Get controller from container
  const textCompletionController = getTextCompletionController();
  
  // Define routes
  router.post('/complete', (req, res) => textCompletionController.completeText(req, res));
  
  return router;
}; 