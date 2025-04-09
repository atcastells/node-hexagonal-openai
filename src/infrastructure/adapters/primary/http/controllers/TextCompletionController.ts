import { Request, Response } from 'express';
import { TextCompletionUseCase } from '../../../../../application/usecases/TextCompletionUseCase';

export class TextCompletionController {
  constructor(private readonly textCompletionUseCase: TextCompletionUseCase) {}

  /**
   * Handle text completion request
   * @param req Express request object
   * @param res Express response object
   */
  async completeText(req: Request, res: Response): Promise<void> {
    try {
      const { text, maxTokens, temperature } = req.body;

      if (!text || typeof text !== 'string') {
        res.status(400).json({ error: 'Text field is required and must be a string' });
        return;
      }

      const result = await this.textCompletionUseCase.completeText({
        text,
        maxTokens: maxTokens ? Number(maxTokens) : undefined,
        temperature: temperature ? Number(temperature) : undefined
      });

      res.status(200).json(result);
    } catch (error) {
      console.error('Error in text completion:', error);
      res.status(500).json({
        error: 'An error occurred while processing the text completion request',
        message: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }
} 