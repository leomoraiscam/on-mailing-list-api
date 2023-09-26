import { User } from '@/entities/user';

describe('User domain class', () => {
  it('should create user with valid data', () => {
    const userOrError = User.create({
      name: 'any',
      email: 'local_partl@domain.com',
    });

    const user = userOrError.value as User;

    expect(user.name.value).toEqual('any');
    expect(user.email.value).toEqual('local_partl@domain.com');
  });

  it('should not create user with invalid email address', () => {
    const invalidEmail = 'local_domain.com';

    const userOrError = User.create({
      name: 'John doe',
      email: invalidEmail,
    });

    const error = userOrError.value as Error;

    expect(error.name).toEqual('InvalidEmailError');
    expect(error.message).toEqual(`Invalid email: ${invalidEmail}.`);
  });

  it('should not create user with invalid name (too few characters)', () => {
    const invalidName = 'l       ';

    const userOrError = User.create({
      name: invalidName,
      email: 'local@domain.com',
    });

    const error = userOrError.value as Error;

    expect(error.name).toEqual('InvalidNameError');
    expect(error.message).toEqual(`Invalid name: ${invalidName}.`);
  });

  it('should not create user with invalid name (too many characters)', () => {
    const invalid_name = 'l'.repeat(257);

    const userOrError = User.create({
      name: invalid_name,
      email: 'local_partl@domain.com',
    });

    const error = userOrError.value as Error;

    expect(error.name).toEqual('InvalidNameError');
    expect(error.message).toEqual(`Invalid name: ${invalid_name}.`);
  });
});
