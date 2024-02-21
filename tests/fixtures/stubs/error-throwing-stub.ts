import { UserData } from '@/dtos/user-data';
import { InvalidEmailError } from '@/entities/errors/invalid-email-error';
import { InvalidNameError } from '@/entities/errors/invalid-name-error';
import { Either } from '@/shared/either';
import { MailServiceError } from '@/usecases/errors/mail-service-error';
import { UseCase } from '@/usecases/ports/use-case';

export class ErrorThrowingUseCaseStub
  implements
    UseCase<
      UserData,
      Either<InvalidNameError | InvalidEmailError | MailServiceError, UserData>
    >
{
  async perform(
    _: UserData
  ): Promise<
    Either<InvalidNameError | InvalidEmailError | MailServiceError, UserData>
  > {
    throw Error();
  }
}
