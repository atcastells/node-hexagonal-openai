import { UserRepository } from '../../../domain/repositories/UserRepository';
import { REPOSITORY_TYPES } from '../../../constants';
import { InMemoryUserRepository } from './InMemoryUserRepository';
import { MongoDBUserRepository } from './MongoDBUserRepository';
import { MongoManager } from './MongoManager';

export interface RepositoryConfig {
  type: string;
  uri?: string;
  dbName?: string;
}

export class UserRepositoryFactory {
  private static mongoRepository: MongoDBUserRepository | null = null;
  
  /**
   * Create a UserRepository instance based on the provided configuration
   * @param config The repository configuration
   * @returns A configured UserRepository implementation
   */
  static createRepository(config: RepositoryConfig): UserRepository {
    switch (config.type) {
      case REPOSITORY_TYPES.MONGODB:
        // Use singleton pattern for MongoDB repository
        if (!this.mongoRepository) {
          this.mongoRepository = new MongoDBUserRepository(
            config.uri,
            config.dbName
          );
        }
        return this.mongoRepository;
      
      case REPOSITORY_TYPES.IN_MEMORY:
      default:
        return new InMemoryUserRepository();
    }
  }
  
  /**
   * Initialize all repositories that require setup
   * Should be called at application startup
   */
  static async initializeRepositories(config: RepositoryConfig): Promise<void> {
    if (config.type === REPOSITORY_TYPES.MONGODB) {
      // Create the repository if it doesn't exist yet
      if (!this.mongoRepository) {
        this.mongoRepository = new MongoDBUserRepository(
          config.uri,
          config.dbName
        );
      }
      
      // Connect to MongoDB
      await this.mongoRepository.connect();
      console.log('MongoDB repository initialized');
    }
  }
  
  /**
   * Cleanup all repositories, closing connections etc.
   * Should be called when the application is shutting down
   */
  static async cleanupRepositories(): Promise<void> {
    if (this.mongoRepository) {
      await this.mongoRepository.disconnect();
      console.log('MongoDB repository connection closed');
    }
  }
}