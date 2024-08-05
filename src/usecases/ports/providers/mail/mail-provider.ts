import { EmailOptions } from '@/dtos/email-options';
import { Either } from '@/shared/either';
import { MailServiceError } from '@/usecases/errors/mail-service-error';

export interface EmailProvider {
  send: (
    options: EmailOptions
  ) => Promise<Either<MailServiceError, EmailOptions>>;
}
