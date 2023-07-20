import { EmailOptions } from "@/dtos/email-options";
import { Either, left } from "@/shared/either";
import { MailServiceError } from "@/usecases/errors/mail-service-error";
import { EmailService } from "@/usecases/send-email/ports/email-service";

export class MailServiceErrorStub implements EmailService {
  // Como se fosse o envio de e-mail em memoria, porem simulando o erro
  public timesSendWasCalled = 0;

  async send(
    emailOptions: EmailOptions
  ): Promise<Either<MailServiceError, EmailOptions>> {
    return left(new MailServiceError());
  }
}