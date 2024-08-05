import { EmailOptions } from '@/dtos/email-options';
import { UserData } from '@/dtos/user-data';
import { InvalidEmailError } from '@/entities/user/errors/invalid-email-error';
import { InvalidNameError } from '@/entities/user/errors/invalid-name-error';
import { User } from '@/entities/user/user';
import { Either, left, right } from '@/shared/either';
import { LoggerProvider } from '@/usecases/ports/providers/logger/logger-provider';
import { EmailProvider } from '@/usecases/ports/providers/mail/mail-provider';

import { MailServiceError } from '../errors/mail-service-error';
import { UseCase } from '../ports/services/use-case';

export class SendEmailToUserWithBonus
  implements UseCase<UserData, Either<MailServiceError, EmailOptions>>
{
  private readonly emailOptions: EmailOptions;
  private readonly emailService: EmailProvider;
  private readonly loggerService: LoggerProvider;

  constructor(
    emailOptions: EmailOptions,
    emailService: EmailProvider,
    loggerService: LoggerProvider
  ) {
    this.emailOptions = emailOptions;
    this.emailService = emailService;
    this.loggerService = loggerService;
  }

  async perform(
    request: UserData
  ): Promise<Either<MailServiceError, EmailOptions>> {
    const userOrError: Either<InvalidNameError | InvalidEmailError, User> =
      User.create(request);

    if (userOrError.isLeft()) {
      return left(userOrError.value);
    }

    const user = userOrError.value as User;
    const greetings = `E ai <b>${user.name.value}</b>, beleza ?`;
    const customizedHTML = `${greetings}<br><br>${this.emailOptions.html}`;
    const emailInfo: EmailOptions = {
      from: this.emailOptions.from,
      to: `${user.name.value}<${user.email.value}>`,
      subject: this.emailOptions.subject,
      text: this.emailOptions.text,
      html: customizedHTML,
      attachments: this.emailOptions.attachments,
    };

    const sendMail: Either<MailServiceError, EmailOptions> =
      await this.emailService.send(emailInfo);

    if (sendMail.isLeft()) {
      return left(new MailServiceError());
    }

    if (sendMail.isRight()) {
      this.loggerService.log(
        'log',
        `${SendEmailToUserWithBonus.name}: [${JSON.stringify(
          request
        )}] - Message sent to ${user.email.value}`
      );
    }

    return right(sendMail.value);
  }
}
