import { Request, Response } from 'express';
import { ChatCompletionUseCase } from '../../../../../application/usecases/ChatCompletionUseCase';
import { ChatMessage } from '../../../../../application/ports/LLMServicePort';
import { Service, Inject } from 'typedi';

@Service()
export class ChatCompletionController {
  constructor(
    @Inject()
    private readonly chatCompletionUseCase: ChatCompletionUseCase
  ) {}

  /**
   * Handle chat completion request
   * @param req Express request object
   * @param res Express response object
   */
  async generateChatCompletion(req: Request, res: Response): Promise<void> {
    try {
      const { messages, maxTokens, temperature, systemPrompt } = req.body;

      // Validate input
      if (!messages || !Array.isArray(messages) || messages.length === 0) {
        res.status(400).json({ error: 'Messages field is required and must be a non-empty array' });
        return;
      }

      // Validate that all messages have the correct format
      for (const message of messages) {
        if (!message.role || !['system', 'user', 'assistant'].includes(message.role) || 
            !message.content || typeof message.content !== 'string') {
          res.status(400).json({ 
            error: 'Each message must have a valid role (system, user, or assistant) and content (string)' 
          });
          return;
        }
      }

      const result = await this.chatCompletionUseCase.generateChatCompletion({
        messages: messages as ChatMessage[],
        maxTokens: maxTokens ? Number(maxTokens) : undefined,
        temperature: temperature ? Number(temperature) : undefined,
        systemPrompt
      });

      res.status(200).json(result);
    } catch (error) {
      console.error('Error in chat completion:', error);
      res.status(500).json({
        error: 'An error occurred while processing the chat completion request',
        message: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }
} 