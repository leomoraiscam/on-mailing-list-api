import { UserData } from '@/dtos/user-data';
import { UserRepository } from '@/usecases/register-user-on-mailing-list/ports/user-repository';
import { mongoHelper } from './helpers/mongo-helper';

export class MongodbUserRepository implements UserRepository {
  async findAllUsers(): Promise<UserData[]> {
    const userCollection = mongoHelper.getCollection('users');
    
    return userCollection.find<UserData>({}).toArray();
  }

  async findUserByEmail(email: string): Promise<UserData> {
    const userCollection = mongoHelper.getCollection('users');
    
    return userCollection.findOne<UserData>({ email });
  }

  async exists(user: UserData): Promise<boolean> {
    const result = await this.findUserByEmail(user.email);

    if (result !== null) {
      return true;
    }
    
    return false;
  }
 
  async add(user: UserData): Promise<void> {
    const userCollection = mongoHelper.getCollection('users');

    const exists = await this.exists(user);
    
    if (!exists) {
      await userCollection.insertOne({
        name: user.name,
        email: user.email,
      });
    }
  }
}
