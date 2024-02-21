import { UserData } from '@/dtos/user-data';
import { InMemoryUserRepository } from '@/usecases/register-user-on-mailing-list/repositories/in-memory-user-repository';

let users: UserData[] = [];
let inMemoryUserRepository: InMemoryUserRepository;

describe('In memory user repository', () => {
  beforeEach(() => {
    inMemoryUserRepository = new InMemoryUserRepository(users);
  });

  it('Should return null if user is not found', async () => {
    const user = await inMemoryUserRepository.findUserByEmail(
      'og@linjijrez.hk'
    );

    expect(user).toBeNull();
  });

  it('should return user if it is found in the repository', async () => {
    await inMemoryUserRepository.add({
      name: 'Lola Snyder',
      email: 'fuwowe@zolugenu.cf',
    });

    const user = await inMemoryUserRepository.findUserByEmail(
      'fuwowe@zolugenu.cf'
    );

    expect(user.name).toBe('Lola Snyder');
  });

  it('should return all users in the repository', async () => {
    users = [
      {
        name: 'Augusta May',
        email: 'wij@okki.bz',
      },
      {
        name: 'Jimmy Roberson',
        email: 'emvasol@ji.yt',
      },
    ];

    inMemoryUserRepository = new InMemoryUserRepository(users);
    const usersResponse = await inMemoryUserRepository.findAllUsers();

    expect(usersResponse.length).toBe(users.length);
  });
});
