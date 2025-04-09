import { MongoClient, Db } from 'mongodb';

export class MongoManager {
  private static instance: MongoManager;
  private client: MongoClient;
  private db!: Db;
  private isConnected = false;
  
  private constructor(
    private readonly mongoUri: string = process.env.MONGODB_URI || 'mongodb://localhost:27017',
    private readonly dbName: string = process.env.MONGODB_DB_NAME || 'hexagonal-app'
  ) {
    this.client = new MongoClient(mongoUri);
  }
  
  /**
   * Get the MongoManager singleton instance
   */
  public static getInstance(mongoUri?: string, dbName?: string): MongoManager {
    if (!MongoManager.instance) {
      MongoManager.instance = new MongoManager(mongoUri, dbName);
    }
    
    return MongoManager.instance;
  }
  
  /**
   * Connect to MongoDB
   */
  public async connect(): Promise<void> {
    if (this.isConnected) {
      return;
    }
    
    try {
      await this.client.connect();
      this.db = this.client.db(this.dbName);
      this.isConnected = true;
      console.log(`Connected to MongoDB: ${this.mongoUri}, database: ${this.dbName}`);
    } catch (error) {
      console.error('Error connecting to MongoDB:', error);
      throw error;
    }
  }
  
  /**
   * Disconnect from MongoDB
   */
  public async disconnect(): Promise<void> {
    if (!this.isConnected) {
      return;
    }
    
    try {
      await this.client.close();
      this.isConnected = false;
      console.log('Disconnected from MongoDB');
    } catch (error) {
      console.error('Error disconnecting from MongoDB:', error);
      throw error;
    }
  }
  
  /**
   * Get the database instance
   */
  public getDb(): Db {
    if (!this.isConnected) {
      throw new Error('MongoDB is not connected. Call connect() first.');
    }
    
    return this.db;
  }
  
  /**
   * Get the MongoDB client
   */
  public getClient(): MongoClient {
    return this.client;
  }
  
  /**
   * Check if connected to MongoDB
   */
  public isConnectedToMongo(): boolean {
    return this.isConnected;
  }
} 