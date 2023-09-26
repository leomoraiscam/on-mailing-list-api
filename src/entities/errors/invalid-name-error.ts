import { DomainError } from './domain-error';

export class InvalidNameError extends Error implements DomainError {
  public readonly name: string = 'InvalidNameError';

  constructor(name: string) {
    super(`Invalid name: ${name}.`);
  }
}
