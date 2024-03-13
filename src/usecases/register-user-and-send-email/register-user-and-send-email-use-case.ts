import { UserData } from '@/dtos/user-data';
import { InvalidEmailError } from '@/entities/errors/invalid-email-error';
import { InvalidNameError } from '@/entities/errors/invalid-name-error';
import { User } from '@/entities/user';
import { LoggerService } from '@/external/logger-services/ports/logger-service';
import { Either, left, right } from '@/shared/either';

import { UseCase } from '../ports/use-case';
import { RegisterUserOnMailingListUseCase } from '../register-user-on-mailing-list/register-user-on-mailing-list-use-case';
import { SendEmailUseCase } from '../send-email/send-email-use-case';
import { RegisterAndSendEmailResponse } from './register-user-and-send-email-response';

export class RegisterUserAndSendEmailUseCase
  implements UseCase<UserData, RegisterAndSendEmailResponse>
{
  private registerUserOnMailingListUseCase: RegisterUserOnMailingListUseCase;

  private sendEmailUseCase: SendEmailUseCase;

  private loggerService: LoggerService;

  constructor(
    registerUserOnMailingList: RegisterUserOnMailingListUseCase,
    sendEmail: SendEmailUseCase,
    loggerService: LoggerService
  ) {
    this.registerUserOnMailingListUseCase = registerUserOnMailingList;
    this.sendEmailUseCase = sendEmail;
    this.loggerService = loggerService;
  }

  async perform(request: UserData): Promise<RegisterAndSendEmailResponse> {
    const userOrError: Either<InvalidNameError | InvalidEmailError, User> =
      User.create(request);

    if (userOrError.isLeft()) {
      return left(userOrError.value);
    }

    const user: User = userOrError.value;

    await this.registerUserOnMailingListUseCase.perform(user);
    const result = await this.sendEmailUseCase.perform(user);

    if (result.isLeft()) {
      this.loggerService.log(
        'error',
        `${RegisterUserAndSendEmailUseCase.name} [${JSON.stringify(
          result.value
        )}]`
      );

      return left(result.value);
    }

    this.loggerService.log(
      'log',
      `${RegisterUserAndSendEmailUseCase.name}  - Request completed with success`
    );

    return right({
      name: user.name.value,
      email: user.email.value,
    });
  }
}
