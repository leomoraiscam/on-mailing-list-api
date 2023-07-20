import { EmailOptions } from "@/dtos/email-options";
import { Either, right } from "@/shared/either";
import { MailServiceError } from "@/usecases/errors/mail-service-error";
import { EmailService } from "@/usecases/send-email/ports/email-service";

export class MailServiceMock implements EmailService {
  public timesSendWasCalled = 0;

  async send(
    emailOptions: EmailOptions
  ): Promise<Either<MailServiceError, EmailOptions>> {
    this.timesSendWasCalled += 1;

    return right(emailOptions);
  }
}