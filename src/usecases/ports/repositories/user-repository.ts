import { UserData } from '@/dtos/user-data';

export interface UserRepository {
  findByEmail(email: string): Promise<UserData | null>;
  create(user: UserData): Promise<void>;
}
