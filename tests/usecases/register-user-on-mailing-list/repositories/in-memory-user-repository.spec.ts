import { UserData } from "@/dtos/user-data";
import { InMemoryUserRepository } from "@/usecases/register-user-on-mailing-list/repositories/in-memory-user-repository";

describe('InMemoryUserRepository', () => {
  it('Should return null if user is not found', async () => {
    const users: UserData[] = [];
    const sut = new InMemoryUserRepository(users); // userRepository

    const user = await sut.findUserByEmail('email@email.com');

    expect(user).toBeNull()
  })

  it('should return user if it is found in the repository', async () => {
    const users: UserData[] = [];

    const sut = new InMemoryUserRepository(users); // userRepository
    
    await sut.add({
      name: 'any_name',
      email: 'any_email@email.com'
    });

    const user = await sut.findUserByEmail('any_email@email.com');

    expect(user.name).toBe('any_name');
  })

  it('should return all users in the repository', async () => {
    const users: UserData[] = [
      {
        name: 'any_name',
        email: 'any_email@email.com'
      },
      {
        name: 'any_name1',
        email: 'any_email1@email.com'
      }
    ];

    const sut = new InMemoryUserRepository(users); // userRepository

    const usersResponse = await sut.findAllUsers();

    expect(usersResponse.length).toBe(users.length);
  })
})