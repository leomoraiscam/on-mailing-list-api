import { User } from '@/entities/user';

describe('User domain class', () => {
  it('should not create user with invalid email address', () => {
    const invalidEmail = 'local_domain.com';

    const error = User.create({
      name: 'John doe',
      email: invalidEmail,
    }).value as Error;

    expect(error.name).toEqual('InvalidEmailError');
    expect(error.message).toEqual(`Invalid email: ${invalidEmail}.`);
  });

  it('should not create user with invalid name (too few characters)', () => {
    const invalidName = 'l       ';

    const error = User.create({
      name: invalidName,
      email: 'local@domain.com',
    }).value as Error;

    expect(error.name).toEqual('InvalidNameError');
    expect(error.message).toEqual(`Invalid name: ${invalidName}.`);
  });

  it('should not create user with invalid name (too many characters)', () => {
    const invalid_name = 'l'.repeat(257);

    const error = User.create({
      name: invalid_name,
      email: 'local_partl@domain.com',
    }).value as Error;

    expect(error.name).toEqual('InvalidNameError');
    expect(error.message).toEqual(`Invalid name: ${invalid_name}.`);
  });

  it('should create user with valid data', () => {
    const user = User.create({
      name: 'any',
      email: 'local_partl@domain.com',
    }).value as User;

    expect(user.name.value).toEqual('any');
    expect(user.email.value).toEqual('local_partl@domain.com');
  });
});
