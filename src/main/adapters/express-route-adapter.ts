import { RegisterUserAndSendEmailController } from '@/web-controllers/register-user-and-send-email-controller';
import { HttpRequest } from '@/web-controllers/ports/http-request';
import { Request, Response } from 'express';

export const adaptRoute = (controller: RegisterUserAndSendEmailController) => {
  return async (request: Request, response: Response) => {
    const httpRequest: HttpRequest = {
      body: request.body
    }

    const httpResponse = await controller.handle(httpRequest);
    
    response.status(httpResponse.statusCode).json(httpResponse.body);
  }
}