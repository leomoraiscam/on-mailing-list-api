import { HttpResponse } from '../ports/http-response';

export function created<T>(data: T): HttpResponse<T> {
  return {
    statusCode: 201,
    body: data,
  };
}

export const badRequest = <T>(error: Error): HttpResponse<T> => ({
  statusCode: 400,
  body: {
    name: error.name,
    message: error.message,
  } as T,
});

export const failDependency = <T>(error: Error): HttpResponse<T> => ({
  statusCode: 424,
  body: {
    name: error.name,
    message: error.message,
  } as T,
});

export function serverError<T>(error: Error): HttpResponse<T> {
  return {
    statusCode: 500,
    body: {
      name: error.name,
      message: error.message || 'Internal Server Error',
    } as T,
  };
}
