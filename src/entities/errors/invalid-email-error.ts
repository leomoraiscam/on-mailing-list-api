export class InvalidEmailError extends Error {
  public readonly name: string = 'InvalidEmailError';

  constructor(email: string) {
    super(`Invalid email: ${email}.`)
  }
}