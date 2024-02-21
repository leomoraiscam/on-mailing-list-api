import { mongoHelper } from '@/external/repositories/mongodb/helpers/mongo-helper';
import { MongodbUserRepository } from '@/external/repositories/mongodb/mongodb-user-repository';

let userRepository: MongodbUserRepository;

describe('MongoDb user repository', () => {
  beforeAll(async () => {
    await mongoHelper.connect(process.env.MONGO_URL);
  });

  afterAll(async () => {
    await mongoHelper.disconnect();
  });

  beforeEach(async () => {
    userRepository = new MongodbUserRepository();
    await mongoHelper.clearCollection('users');
  });

  it('should add an user when the same is added, it should exist', async () => {
    await userRepository.add({
      name: 'Dennis Webster',
      email: 'ip@fabug.cd',
    });

    const user = await userRepository.findUserByEmail('ip@fabug.cd');

    expect(user.name).toEqual('Dennis Webster');
  });

  it('should be able return true when user is added, it should exist', async () => {
    const user = {
      name: 'Hilda Vaughn',
      email: 'fojevle@porembaw.gn',
    };

    await userRepository.add(user);

    expect(await userRepository.exists(user)).toBeTruthy();
  });

  it('should be able return false when user is not added, it should not exist', async () => {
    expect(
      await userRepository.exists({
        name: 'Willie Yates',
        email: 'wiujuteh@gasa.by',
      })
    ).toBeFalsy();
  });

  it('should return all users added', async () => {
    await Promise.all([
      userRepository.add({
        name: 'Marguerite Bass',
        email: 'gerugu@eb.tw',
      }),
      userRepository.add({
        name: 'Chase Haynes',
        email: 'zididu@wojmip.ro',
      }),
    ]);

    const users = await userRepository.findAllUsers();

    expect(users[0].name).toEqual('Marguerite Bass');
    expect(users[1].name).toEqual('Chase Haynes');
  });
});
