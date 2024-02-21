import { UserData } from '@/dtos/user-data';
import { User } from '@/entities/user';
import { InMemoryUserRepository } from '@/external/repositories/mongodb/in-memory-user-repository';
import { UserRepository } from '@/external/repositories/mongodb/ports/user-repository';
import { RegisterUserOnMailingListUseCase } from '@/usecases/register-user-on-mailing-list/register-user-on-mailing-list-use-case';

const users: UserData[] = [];
const mockLoggerService = {
  log: jest.fn(),
};

describe('Register user on mailing list use case', () => {
  it('should add user with complete data to mailing list', async () => {
    const userRepository: UserRepository = new InMemoryUserRepository(users);

    const registerUserOnMailingList: RegisterUserOnMailingListUseCase =
      new RegisterUserOnMailingListUseCase(userRepository, mockLoggerService);

    const data = {
      name: 'Jayden Mack',
      email: 'ita@odon.lt',
    };

    const user = User.create({ ...data }).value as User;

    const response = await registerUserOnMailingList.perform(user);

    const { email } = data;
    const addedUser = userRepository.findUserByEmail(email);

    expect((await addedUser).name).toBe('Jayden Mack');
    expect(response.name).toBe('Jayden Mack');
    expect(mockLoggerService.log).toHaveBeenCalledTimes(1);
    expect(mockLoggerService.log).toHaveBeenCalledWith(
      'log',
      `RegisterUserOnMailingListUseCase [{"email":{"email":"${data.email}"},"name":{"name":"${data.name}"}}] - Recipient added`
    );
  });
});
