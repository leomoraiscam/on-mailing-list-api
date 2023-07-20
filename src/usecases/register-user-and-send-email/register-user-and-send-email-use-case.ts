import { InvalidEmailError } from '@/entities/errors/invalid-email-error';
import { InvalidNameError } from '@/entities/errors/invalid-name-error';
import { User } from '@/entities/user';
import { UserData } from '@/dtos/user-data';
import { Either, left, right } from '@/shared/either';
import { MailServiceError } from '../errors/mail-service-error';
import { UseCase } from '../ports/use-case';
import { RegisterUserOnMailingListUseCase } from '../register-user-on-mailing-list/register-user-on-mailing-list-use-case';
import { SendEmailUseCase } from '../send-email/send-email-use-case';

export class RegisterUserAndSendEmailUseCase implements UseCase {
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
      email: user.email.value
    });
  }
}
