import { ControllerError } from './controller-error';

export class MissingParamError extends Error implements ControllerError {
  public readonly name = 'MissingParamError';

  constructor(param: string) {
    super(`Missing "${param}" parameter from request.`);
  }
}
