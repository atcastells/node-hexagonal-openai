import { Router } from 'express';
import { TextCompletionController } from '../controllers/TextCompletionController';
import { LLMApplicationService } from '../../../../../application/services/LLMApplicationService';
import { TextCompletionUseCase } from '../../../../../application/usecases/TextCompletionUseCase';
import { LLMAdapterFactory, LLMProviderConfig } from '../../../secondary/llm/LLMAdapterFactory';

export const createTextCompletionRouter = (config: LLMProviderConfig): Router => {
  const router = Router();
  
  // Create dependencies
  const llmAdapter = LLMAdapterFactory.createAdapter(config);
  const llmService = new LLMApplicationService(llmAdapter);
  const textCompletionUseCase = new TextCompletionUseCase(llmService);
  const textCompletionController = new TextCompletionController(textCompletionUseCase);
  
  // Define routes
  router.post('/complete', (req, res) => textCompletionController.completeText(req, res));
  
  return router;
}; 