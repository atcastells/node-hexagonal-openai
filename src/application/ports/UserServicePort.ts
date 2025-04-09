import { User } from '../../domain/entities/User';

export interface UserDTO {
  id: string;
  email: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateUserDTO {
  email: string;
  name: string;
}

export interface UpdateUserDTO {
  email?: string;
  name?: string;
}

export interface UserServicePort {
  getUserById(id: string): Promise<UserDTO | null>;
  getUserByEmail(email: string): Promise<UserDTO | null>;
  getAllUsers(): Promise<UserDTO[]>;
  createUser(user: CreateUserDTO): Promise<UserDTO>;
  updateUser(id: string, user: UpdateUserDTO): Promise<UserDTO | null>;
  deleteUser(id: string): Promise<boolean>;
} 