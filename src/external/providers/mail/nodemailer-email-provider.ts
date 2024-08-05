import * as nodemailer from 'nodemailer';

import { EmailOptions } from '@/dtos/email-options';
import { Either, left, right } from '@/shared/either';
import { MailServiceError } from '@/usecases/errors/mail-service-error';
import { LoggerProvider } from '@/usecases/ports/providers/logger/logger-provider';
import { EmailProvider } from '@/usecases/ports/providers/mail/mail-provider';

export class NodemailerEmailProvider implements EmailProvider {
  private readonly loggerService: LoggerProvider;

  constructor(loggerService: LoggerProvider) {
    this.loggerService = loggerService;
  }

  async send(
    options: EmailOptions
  ): Promise<Either<MailServiceError, EmailOptions>> {
    try {
      const transporter = nodemailer.createTransport({
        host: process.env.MAILTRAP_HOST,
        port: Number(process.env.MAILTRAP_PORT),
        auth: {
          user: process.env.MAILTRAP_USER,
          pass: process.env.MAILTRAP_PASSWORD,
        },
      });

      const info = await transporter.sendMail({
        from: options.from,
        to: options.to,
        subject: options.subject,
        text: options.text,
        html: options.html,
        attachments: options.attachments,
      });

      this.loggerService.log(
        'log',
        `[${NodemailerEmailProvider.name}]: Message sent to ${options.to}`,
        {
          messageId: info.messageId,
        }
      );
    } catch (error) {
      this.loggerService.log(
        'error',
        `[${NodemailerEmailProvider.name}]: Message sent failed - ${error.message}`,
        {
          messageId: JSON.stringify(error),
        }
      );

      return left(new MailServiceError());
    }

    return right(options);
  }
}
