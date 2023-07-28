import { UserData } from '@/dtos/user-data';
import { Either, left, right } from '@/shared/either';

import { Email } from './email';
import { InvalidEmailError } from './errors/invalid-email-error';
import { Name } from './name';

export class User {
  public readonly email: Email;

  public readonly name: Name;

  constructor(name: Name, email: Email) {
    this.email = email;
    this.name = name;
  }

  static create(userData: UserData): Either<InvalidEmailError, User> {
    const nameOrError = Name.create(userData.name);

    if (nameOrError.isLeft()) {
      return left(nameOrError.value);
    }

    const emailOrError = Email.create(userData.email);

    if (emailOrError.isLeft()) {
      return left(emailOrError.value);
    }

    const name: Name = nameOrError.value as Name;
    const email: Email = emailOrError.value as Email;

    return right(new User(name, email));
  }
}
