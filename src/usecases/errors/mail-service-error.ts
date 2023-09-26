import { UseCaseError } from './usecase-error';

export class MailServiceError extends Error implements UseCaseError {
  public readonly name: string = 'MailServiceError';

  constructor() {
    super('Mail service error.');
  }
}
