import { UserData } from '@/dtos/user-data';

import { UserRepository } from './ports/user-repository';

export class InMemoryUserRepository implements UserRepository {
  private repository: UserData[] = [];

  async findAllUsers(): Promise<UserData[]> {
    return this.repository;
  }

  async findUserByEmail(email: string): Promise<UserData> {
    const users = this.repository.find((user) => user.email === email);

    return users || null;
  }

  async exists(user: UserData): Promise<boolean> {
    if ((await this.findUserByEmail(user.email)) === null) {
      return false;
    }

    return true;
  }

  async add(user: UserData): Promise<void> {
    const exists = await this.exists(user);

    if (!exists) {
      this.repository.push(user);
    }
  }
}
