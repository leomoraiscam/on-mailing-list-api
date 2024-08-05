import { EmailOptions } from '@/dtos/email-options';
import { EmailService } from '@/external/mail-services/ports/email-service';
import { Either, right } from '@/shared/either';
import { MailServiceError } from '@/usecases/errors/mail-service-error';

export class MailServiceMock implements EmailService {
  public timesSendWasCalled = 0;

  async send(
    emailOptions: EmailOptions
  ): Promise<Either<MailServiceError, EmailOptions>> {
    this.timesSendWasCalled += 1;

    return right(emailOptions);
  }
}
