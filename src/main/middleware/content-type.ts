import { Request, Response, NextFunction } from 'express';

export const contentType = (
  request: Request,
  response: Response,
  next: NextFunction
): void => {
  if (!request.path.startsWith('/api-docs')) {
    response.type('json');
  }

  next();
};
