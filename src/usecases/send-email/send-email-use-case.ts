import { EmailOptions } from '@/dtos/email-options';
import { User } from '@/entities/user/user';
import { LoggerService } from '@/external/logger-services/ports/logger-service';
import { EmailService } from '@/external/mail-services/ports/email-service';
import { Either } from '@/shared/either';

import { MailServiceError } from '../errors/mail-service-error';
import { UseCase } from '../ports/use-case';

export class SendEmailUseCase
  implements UseCase<User, Either<MailServiceError, EmailOptions>>
{
  private readonly emailOptions: EmailOptions;

  private readonly emailService: EmailService;

  private readonly loggerService: LoggerService;

  constructor(
    emailOptions: EmailOptions,
    emailService: EmailService,
    loggerService: LoggerService
  ) {
    this.emailOptions = emailOptions;
    this.emailService = emailService;
    this.loggerService = loggerService;
  }

  async perform(
    request: User
  ): Promise<Either<MailServiceError, EmailOptions>> {
    const greetings = `E ai <b>${request.name}</b>, beleza ?`;
    const customizedHTML = `${greetings}<br><br>${this.emailOptions.html}`;

    const emailInfo: EmailOptions = {
      from: this.emailOptions.from,
      to: `${request.name.value}<${request.email.value}>`,
      subject: this.emailOptions.subject,
      text: this.emailOptions.text,
      html: customizedHTML,
      attachments: this.emailOptions.attachments,
    };

    const sendMail: Either<MailServiceError, EmailOptions> =
      await this.emailService.send(emailInfo);

    if (sendMail.isRight()) {
      this.loggerService.log(
        'log',
        `${SendEmailUseCase.name}: [${JSON.stringify(
          request
        )}] - Message sent to ${request.email.value}`
      );
    }

    return sendMail;
  }
}
