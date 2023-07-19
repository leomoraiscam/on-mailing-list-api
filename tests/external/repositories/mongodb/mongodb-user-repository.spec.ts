import { mongoHelper } from '@/external/repositories/mongodb/helpers/mongo-helper';
import { MongodbUserRepository } from '@/external/repositories/mongodb/mongodb-user-repository';

describe('MongoDb User repository', () => {
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
      name: 'Any',
      email: 'any@email.com',
    };

    await userRepository.add(user);

    expect(await userRepository.exists(user)).toBeTruthy();
  });

  it('should return all users added', async () => {
    const userRepository = new MongodbUserRepository();

    await userRepository.add({
      name: 'Any',
      email: 'any@email.com',
    });

    await userRepository.add({
      name: 'Any two',
      email: 'any_two@email.com',
    });

    const users = await userRepository.findAllUsers();

    expect(users[0].name).toEqual('Any');
    expect(users[1].name).toEqual('Any two');
  });
});
