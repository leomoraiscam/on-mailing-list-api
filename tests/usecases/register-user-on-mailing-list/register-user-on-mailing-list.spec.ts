import { UserData } from '@/dtos/user-data';
import { User } from '@/entities/user/user';
import { InMemoryUserRepository } from '@/external/repositories/mongodb/in-memory-user-repository';
import { UserRepository } from '@/external/repositories/mongodb/ports/user-repository';
import { RegisterUserUseCase } from '@/usecases/register-user/register-user-use-case';

const users: UserData[] = [];
const mockLoggerService = {
  log: jest.fn(),
};

describe('Register User Use Case', () => {
  it('should add user on mailing list when receive correct data', async () => {
    const name = 'Jayden Mack';
    const email = 'ita@odon.lt';

    const userRepository: UserRepository = new InMemoryUserRepository(users);

    const registerUserUseCase: RegisterUserUseCase = new RegisterUserUseCase(
      userRepository,
      mockLoggerService
    );

    const user = User.create({ name, email }).value as User;

    const response = await registerUserUseCase.perform(user);

    const addedUser = userRepository.findUserByEmail(email);

    expect((await addedUser).name).toBe(name);
    expect(response.name).toBe(name);
    expect(mockLoggerService.log).toHaveBeenCalledTimes(1);
    expect(mockLoggerService.log).toHaveBeenCalledWith(
      'log',
      `RegisterUserUseCase [{"email":{"email":"${email}"},"name":{"name":"${name}"}}] - Recipient added`
    );
  });
});
