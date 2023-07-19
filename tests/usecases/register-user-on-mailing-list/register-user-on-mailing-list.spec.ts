import { User } from '@/entities/user';
import { UserData } from '@/dtos/user-data';
import { RegisterUserOnMailingList } from '@/usecases/register-user-on-mailing-list/register-user-on-mailing-list';
import { UserRepository } from '@/usecases/register-user-on-mailing-list/ports/user-repository';
import { InMemoryUserRepository } from '@/usecases/register-user-on-mailing-list/repositories/in-memory-user-repository';

describe('Register user on mailing list use case', () => {
  it('should add user with complete data to mailing list', async () => {
    const users: UserData[] = [];
    const repository: UserRepository = new InMemoryUserRepository(users);
    const usecase: RegisterUserOnMailingList = new RegisterUserOnMailingList(
      repository
    );
    const name = 'any_name';
    const email = 'any_email@email.com';

    const user = User.create({ name, email }).value as User;

    const response = await usecase.perform(user);

    const addedUser = repository.findUserByEmail(email);

    expect((await addedUser).name).toBe('any_name');
    expect(response.name).toBe('any_name');
  });
});
