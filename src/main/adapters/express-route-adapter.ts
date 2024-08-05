import { Request, Response } from 'express';

import { UserData } from '@/dtos/user-data';
import { HttpRequest } from '@/web-controllers/ports/http-request';
import { RegisterUserController } from '@/web-controllers/register-user-controller';

export const adaptRoute = (controller: RegisterUserController) => {
  return async (request: Request, response: Response): Promise<void> => {
    const httpRequest: HttpRequest<UserData> = {
      body: request.body,
    };

    const httpResponse = await controller.handle(httpRequest);

    response.status(httpResponse.statusCode).json(httpResponse.body);
  };
};
