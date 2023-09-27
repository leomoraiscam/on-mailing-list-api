import { UserData } from '@/dtos/user-data';
import { InMemoryUserRepository } from '@/usecases/register-user-on-mailing-list/repositories/in-memory-user-repository';

let users: UserData[] = [];
let inMemoryUserRepository: InMemoryUserRepository;

describe('InMemoryUserRepository', () => {
  beforeEach(() => {
    inMemoryUserRepository = new InMemoryUserRepository(users);
  });

  it('Should return null if user is not found', async () => {
    const user = await inMemoryUserRepository.findUserByEmail(
      'john_doe@email.com'
    );

    expect(user).toBeNull();
  });

  it('should return user if it is found in the repository', async () => {
    await inMemoryUserRepository.add({
      name: 'John Doe',
      email: 'john_doe@email.com',
    });

    const user = await inMemoryUserRepository.findUserByEmail(
      'john_doe@email.com'
    );

    expect(user.name).toBe('John Doe');
  });

  it('should return all users in the repository', async () => {
    users = [
      {
        name: 'John Doe',
        email: 'john_doe@email.com',
      },
      {
        name: 'John Smith',
        email: 'john_smith@email.com',
      },
    ];

    inMemoryUserRepository = new InMemoryUserRepository(users);
    const usersResponse = await inMemoryUserRepository.findAllUsers();

    expect(usersResponse.length).toBe(users.length);
  });
});
