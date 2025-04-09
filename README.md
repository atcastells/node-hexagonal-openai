# Node.js Hexagonal Architecture with TypeScript

This project demonstrates a clean hexagonal architecture (ports and adapters pattern) implementation using Node.js and TypeScript.

## Features

- Clean Hexagonal Architecture implementation
- Separation of concerns with Domain, Application, and Infrastructure layers
- LLM integrations (OpenAI, LM Studio) via adapter pattern
- Text Completion API

## Project Structure

```
src/
├── application/           # Application layer (use cases)
│   ├── ports/            # Input/Output ports (interfaces)
│   ├── services/         # Application services
│   └── usecases/         # Use cases implementations
├── domain/               # Domain layer (business logic)
│   ├── entities/         # Domain entities
│   └── repositories/     # Repository interfaces
├── infrastructure/       # Infrastructure layer
│   ├── adapters/        # Adapters implementation
│   │   ├── primary/     # Primary/Driving adapters (e.g., REST controllers)
│   │   └── secondary/   # Secondary/Driven adapters (e.g., DB repositories, LLM)
│   └── config/          # Configuration files
└── shared/              # Shared code (DTOs, utils, etc.)
```

## Primary Adapter Structure

```
src/infrastructure/adapters/primary/
├── http/
│   ├── routes/          # Route definitions
│   ├── controllers/     # Controllers
│   └── middlewares/    # Express middlewares
```

## Hexagonal Architecture Overview

The hexagonal architecture, also known as ports and adapters pattern, divides the application into several layers:

1. **Domain Layer**: Contains business logic and entities
   - Pure business logic
   - No dependencies on external frameworks or libraries
   - Defines interfaces for repositories

2. **Application Layer**: Contains use cases and ports
   - Implements business use cases
   - Defines ports (interfaces) for communication with external systems
   - Orchestrates domain objects

3. **Infrastructure Layer**: Contains adapters and implementations
   - Primary Adapters: Handle incoming requests (e.g., REST controllers)
   - Secondary Adapters: Implement outgoing communications (e.g., database repositories)
   - Framework-specific code

## Setup and Installation

1. Install dependencies:
   ```bash
   npm install
   ```

2. Run development server:
   ```bash
   npm run dev
   ```

3. Build for production:
   ```bash
   npm run build
   ```

4. Run tests:
   ```bash
   npm test
   ```

## Technologies Used

- Node.js
- TypeScript
- Express.js (for REST API)
- Jest (for testing)
- TypeORM (for database)

## Development Guidelines

1. **Domain First**: Start development from the domain layer and work outward
2. **Dependency Rule**: Dependencies only point inward
3. **Interface Segregation**: Create specific interfaces for specific needs
4. **Dependency Injection**: Use DI to maintain loose coupling

## Testing Strategy

1. **Unit Tests**: Test domain logic in isolation
2. **Integration Tests**: Test adapters with their external systems
3. **E2E Tests**: Test complete flows through the application

## Project Status

🚧 Under Development

## Docker Setup

You can run this application with Docker using the provided Docker Compose configuration.

### Development Mode

```bash
# Build and run the development container
docker-compose up app-dev

# Or run in detached mode
docker-compose up -d app-dev
```

The development container is configured with hot reloading, which means your code changes will automatically trigger a server restart. This is implemented using:

- Volume mounts that sync your local code with the container
- ts-node-dev with polling enabled for file change detection
- Proper file permissions and nodemon as a backup watcher

When you edit any TypeScript file in the `src` directory, the server will automatically restart with your changes.

### Production Mode

```bash
# Build and run the production container
docker-compose up app-prod

# Or run in detached mode
docker-compose up -d app-prod
```

### Using External LLM Services

The Docker setup is configured to access LLM services (like LM Studio) running on your host machine using `host.docker.internal`. 

For using LM Studio, make sure it's running on your host machine and the base URL in the `.env` file or environment variables is set correctly:

```
LLM_BASE_URL=http://host.docker.internal:1234
```

### Ngrok Integration

The Docker setup includes ngrok integration to expose your local development server to the internet, which is useful for:

- Testing webhooks
- Sharing your development environment with external collaborators
- Testing your application from different networks

To use ngrok:

1. Run the development container with ngrok:
   ```bash
   docker-compose up app-dev ngrok
   ```

2. Access the ngrok admin interface at [http://localhost:4040](http://localhost:4040) to see your public URL and inspect traffic.

3. Your application will be available at the URL provided by ngrok in the logs or admin interface.

The authentication token is pre-configured in the docker-compose.yml file. If you want to use your own token, you can modify it there or set it as an environment variable:

```bash
NGROK_AUTHTOKEN=your_token docker-compose up app-dev ngrok
```

## API Documentation

- [Text Completion API](docs/TextCompletionAPI.md) - API for generating text completions using LLMs 