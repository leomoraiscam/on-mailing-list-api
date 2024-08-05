import { UserData } from '@/dtos/user-data';
import { UserRepository } from '@/usecases/ports/repositories/user-repository';

import { mongoHelper } from '../helpers/mongo-helper';

export class MongodbUserRepository implements UserRepository {
  async findByEmail(email: string): Promise<UserData> {
    const userCollection = mongoHelper.getCollection('users');

    return userCollection.findOne<UserData>({ email });
  }

  async create(user: UserData): Promise<void> {
    const userCollection = mongoHelper.getCollection('users');

    await userCollection.insertOne({
      name: user.name,
      email: user.email,
    });
  }
}
