import 'reflect-metadata'; // Required for TypeDI
import express from 'express';
import dotenv from 'dotenv';
import { createApiRouter } from './infrastructure/adapters/primary/http/routes';
import { LLMProviderConfig } from './infrastructure/adapters/secondary/llm/LLMAdapterFactory';
import { configureContainer } from './infrastructure/config/container';
import { LLM_PROVIDER_TYPES } from './constants';
// Load environment variables
dotenv.config();

// LLM Provider Configuration
const llmConfig: LLMProviderConfig = {
  type: (process.env.LLM_PROVIDER_TYPE as LLM_PROVIDER_TYPES) || LLM_PROVIDER_TYPES.OPENAI,
  apiKey: process.env.OPENAI_API_KEY,
  baseUrl: process.env.LLM_BASE_URL || 'https://api.openai.com/v1',
  defaultModel: process.env.LLM_DEFAULT_MODEL || 'gpt-3.5-turbo',
  defaultMaxTokens: parseInt(process.env.LLM_DEFAULT_MAX_TOKENS || '1000'),
  defaultTemperature: parseFloat(process.env.LLM_DEFAULT_TEMPERATURE || '0.7')
};

// Configure dependency injection container
configureContainer(llmConfig);

// Create Express app
const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(express.json());

// API Routes
app.use('/api', createApiRouter(llmConfig));

// Simple health check route
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', message: 'Server is running' });
});

// Start server and store reference
const server = app.listen(port, () => {
  console.log(`Server running on port ${port}`);
  console.log(`Using LLM provider: ${llmConfig.type}`);
});

// Attach server to app for testing purposes
// @ts-ignore - Adding a custom property to app
app.server = server;

export { app, server }; 