import { UserData } from '@/dtos/user-data';
import { MailServiceError } from '@/usecases/errors/mail-service-error';
import { RegisterUser } from '@/usecases/register-user/register-user';
import { SendEmailToUserWithBonus } from '@/usecases/send-email-to-user-with-bonus/send-email-to-user-with-bonus';

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

export class RegisterUserController {
  private readonly registerUser: RegisterUser;
  private readonly sendEmailToUser: SendEmailToUserWithBonus;

  constructor(
    registerUser: RegisterUser,
    sendEmailToUser: SendEmailToUserWithBonus
  ) {
    this.registerUser = registerUser;
    this.sendEmailToUser = sendEmailToUser;
  }

  async handle(
    request: HttpRequest<UserData>
  ): Promise<HttpResponse<UserData | ControllerError>> {
    try {
      if (!request.body.name || !request.body.email) {
        const missing = !request.body.name ? 'name' : 'email';

        return badRequest(new MissingParamError(missing.trim()));
      }

      const user: UserData = {
        name: request.body.name,
        email: request.body.email,
      };
      const registerUserResponse = await this.registerUser.perform(user);

      if (registerUserResponse.isLeft()) {
        return badRequest(registerUserResponse.value);
      }

      const sendEmailResponse = await this.sendEmailToUser.perform(user);

      if (sendEmailResponse.isLeft()) {
        const error = sendEmailResponse.value;

        if (error.name === MailServiceError.name) {
          return failDependency(sendEmailResponse.value);
        }
      }

      return created<UserData>(registerUserResponse.value);
    } catch (error) {
      return serverError(error);
    }
  }
}
