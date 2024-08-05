import { EmailOptions } from '@/dtos/email-options';
import { Either, left } from '@/shared/either';
import { MailServiceError } from '@/usecases/errors/mail-service-error';
import { EmailProvider } from '@/usecases/ports/providers/mail/mail-provider';

export class MailServiceErrorStub implements EmailProvider {
  async send(_: EmailOptions): Promise<Either<MailServiceError, EmailOptions>> {
    return left(new MailServiceError());
  }
}
