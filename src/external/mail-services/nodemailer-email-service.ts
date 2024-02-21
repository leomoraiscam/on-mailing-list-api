import * as nodemailer from 'nodemailer';

import { EmailOptions } from '@/dtos/email-options';
import { EmailService } from '@/external/mail-services/ports/email-service';
import { Either, left, right } from '@/shared/either';
import { MailServiceError } from '@/usecases/errors/mail-service-error';

import { LoggerService } from '../logger-services/ports/logger-service';

export class NodemailerEmailService implements EmailService {
  private readonly loggerService: LoggerService;

  constructor(loggerService: LoggerService) {
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
        `[${NodemailerEmailService.name}] - Message sent`,
        {
          messageId: info.messageId,
        }
      );
    } catch (error) {
      this.loggerService.log(
        'error',
        `[${NodemailerEmailService.name}] - Message sent failed`,
        {
          messageId: JSON.stringify(error),
        }
      );

      return left(new MailServiceError());
    }

    return right(options);
  }
}
