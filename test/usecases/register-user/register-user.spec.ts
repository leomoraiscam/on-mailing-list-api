import { UserData } from '@/dtos/user-data';
import { UserRepository } from '@/usecases/ports/repositories/user-repository';
import { RegisterUser } from '@/usecases/register-user/register-user';
import { InMemoryUserRepository } from '@test/doubles/repositories/in-memory-user-repository';

describe('RegisterUserUseCase', () => {
  let userRepository: UserRepository;
  let registerUser: RegisterUser;
  const mockLoggerService = {
    log: jest.fn(),
  };
  const user: UserData = {
    name: 'Jayden Mack',
    email: 'ita@odon.lt',
  };

  beforeEach(() => {
    userRepository = new InMemoryUserRepository();
    registerUser = new RegisterUser(userRepository, mockLoggerService);
  });

  it('should be able to register user on mailing list when receive correct data', async () => {
    await registerUser.perform(user);

    expect(mockLoggerService.log).toHaveBeenCalledTimes(1);
    expect(mockLoggerService.log).toHaveBeenCalledWith(
      'log',
      `RegisterUser: [{"name":"${user.name}","email":"${user.email}"}] - Recipient added on database`
    );
  });

  it('should be able to return user when the same already exist', async () => {
    jest.spyOn(userRepository, 'findByEmail').mockResolvedValueOnce({
      name: 'any name',
      email: 'any email',
    });

    await registerUser.perform(user);

    expect(mockLoggerService.log).toHaveBeenCalledTimes(1);
    expect(mockLoggerService.log).toHaveBeenCalledWith(
      'log',
      `RegisterUser: [{"name":"${user.name}","email":"${user.email}"}] - Recipient already exist on database`
    );
  });
});
