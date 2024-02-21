import { UserData } from '@/dtos/user-data';
import { InvalidEmailError } from '@/entities/errors/invalid-email-error';
import { InvalidNameError } from '@/entities/errors/invalid-name-error';
import { Either } from '@/shared/either';
import { MailServiceError } from '@/usecases/errors/mail-service-error';

import { ControllerError } from './errors/controller-error';
import { MissingParamError } from './errors/missing-param-error';
import { badRequest, created, serverError } from './helper/http-helper';
import { HttpRequest } from './ports/http-request';
import { HttpResponse } from './ports/http-response';
import { UseCase } from './ports/use-case';

export class RegisterUserAndSendEmailController {
  private readonly usecase: UseCase<
    UserData,
    Either<InvalidNameError | InvalidEmailError | MailServiceError, UserData>
  >;

  constructor(
    usecase: UseCase<
      UserData,
      Either<InvalidNameError | InvalidEmailError | MailServiceError, UserData>
    >
  ) {
    this.usecase = usecase;
  }

  async handle(
    request: HttpRequest<UserData | Partial<UserData>>
  ): Promise<HttpResponse<UserData | ControllerError>> {
    try {
      if (!request.body.name || !request.body.email) {
        const missing = !request.body.name ? 'name' : 'email';

        return badRequest<ControllerError>(
          new MissingParamError(missing.trim())
        );
      }

      const userData = request.body as UserData;
      const response = await this.usecase.perform(userData);

      if (response.isLeft()) {
        return badRequest<ControllerError>(response.value);
      }

      return created<UserData>(response.value);
    } catch (error) {
      return serverError<ControllerError>(error);
    }
  }
}
