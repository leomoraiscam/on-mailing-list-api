import { EmailOptions } from '@/dtos/email-options';
import { EmailService } from '@/external/mail-services/ports/email-service';
import { Either, left } from '@/shared/either';
import { MailServiceError } from '@/usecases/errors/mail-service-error';

export class MailServiceErrorStub implements EmailService {
  async send(_: EmailOptions): Promise<Either<MailServiceError, EmailOptions>> {
    return left(new MailServiceError());
  }
}
