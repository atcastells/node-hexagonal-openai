import { User } from '../../../domain/entities/User';
import { UserRepository } from '../../../domain/repositories/UserRepository';
import { Collection, ObjectId } from 'mongodb';
import { MongoManager } from './MongoManager';

export class MongoDBUserRepository implements UserRepository {
  private collection: Collection;
  private mongoManager: MongoManager;

  constructor(
    mongoUri: string = process.env.MONGODB_URI || 'mongodb://localhost:27017',
    dbName: string = process.env.MONGODB_DB_NAME || 'hexagonal-app',
    collectionName: string = 'users'
  ) {
    this.mongoManager = MongoManager.getInstance(mongoUri, dbName);
    // The collection will be initialized when connect() is called
    this.collection = null as unknown as Collection;
  }

  /**
   * Connect to MongoDB and initialize the collection
   */
  async connect(): Promise<void> {
    await this.mongoManager.connect();
    this.collection = this.mongoManager.getDb().collection('users');
  }

  /**
   * Disconnect from MongoDB
   */
  async disconnect(): Promise<void> {
    await this.mongoManager.disconnect();
  }

  private mapToUser(document: any): User | null {
    if (!document) return null;
    
    return new User(
      document._id.toString(),
      document.email,
      document.name,
      new Date(document.createdAt),
      new Date(document.updatedAt)
    );
  }

  private mapToDocument(user: User): any {
    return {
      email: user.email,
      name: user.name,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt
    };
  }

  async findById(id: string): Promise<User | null> {
    try {
      const document = await this.collection.findOne({ _id: new ObjectId(id) });
      return this.mapToUser(document);
    } catch (error) {
      console.error('Error finding user by ID:', error);
      throw error;
    }
  }

  async findByEmail(email: string): Promise<User | null> {
    try {
      const document = await this.collection.findOne({ email });
      return this.mapToUser(document);
    } catch (error) {
      console.error('Error finding user by email:', error);
      throw error;
    }
  }

  async findAll(): Promise<User[]> {
    try {
      const documents = await this.collection.find().toArray();
      const users = documents.map((doc: any) => this.mapToUser(doc));
      // Filter out any null values
      return users.filter((user: User | null): user is User => user !== null);
    } catch (error) {
      console.error('Error finding all users:', error);
      throw error;
    }
  }

  async save(user: User): Promise<User> {
    try {
      const document = this.mapToDocument(user);
      
      // If ID is provided and not an empty string, use it; otherwise, MongoDB will generate one
      const id = user.id && user.id.trim() !== '' 
        ? new ObjectId(user.id)
        : new ObjectId();
      
      await this.collection.insertOne({
        _id: id,
        ...document
      });
      
      const savedUser = await this.findById(id.toString());
      if (!savedUser) {
        throw new Error(`Failed to retrieve saved user with ID: ${id.toString()}`);
      }
      return savedUser;
    } catch (error) {
      console.error('Error saving user:', error);
      throw error;
    }
  }

  async update(user: User): Promise<User> {
    try {
      const document = this.mapToDocument(user);
      
      await this.collection.updateOne(
        { _id: new ObjectId(user.id) },
        { $set: document }
      );
      
      const updatedUser = await this.findById(user.id);
      if (!updatedUser) {
        throw new Error(`User with ID ${user.id} not found after update`);
      }
      return updatedUser;
    } catch (error) {
      console.error('Error updating user:', error);
      throw error;
    }
  }

  async delete(id: string): Promise<void> {
    try {
      await this.collection.deleteOne({ _id: new ObjectId(id) });
    } catch (error) {
      console.error('Error deleting user:', error);
      throw error;
    }
  }
} 