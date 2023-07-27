export class MailServiceError extends Error {
  public readonly name: string = 'MailServiceError';
  
  constructor() {
    super('Mail service error.');
  }
}
