import { UserData } from '@/dtos/user-data';
import { Either, left, right } from '@/shared/either';

import { Email } from './email';
import { InvalidEmailError } from './errors/invalid-email-error';
import { InvalidNameError } from './errors/invalid-name-error';
import { Name } from './name';

export class User {
  private readonly _email: Email;

  private readonly _name: Name;

  constructor(name: Name, email: Email) {
    this._email = email;
    this._name = name;
  }

  get name(): Name {
    return this._name;
  }

  get email(): Email {
    return this._email;
  }

  static create(
    userData: UserData
  ): Either<InvalidNameError | InvalidEmailError, User> {
    const nameOrError: Either<InvalidNameError, Name> = Name.create(
      userData.name
    );

    if (nameOrError.isLeft()) {
      return left(nameOrError.value);
    }

    const emailOrError: Either<InvalidEmailError, Email> = Email.create(
      userData.email
    );

    if (emailOrError.isLeft()) {
      return left(emailOrError.value);
    }

    const name: Name = nameOrError.value;
    const email: Email = emailOrError.value;

    return right(new User(name, email));
  }
}
