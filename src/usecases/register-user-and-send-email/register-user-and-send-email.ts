import { InvalidEmailError } from '@/entities/errors/invalid-email-error';
import { InvalidNameError } from '@/entities/errors/invalid-name-error';
import { User } from '@/entities/user';
import { UserData } from '@/dtos/user-data';
import { Either, left, right } from '@/shared/either';
import { MailServiceError } from '../errors/mail-service-error';
import { UseCase } from '../ports/use-case';
import { RegisterUserOnMailingList } from '../register-user-on-mailing-list/register-user-on-mailing-list';
import { SendEmail } from '../send-email/send-email';

export class RegisterUserAndSendEmailUseCase implements UseCase {
  private registerUserOnMailingList: RegisterUserOnMailingList;
  private sendEmail: SendEmail;

  constructor(
    registerUserOnMailingList: RegisterUserOnMailingList,
    sendEmail: SendEmail
  ) {
    this.registerUserOnMailingList = registerUserOnMailingList;
    this.sendEmail = sendEmail;
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

    await this.registerUserOnMailingList.perform(user);
    
    const result = await this.sendEmail.perform(user);

    if (result.isLeft()) {
      return left(result.value);
    }

    return right({
      name: user.name.value,
      email: user.email.value
    });
  }
}
