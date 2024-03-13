import { EmailOptions } from '@/dtos/email-options';
import { User } from '@/entities/user/user';
import { Right } from '@/shared/either';
import { MailServiceError } from '@/usecases/errors/mail-service-error';
import { SendEmailUseCase } from '@/usecases/send-email/send-email-use-case';
import {
  mailOptions,
  emailData,
} from '@test/fixtures/stubs/email-options-stub';
import { MailServiceErrorStub } from '@test/fixtures/stubs/mail-service-error-stub';
import { MailServiceStub } from '@test/fixtures/stubs/mail-service-stub';

const mockLoggerService = {
  log: jest.fn(),
};

describe('Send email Use Case', () => {
  it('should be able send email when received valid name and email address', async () => {
    const mailServiceStub = new MailServiceStub();

    const sendEmailUseCase = new SendEmailUseCase(
      mailOptions,
      mailServiceStub,
      mockLoggerService
    );

    const user = User.create({
      name: emailData.toName,
      email: emailData.toEmail,
    }).value as User;

    const response = await sendEmailUseCase.perform(user);

    const objectValueResponse = response.value as EmailOptions;

    expect(objectValueResponse.to).toEqual(
      `${emailData.toName}<${emailData.toEmail}>`
    );
    expect(response).toBeInstanceOf(Right);
  });

  it('should be able return error when email service fails', async () => {
    const mailServiceErrorStub = new MailServiceErrorStub();
    const sendEmailUseCase = new SendEmailUseCase(
      mailOptions,
      mailServiceErrorStub,
      mockLoggerService
    );

    const user = User.create({
      name: emailData.toName,
      email: emailData.toEmail,
    }).value as User;

    const response = await sendEmailUseCase.perform(user);

    expect(response.value).toBeInstanceOf(MailServiceError);
  });
});
