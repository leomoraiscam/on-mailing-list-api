import { User } from "@/entities/user";

describe('User domain class', () => {
  it('should not create user with invalid email address', () => {
    const invalid_email = 'invalid_email';

    const error = User.create({
      name: 'any_name',
      email: invalid_email
    }).value as Error;

    expect(error.name).toEqual('InvalidEmailError');
    expect(error.message).toEqual(`Invalid email: ${invalid_email}.`);
  })

  it('should not create user with invalid name (too few characters)', () => {
    const invalid_name = 'l       ';

    const error = User.create({ 
      name: invalid_name, 
      email: 'any@mail.com' 
    }).value as Error;

    expect(error.name).toEqual('InvalidNameError');
    expect(error.message).toEqual(`Invalid name: ${invalid_name}.`);
  })

  it('should not create user with invalid name (too many characters)', () => {
    const invalid_name = 'l'.repeat(257);

    const error = User.create({
      name: invalid_name,
      email: 'any_email@email.com'
    }).value as Error;

    expect(error.name).toEqual('InvalidNameError');
    expect(error.message).toEqual(`Invalid name: ${invalid_name}.`);  })

  it('should create user with valid data', () => {
    const user = User.create({
      name: 'any',
      email: 'any_email@email.com'
    }).value as User;

    expect(user.name.value).toEqual('any')
    expect(user.email.value).toEqual('any_email@email.com')

  })
})