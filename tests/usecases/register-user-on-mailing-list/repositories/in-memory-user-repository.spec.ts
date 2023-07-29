import { UserData } from '@/dtos/user-data';
import { InMemoryUserRepository } from '@/usecases/register-user-on-mailing-list/repositories/in-memory-user-repository';

describe('InMemoryUserRepository', () => {
  let users: UserData[];
  let sut: InMemoryUserRepository;

  beforeEach(() => {
    users = [];
    sut = new InMemoryUserRepository(users); // userRepository
  });

  it('Should return null if user is not found', async () => {
    const user = await sut.findUserByEmail('john_doe@email.com');

    expect(user).toBeNull();
  });

  it('should return user if it is found in the repository', async () => {
    await sut.add({
      name: 'John Doe',
      email: 'john_doe@email.com',
    });

    const user = await sut.findUserByEmail('john_doe@email.com');

    expect(user.name).toBe('John Doe');
  });

  it('should return all users in the repository', async () => {
    const users: UserData[] = [
      {
        name: 'John Doe',
        email: 'john_doe@email.com',
      },
      {
        name: 'John Smith',
        email: 'john_smith@email.com',
      },
    ];

    const sut = new InMemoryUserRepository(users);
    const usersResponse = await sut.findAllUsers();

    expect(usersResponse.length).toBe(users.length);
  });
});
