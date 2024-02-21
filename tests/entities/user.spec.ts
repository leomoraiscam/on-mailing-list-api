import { User } from '@/entities/user';

describe('User Domain Entity', () => {
  it('should create user with valid data', () => {
    const userOrError = User.create({
      name: 'Charlotte Johnson',
      email: 'sot@pub.ck',
    });

    const user = userOrError.value as User;

    expect(user.name.value).toEqual('Charlotte Johnson');
    expect(user.email.value).toEqual('sot@pub.ck');
  });

  it('should not create user with invalid email address', () => {
    const invalidEmail = 'local_domain.com';

    const userOrError = User.create({
      name: 'Stephen Pearson',
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
      email: 'egzeelu@far.be',
    });

    const error = userOrError.value as Error;

    expect(error.name).toEqual('InvalidNameError');
    expect(error.message).toEqual(`Invalid name: ${invalidName}.`);
  });

  it('should not create user with invalid name (too many characters)', () => {
    const invalid_name = 'l'.repeat(257);

    const userOrError = User.create({
      name: invalid_name,
      email: 'sakuta@pad.nu',
    });

    const error = userOrError.value as Error;

    expect(error.name).toEqual('InvalidNameError');
    expect(error.message).toEqual(`Invalid name: ${invalid_name}.`);
  });
});
