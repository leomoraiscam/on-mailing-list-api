import { EmailOptions } from '@/dtos/email-options';
import { Either, right } from '@/shared/either';
import { MailServiceError } from '@/usecases/errors/mail-service-error';
import { EmailProvider } from '@/usecases/ports/providers/mail/mail-provider';

export class MailServiceStub implements EmailProvider {
  async send(
    emailOptions: EmailOptions
  ): Promise<Either<MailServiceError, EmailOptions>> {
    return right(emailOptions);
  }
}
