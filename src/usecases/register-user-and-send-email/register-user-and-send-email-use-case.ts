import { UserData } from '@/dtos/user-data';
import { InvalidEmailError } from '@/entities/errors/invalid-email-error';
import { InvalidNameError } from '@/entities/errors/invalid-name-error';
import { User } from '@/entities/user';
import { Either, left, right } from '@/shared/either';

import { MailServiceError } from '../errors/mail-service-error';
import { RegisterUserOnMailingListUseCase } from '../register-user-on-mailing-list/register-user-on-mailing-list-use-case';
import { SendEmailUseCase } from '../send-email/send-email-use-case';

interface UseCase<T, R> {
  perform: (request: T) => Promise<T | R>;
}

export class RegisterUserAndSendEmailUseCase
  implements
    UseCase<
      UserData,
      Either<InvalidNameError | InvalidEmailError | MailServiceError, UserData>
    >
{
  private registerUserOnMailingListUseCase: RegisterUserOnMailingListUseCase;

  private sendEmailUseCase: SendEmailUseCase;

  constructor(
    registerUserOnMailingList: RegisterUserOnMailingListUseCase,
    sendEmail: SendEmailUseCase
  ) {
    this.registerUserOnMailingListUseCase = registerUserOnMailingList;
    this.sendEmailUseCase = sendEmail;
  }

  async perform(
    request: UserData
  ): Promise<
    Either<InvalidNameError | InvalidEmailError | MailServiceError, UserData>
  > {
    const userOrError: Either<InvalidNameError | InvalidEmailError, User> =
      User.create(request);

    if (userOrError.isLeft()) {
      return left(userOrError.value);
    }

    const user: User = userOrError.value;

    await this.registerUserOnMailingListUseCase.perform(user);

    const result = await this.sendEmailUseCase.perform(user);

    if (result.isLeft()) {
      return left(result.value);
    }

    return right({
      name: user.name.value,
      email: user.email.value,
    });
  }
}
