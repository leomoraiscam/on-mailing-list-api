import { ControllerError } from '../errors/controller-error';
import { HttpResponse } from '../ports/http-response';

export const created = <T>(data: T): HttpResponse<T> => ({
  statusCode: 201,
  body: data,
});

export const badRequest = (error: Error): HttpResponse<ControllerError> => ({
  statusCode: 400,
  body: {
    name: error.name,
    message: error.message,
  },
});

export const failDependency = (
  error: Error
): HttpResponse<ControllerError> => ({
  statusCode: 424,
  body: {
    name: error.name,
    message: error.message,
  },
});

export const serverError = (error: Error): HttpResponse<ControllerError> => ({
  statusCode: 500,
  body: {
    name: error.name,
    message: error.message || 'Internal Server Error',
  },
});
