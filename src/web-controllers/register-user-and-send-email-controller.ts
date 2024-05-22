import { UserData } from '@/dtos/user-data';
import { MailServiceError } from '@/usecases/errors/mail-service-error';
import { UseCase } from '@/usecases/ports/use-case';
import { RegisterAndSendEmailResponse } from '@/usecases/register-user-and-send-email/register-user-and-send-email-response';

import { ControllerError } from './errors/controller-error';
import { MissingParamError } from './errors/missing-param-error';
import {
  badRequest,
  created,
  failDependency,
  serverError,
} from './helper/http-helper';
import { HttpRequest } from './ports/http-request';
import { HttpResponse } from './ports/http-response';

export class RegisterUserAndSendEmailController {
  private readonly useCase: UseCase<UserData, RegisterAndSendEmailResponse>;

  constructor(useCase: UseCase<UserData, RegisterAndSendEmailResponse>) {
    this.useCase = useCase;
  }

  async handle(
    request: HttpRequest<UserData | Partial<UserData>>
  ): Promise<HttpResponse<UserData | ControllerError | Error>> {
    try {
      if (!request.body.name || !request.body.email) {
        const missing = !request.body.name ? 'name' : 'email';

        return badRequest<ControllerError>(
          new MissingParamError(missing.trim())
        );
      }

      const userData = request.body as UserData;
      const response = await this.useCase.perform(userData);

      if (response.isLeft()) {
        const error = response.value;

        if (error.name === MailServiceError.name)
          return failDependency<ControllerError>(response.value);

        return badRequest<ControllerError>(response.value);
      }

      return created<UserData>(response.value);
    } catch (error) {
      return serverError<ControllerError>(error);
    }
  }
}
