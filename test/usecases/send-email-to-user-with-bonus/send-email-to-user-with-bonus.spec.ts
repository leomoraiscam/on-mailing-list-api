import { EmailOptions } from '@/dtos/email-options';
import { Right } from '@/shared/either';
import { MailServiceError } from '@/usecases/errors/mail-service-error';
import { SendEmailToUserWithBonus } from '@/usecases/send-email-to-user-with-bonus/send-email-to-user-with-bonus';
import { mailOptions, emailData } from '@test/doubles/stubs/email-options-stub';
import { MailServiceErrorStub } from '@test/doubles/stubs/mail-service-error-stub';
import { MailServiceStub } from '@test/doubles/stubs/mail-service-stub';

describe('SendEmailToUserWithBonusUseCase', () => {
  const mockLoggerService = {
    log: jest.fn(),
  };

  it('should be able send email when received valid name and email address', async () => {
    const mailServiceStub = new MailServiceStub();
    const sendEmailToUserWithBonus = new SendEmailToUserWithBonus(
      mailOptions,
      mailServiceStub,
      mockLoggerService
    );

    const response = await sendEmailToUserWithBonus.perform({
      name: emailData.toName,
      email: emailData.toEmail,
    });

    const objectValueResponse = response.value as EmailOptions;

    expect(objectValueResponse.to).toEqual(
      `${emailData.toName}<${emailData.toEmail}>`
    );
    expect(response).toBeInstanceOf(Right);
  });

  it('should be able return error when email service fails', async () => {
    const mailServiceErrorStub = new MailServiceErrorStub();
    const sendEmailUseCase = new SendEmailToUserWithBonus(
      mailOptions,
      mailServiceErrorStub,
      mockLoggerService
    );

    const response = await sendEmailUseCase.perform({
      name: emailData.toName,
      email: emailData.toEmail,
    });

    expect(response.value).toBeInstanceOf(MailServiceError);
  });
});
