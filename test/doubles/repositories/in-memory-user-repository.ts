import { UserData } from '@/dtos/user-data';
import { UserRepository } from '@/usecases/ports/repositories/user-repository';

export class InMemoryUserRepository implements UserRepository {
  private repository: UserData[] = [];

  async findByEmail(email: string): Promise<UserData> {
    const users = this.repository.find((user) => user.email === email);

    return users || null;
  }

  async create(user: UserData): Promise<void> {
    this.repository.push(user);
  }
}
