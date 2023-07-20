import { Either, right } from "@/shared/either";
import { MailServiceError } from "@/usecases/errors/mail-service-error";
import { EmailOptions, EmailService } from "@/usecases/send-email/ports/email-service";

export class MailServiceStub implements EmailService {
  async send (emailOptions: EmailOptions): Promise<Either<MailServiceError, EmailOptions>> {
    return right(emailOptions)
  }
}


