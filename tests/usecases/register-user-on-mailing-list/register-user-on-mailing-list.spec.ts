import { User } from '@/entities/user';
import { UserData } from '@/dtos/user-data';
import { RegisterUserOnMailingListUseCase } from '@/usecases/register-user-on-mailing-list/register-user-on-mailing-list-use-case';
import { UserRepository } from '@/usecases/register-user-on-mailing-list/ports/user-repository';
import { InMemoryUserRepository } from '@/usecases/register-user-on-mailing-list/repositories/in-memory-user-repository';

describe('Register user on mailing list use case', () => {
  it('should add user with complete data to mailing list', async () => {
    const users: UserData[] = [];
    const userRepository: UserRepository = new InMemoryUserRepository(users);
    const registerUserOnMailingList: RegisterUserOnMailingListUseCase = new RegisterUserOnMailingListUseCase(
      userRepository
    );
  
    const data = {
     name: 'John Doe',
     email: 'john_doe@email.com'
    }

    const user = User.create({ ...data }).value as User;

    const response = await registerUserOnMailingList.perform(user);

    const { email } = data;
    const addedUser = userRepository.findUserByEmail(email);

    expect((await addedUser).name).toBe('John Doe');
    expect(response.name).toBe('John Doe');
  });
});
