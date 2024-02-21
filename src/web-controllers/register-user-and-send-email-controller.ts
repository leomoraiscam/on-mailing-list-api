import { UserData } from '@/dtos/user-data';

import { RegisterUserAndSendEmailUseCase } from '../usecases/register-user-and-send-email/register-user-and-send-email-use-case';
import { ControllerError } from './errors/controller-error';
import { MissingParamError } from './errors/missing-param-error';
import { badRequest, created, serverError } from './helper/http-helper';
import { HttpRequest } from './ports/http-request';
import { HttpResponse } from './ports/http-response';

export class RegisterUserAndSendEmailController {
  private readonly registerUserAndSendEmailUseCase: RegisterUserAndSendEmailUseCase;

  constructor(
    registerUserAndSendEmailUseCase: RegisterUserAndSendEmailUseCase
  ) {
    this.registerUserAndSendEmailUseCase = registerUserAndSendEmailUseCase;
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
      const response = await this.registerUserAndSendEmailUseCase.perform(
        userData
      );

      if (response.isLeft()) {
        return badRequest<ControllerError>(response.value);
      }

      return created<UserData>(response.value);
    } catch (error) {
      return serverError<ControllerError>(error);
    }
  }
}
