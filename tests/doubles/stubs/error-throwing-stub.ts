/* eslint-disable max-classes-per-file */
import { EmailOptions } from '@/dtos/email-options';
import { UserData } from '@/dtos/user-data';
import { InvalidEmailError } from '@/entities/user/errors/invalid-email-error';
import { InvalidNameError } from '@/entities/user/errors/invalid-name-error';
import { Either } from '@/shared/either';
import { MailServiceError } from '@/usecases/errors/mail-service-error';
// import { MailServiceError } from '@/usecases/errors/mail-service-error';
import { UseCase } from '@/usecases/ports/services/use-case';

export class ErrorThrowingRegisterUserUseCaseStub
  implements
    UseCase<UserData, Either<InvalidNameError | InvalidEmailError, UserData>>
{
  async perform(
    _: UserData
  ): Promise<Either<InvalidNameError | InvalidEmailError, UserData>> {
    throw Error();
  }
}

export class ErrorThrowingSendEmailToUserWithBonusUseCaseStub
  implements UseCase<UserData, Either<MailServiceError, EmailOptions>>
{
  async perform(_: UserData): Promise<Either<MailServiceError, EmailOptions>> {
    throw Error();
  }
}
