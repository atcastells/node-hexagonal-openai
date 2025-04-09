import { User } from '../../domain/entities/User';
import { UserRepository } from '../../domain/repositories/UserRepository';
import { 
  CreateUserDTO, 
  UpdateUserDTO, 
  UserDTO, 
  UserServicePort 
} from '../ports/UserServicePort';

export class UserService implements UserServicePort {
  constructor(private readonly userRepository: UserRepository) {}

  async getUserById(id: string): Promise<UserDTO | null> {
    const user = await this.userRepository.findById(id);
    return user ? user.toObject() : null;
  }

  async getUserByEmail(email: string): Promise<UserDTO | null> {
    const user = await this.userRepository.findByEmail(email);
    return user ? user.toObject() : null;
  }

  async getAllUsers(): Promise<UserDTO[]> {
    const users = await this.userRepository.findAll();
    return users.map(user => user.toObject());
  }

  async createUser(userDto: CreateUserDTO): Promise<UserDTO> {
    const id = this.generateId();
    const user = new User(id, userDto.email, userDto.name);
    const savedUser = await this.userRepository.save(user);
    return savedUser.toObject();
  }

  async updateUser(id: string, userDto: UpdateUserDTO): Promise<UserDTO | null> {
    const existingUser = await this.userRepository.findById(id);
    
    if (!existingUser) {
      return null;
    }

    if (userDto.name) {
      existingUser.updateName(userDto.name);
    }

    if (userDto.email) {
      existingUser.updateEmail(userDto.email);
    }

    const updatedUser = await this.userRepository.update(existingUser);
    return updatedUser.toObject();
  }

  async deleteUser(id: string): Promise<boolean> {
    const existingUser = await this.userRepository.findById(id);
    
    if (!existingUser) {
      return false;
    }

    await this.userRepository.delete(id);
    return true;
  }

  private generateId(): string {
    return Math.random().toString(36).substring(2, 15) + 
           Math.random().toString(36).substring(2, 15);
  }
} 