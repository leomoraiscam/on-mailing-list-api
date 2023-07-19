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

  async handle(request: HttpRequest): Promise<HttpResponse> {  
    try {
      if (!request.body.name || !request.body.email) {
        let missing = !request.body.name ? 'name ' : '';

        missing += !request.body.email ? 'email' : '';

        return badRequest(new MissingParamError(missing.trim()));
      }

      const userData: UserData = request.body;
      const response = await this.usecase.perform(userData);

      if (response.isLeft()) {
        return badRequest(response.value);
      }

      return created(response.value);
    } catch (error) {
      return serverError(error);
    }
  }
}
