export class InvalidNameError extends Error {
  public readonly name: string = 'InvalidNameError';

  constructor(name: string) {
    super(`Invalid name: ${name}.`)
  }
}