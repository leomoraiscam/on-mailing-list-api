import { mongoHelper } from '@/external/repositories/mongodb/helpers/mongo-helper';
import { MongodbUserRepository } from '@/external/repositories/mongodb/mongodb-user-repository';

describe('MongoDb user repository', () => {
  beforeAll(async () => {
    await mongoHelper.connect(process.env.MONGO_URL);
  });

  afterAll(async () => {
    await mongoHelper.disconnect();
  });

  beforeEach(async () => {
    await mongoHelper.clearCollection('users');
  });

  it('should add an user when the same is added, it should exist', async () => {
    const userRepository = new MongodbUserRepository();

    const user = {
      name: 'John Doe',
      email: 'john_doe@email.com',
    };

    await userRepository.add(user);

    expect(await userRepository.exists(user)).toBeTruthy();
  });

  it('should return all users added', async () => {
    const userRepository = new MongodbUserRepository();

    await Promise.all([
      userRepository.add({
        name: 'John Doe',
        email: 'john_doe@email.com',
      }),
      userRepository.add({
        name: 'John Smith',
        email: 'john_smith@email.com',
      }),
    ]);

    const users = await userRepository.findAllUsers();

    expect(users[0].name).toEqual('John Doe');
    expect(users[1].name).toEqual('John Smith');
  });
});
