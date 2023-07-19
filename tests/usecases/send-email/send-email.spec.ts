/* eslint-disable max-classes-per-file */
import { User } from '@/entities/user';
import { Either, Right, left, right } from '@/shared/either';
import { MailServiceError } from '@/usecases/errors/mail-service-error';
import {
  EmailOptions,
  EmailService,
} from '@/usecases/send-email/ports/email-service';
import { SendEmail } from '@/usecases/send-email/send-email';

describe('Register and send email to user use case', () => {
  const attachmentFilePath = '../../../tmp/resources/text.txt';
  const fromName = 'Test';
  const fromEmail = 'from_mail@mail.com';
  const toName = 'anyName';
  const toEmail = 'any_email@mail.com';
  const subject = 'Test e-mail';
  const emailBody = 'Hello world attachment test';
  const emailBodyHTML = '<b>Hello world attachment test</b>';
  const attachment = [
    {
      filename: attachmentFilePath,
      contentType: 'text/plain',
    },
  ];

  const mailOptions: EmailOptions = {
    host: 'test',
    port: 867,
    username: 'test',
    password: 'test',
    from: `${fromName} ${fromEmail}`,
    to: `${toName}<${toEmail}>`,
    subject,
    text: emailBody,
    html: emailBodyHTML,
    attachments: attachment,
  };

  class MailServiceStub implements EmailService {
    // Como se fosse o envio de e-mail em memoria
    public timesSendWasCalled = 0;

    async send(
      emailOptions: EmailOptions
    ): Promise<Either<MailServiceError, EmailOptions>> {
      this.timesSendWasCalled += 1;

      return right(emailOptions);
    }
  }

  class MailServiceErrorStub implements EmailService {
    // Como se fosse o envio de e-mail em memoria, porem simulando o erro
    public timesSendWasCalled = 0;

    async send(
      emailOptions: EmailOptions
    ): Promise<Either<MailServiceError, EmailOptions>> {
      return left(new MailServiceError());
    }
  }

  it('should email user with valid name and email address', async () => {
    const mailServiceStub = new MailServiceStub();

    const sendEmailUseCase = new SendEmail(mailOptions, mailServiceStub);

    const user = User.create({ name: toName, email: toEmail }).value as User;

    const response = (await sendEmailUseCase.perform(user));
    const objectValueResponse = response.value as EmailOptions

    expect(objectValueResponse.to).toEqual(toName + '<' + toEmail + '>')
    expect(response).toBeInstanceOf(Right)
  });

  it('should return error when email service fails', async () => {
    const mailServiceErrorStub = new MailServiceErrorStub();

    const sendEmailUseCase = new SendEmail(mailOptions, mailServiceErrorStub);

    const user = User.create({ name: toName, email: toEmail }).value as User;

    const response = await sendEmailUseCase.perform(user);

    expect(response.value).toBeInstanceOf(MailServiceError);
  });
});
