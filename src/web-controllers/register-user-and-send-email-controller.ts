import { UserData } from '@/dtos/user-data';
import { UseCase } from '@/usecases/ports/use-case';

import { MissingParamError } from './errors/missing-param-error';
import { HttpRequest } from './ports/http-request';
import { HttpResponse } from './ports/http-response';
import { badRequest, created, serverError } from './utils/http-helper';

export class RegisterUserAndSendEmailController {
  private readonly usecase: UseCase;

  constructor(usecase: UseCase) {
    this.usecase = usecase;
  }

  async handle(
    request: HttpRequest<UserData | Partial<UserData>>
  ): Promise<HttpResponse<UserData | Error>> {
    try {
      if (!request.body.name || !request.body.email) {
        let missing = !request.body.name ? 'name ' : '';

        missing += !request.body.email ? 'email' : '';

        return badRequest<Error>(new MissingParamError(missing.trim()));
      }

      const userData = request.body as UserData;
      const response = await this.usecase.perform(userData);

      if (response.isLeft()) {
        return badRequest<Error>(response.value);
      }

      return created<UserData>(response.value);
    } catch (error) {
      return serverError<Error>(error);
    }
  }
}
