import { Injectable } from '@angular/core';
import { DatabaseService } from './database.service';
import { User } from '../models/user.model';


@Injectable({ providedIn: 'root' })
export class UserService {
  private currentUser: User | null = null;

  constructor(private db: DatabaseService) {}

  async login(username: string, password: string): Promise<boolean> {
    const user = await this.db.getUserByCredentials(username, password);
    if (user) {
      this.currentUser = user;
      return true;
    }
    return false;
  }

  logout() {
    this.currentUser = null;
  }

  getCurrentUser(): User | null {
    return this.currentUser;
  }
}
