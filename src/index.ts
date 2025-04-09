import 'reflect-metadata'; // Required for TypeDI
import express from 'express';
import dotenv from 'dotenv';
import { createApiRouter } from './infrastructure/adapters/primary/http/routes';
import { LLMProviderConfig } from './infrastructure/adapters/secondary/llm/LLMAdapterFactory';
import { configureContainer } from './infrastructure/config/container';
import { LLM_PROVIDER_TYPES, REPOSITORY_TYPES } from './constants';
import { RepositoryConfig, UserRepositoryFactory } from './infrastructure/adapters/secondary/UserRepositoryFactory';

// Load environment variables
dotenv.config();

// Configuration loading functions
function loadLLMConfig(): LLMProviderConfig {
  return {
    type: (process.env.LLM_PROVIDER_TYPE as LLM_PROVIDER_TYPES) || LLM_PROVIDER_TYPES.OPENAI,
    apiKey: process.env.OPENAI_API_KEY,
    baseUrl: process.env.LLM_BASE_URL || 'https://api.openai.com/v1',
    defaultModel: process.env.LLM_DEFAULT_MODEL || 'gpt-3.5-turbo',
    defaultMaxTokens: parseInt(process.env.LLM_DEFAULT_MAX_TOKENS || '1000'),
    defaultTemperature: parseFloat(process.env.LLM_DEFAULT_TEMPERATURE || '0.7')
  };
}

function loadRepositoryConfig(): RepositoryConfig {
  return {
    type: process.env.REPOSITORY_TYPE || REPOSITORY_TYPES.IN_MEMORY,
    uri: process.env.MONGODB_URI,
    dbName: process.env.MONGODB_DB_NAME
  };
}

// Create Express app
function createApp(llmConfig: LLMProviderConfig): express.Application {
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
  
  return app;
}

// Define server app interfaces
interface ServerInstance {
  app: express.Application;
  server: ReturnType<express.Application['listen']>;
}

// Initialize repositories and start the server
async function startServer(
  app: express.Application, 
  repositoryConfig: RepositoryConfig,
  llmConfig: LLMProviderConfig
): Promise<ServerInstance> {
  try {
    const port = process.env.PORT || 3000;
    
    // Initialize repositories
    await UserRepositoryFactory.initializeRepositories(repositoryConfig);
    
    // Start server and store reference
    const server = app.listen(port, () => {
      console.log(`Server running on port ${port}`);
      console.log(`Using LLM provider: ${llmConfig.type}`);
      console.log(`Using repository: ${repositoryConfig.type}`);
    });
    
    // Setup shutdown handler
    setupGracefulShutdown(server);
    
    // Attach server to app for testing purposes
    // @ts-ignore - Adding a custom property to app
    app.server = server;
    
    return { app, server };
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
    // We'll never reach this, but TypeScript needs a return value
    throw error;
  }
}

// Setup graceful shutdown handling
function setupGracefulShutdown(server: ReturnType<express.Application['listen']>): void {
  const shutdown = async () => {
    console.log('Shutting down gracefully...');
    
    // Close server first to stop accepting new connections
    await new Promise(resolve => {
      server.close(resolve);
    });
    console.log('Server closed');
    
    // Clean up repositories
    await UserRepositoryFactory.cleanupRepositories();
    
    console.log('Shutdown complete');
    process.exit(0);
  };
  
  // Listen for termination signals
  process.on('SIGTERM', shutdown);
  process.on('SIGINT', shutdown);
}

// Application initialization and startup
const llmConfig = loadLLMConfig();
const repositoryConfig = loadRepositoryConfig();

// Configure dependency injection container
configureContainer(llmConfig, repositoryConfig);

// Create and configure the Express app
const app = createApp(llmConfig);

// Start the server
const serverPromise = startServer(app, repositoryConfig, llmConfig);

// Export for testing
export { app, serverPromise }; 