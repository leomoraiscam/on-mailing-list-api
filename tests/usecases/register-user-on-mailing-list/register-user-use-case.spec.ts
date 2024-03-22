import { User } from '@/entities/user/user';
import { RegisterUserUseCase } from '@/usecases/register-user/register-user-use-case';
import { InMemoryUserRepository } from '@/usecases/register-user/repositories/in-memory/in-memory-user-repository';
import { UserRepository } from '@/usecases/register-user/repositories/ports/user-repository';

const mockLoggerService = {
  log: jest.fn(),
};

describe('Register User Use Case', () => {
  it('should add user on mailing list when receive correct data', async () => {
    const name = 'Jayden Mack';
    const email = 'ita@odon.lt';

    const userRepository: UserRepository = new InMemoryUserRepository();

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
      `RegisterUserUseCase: [{"email":{"email":"${email}"},"name":{"name":"${name}"}}] - Recipient added on database`
    );
  });

  it('should return user on mailing list when the same already exist', async () => {
    const name = 'Jayden Mack';
    const email = 'ita@odon.lt';

    const userRepository: UserRepository = new InMemoryUserRepository();

    jest.spyOn(userRepository, 'exists').mockResolvedValueOnce(true);

    const registerUserUseCase: RegisterUserUseCase = new RegisterUserUseCase(
      userRepository,
      mockLoggerService
    );

    const user = User.create({ name, email }).value as User;

    await registerUserUseCase.perform(user);

    expect(mockLoggerService.log).toHaveBeenCalledTimes(1);
    expect(mockLoggerService.log).toHaveBeenCalledWith(
      'log',
      `RegisterUserUseCase: [{"email":{"email":"${email}"},"name":{"name":"${name}"}}] - Recipient already exist on database`
    );
  });
});
