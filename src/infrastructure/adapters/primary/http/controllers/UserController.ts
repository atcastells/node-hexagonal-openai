import { Request, Response } from 'express';
import { UserServicePort } from '../../../../../application/ports/UserServicePort';

export class UserController {
  constructor(private readonly userService: UserServicePort) {}

  async getUsers(req: Request, res: Response): Promise<void> {
    try {
      const users = await this.userService.getAllUsers();
      res.status(200).json(users);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching users', error });
    }
  }

  async getUserById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const user = await this.userService.getUserById(id);
      
      if (!user) {
        res.status(404).json({ message: `User with id ${id} not found` });
        return;
      }
      
      res.status(200).json(user);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching user', error });
    }
  }

  async createUser(req: Request, res: Response): Promise<void> {
    try {
      const { email, name } = req.body;
      
      if (!email || !name) {
        res.status(400).json({ message: 'Email and name are required' });
        return;
      }
      
      const user = await this.userService.createUser({ email, name });
      res.status(201).json(user);
    } catch (error) {
      res.status(500).json({ message: 'Error creating user', error });
    }
  }

  async updateUser(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const { email, name } = req.body;
      
      if (!email && !name) {
        res.status(400).json({ message: 'At least one field (email or name) is required' });
        return;
      }
      
      const updatedUser = await this.userService.updateUser(id, { email, name });
      
      if (!updatedUser) {
        res.status(404).json({ message: `User with id ${id} not found` });
        return;
      }
      
      res.status(200).json(updatedUser);
    } catch (error) {
      res.status(500).json({ message: 'Error updating user', error });
    }
  }

  async deleteUser(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const result = await this.userService.deleteUser(id);
      
      if (!result) {
        res.status(404).json({ message: `User with id ${id} not found` });
        return;
      }
      
      res.status(204).end();
    } catch (error) {
      res.status(500).json({ message: 'Error deleting user', error });
    }
  }
} 