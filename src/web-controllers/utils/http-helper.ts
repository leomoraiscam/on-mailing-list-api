import { HttpResponse } from '../ports/http-response';

export function created<T>(data: T): HttpResponse<T> {
  return {
    statusCode: 201,
    body: data,
  };
}

export function badRequest<T>(data: T): HttpResponse<T> {
  return {
    statusCode: 400,
    body: data,
  };
}

export function serverError<T>(data: T): HttpResponse<T> {
  return {
    statusCode: 500,
    body: data,
  };
}
