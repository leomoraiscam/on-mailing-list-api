import { EmailOptions } from '@/dtos/email-options';
import { Either, left } from '@/shared/either';
import { MailServiceError } from '@/usecases/errors/mail-service-error';
import { EmailService } from '@/usecases/send-email/ports/email-service';

export class MailServiceErrorStub implements EmailService {
  async send(_: EmailOptions): Promise<Either<MailServiceError, EmailOptions>> {
    return left(new MailServiceError());
  }
}
