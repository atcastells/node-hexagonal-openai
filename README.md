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

## API Documentation

- [Text Completion API](docs/TextCompletionAPI.md) - API for generating text completions using LLMs 