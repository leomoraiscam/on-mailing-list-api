import { UserData } from '@/dtos/user-data';
import { UserRepository } from '@/usecases/ports/repositories/user-repository';
import { RegisterUser } from '@/usecases/register-user/register-user';
import { InMemoryUserRepository } from '@test/doubles/repositories/in-memory-user-repository';

const mockLoggerService = {
  log: jest.fn(),
};

describe('Register user on mailing list use case', () => {
  let userRepository: UserRepository;
  let registerUser: RegisterUser;
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
    jest.spyOn(userRepository, 'exists').mockResolvedValueOnce(true);

    await registerUser.perform(user);

    expect(mockLoggerService.log).toHaveBeenCalledTimes(1);
    expect(mockLoggerService.log).toHaveBeenCalledWith(
      'log',
      `RegisterUser: [{"name":"${user.name}","email":"${user.email}"}] - Recipient already exist on database`
    );
  });
});
