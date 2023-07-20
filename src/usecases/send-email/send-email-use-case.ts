import { User } from '@/entities/user';
import { Either } from '@/shared/either';
import { MailServiceError } from '../errors/mail-service-error';
import { UseCase } from '../ports/use-case';
import { EmailOptions, EmailService } from './ports/email-service';

export class SendEmailUseCase implements UseCase {
  private readonly emailOptions: EmailOptions;
  private readonly emailService: EmailService;

  constructor(emailOptions: EmailOptions, emailService: EmailService) {
    this.emailOptions = emailOptions;
    this.emailService = emailService;
  }

  async perform(
    request: User
  ): Promise<
    Either<
      MailServiceError,
      EmailOptions
    >
  > {
    const greetings = `E ai <b>${request.name}</b>, beleza ?`;
    const customizedHTML = `${greetings}<br><br>${this.emailOptions.html}`;

    const emailInfo: EmailOptions = {
      host: this.emailOptions.host,
      port: this.emailOptions.port,
      username: this.emailOptions.username,
      password: this.emailOptions.password,
      from: this.emailOptions.from,
      to: `${request.name.value}<${request.email.value}>`,
      subject: this.emailOptions.subject,
      text: this.emailOptions.text,
      html: customizedHTML,
      attachments: this.emailOptions.attachments,
    };

    return this.emailService.send(emailInfo);
  }
}
