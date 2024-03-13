import { DomainError } from './domain-error';

export class InvalidEmailError extends Error implements DomainError {
  public readonly name: string = 'InvalidEmailError';

  constructor(email: string) {
    super(`Invalid email: ${email}.`);
  }
}
