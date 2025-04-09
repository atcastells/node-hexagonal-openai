import { Router } from 'express';
import { ChatCompletionController } from '../controllers/ChatCompletionController';
import { LLMApplicationService } from '../../../../../application/services/LLMApplicationService';
import { ChatCompletionUseCase } from '../../../../../application/usecases/ChatCompletionUseCase';
import { LLMAdapterFactory, LLMProviderConfig } from '../../../secondary/llm/LLMAdapterFactory';

export const createChatCompletionRouter = (config: LLMProviderConfig): Router => {
  const router = Router();
  
  // Create dependencies
  const llmAdapter = LLMAdapterFactory.createAdapter(config);
  const llmService = new LLMApplicationService(llmAdapter);
  const chatCompletionUseCase = new ChatCompletionUseCase(llmService);
  const chatCompletionController = new ChatCompletionController(chatCompletionUseCase);
  
  // Define routes
  router.post('/generate', (req, res) => chatCompletionController.generateChatCompletion(req, res));
  
  return router;
}; 