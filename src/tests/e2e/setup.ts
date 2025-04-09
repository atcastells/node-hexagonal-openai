import request from 'supertest';
import { app } from '../../../src/index';

/**
 * Helper function to check if the server is running correctly
 * @returns Promise resolving to true if server responds to health check
 */
export const checkServerHealth = async (): Promise<boolean> => {
  try {
    const response = await request(app).get('/health');
    return response.status === 200 && response.body.status === 'ok';
  } catch (error) {
    console.error('Server health check failed:', error);
    return false;
  }
};

/**
 * Standard request options for text completion tests
 */
export const defaultCompletionRequest = {
  text: 'Hello, can you complete this sentence with',
  maxTokens: 30,
  temperature: 0.7
};

/**
 * Helper to make a text completion request
 * @param data Request data object
 * @returns Promise resolving to the response
 */
export const makeCompletionRequest = (data: any) => {
  return request(app)
    .post('/api/text-completion/complete')
    .send(data)
    .set('Accept', 'application/json');
}; 