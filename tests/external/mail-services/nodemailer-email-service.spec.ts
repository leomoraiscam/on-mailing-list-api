import { NodemailerEmailService } from '@/external/mail-services/nodemailer-email-service';
import { MailServiceError } from '@/usecases/errors/mail-service-error';

import { mailOptions } from '../../fixtures/stubs/email-options-stub';

jest.mock('nodemailer');

const nodemailer = require('nodemailer');

const sendMailMock = jest.fn().mockReturnValueOnce('ok');

nodemailer.createTransport.mockReturnValue({ sendMail: sendMailMock });

describe('Nodemailer mail service adapter', () => {
  beforeEach(() => {
    sendMailMock.mockClear();
    nodemailer.createTransport.mockClear();
  });

  it('should return ok if email is sent', async () => {
    const loggerService = {
      log: jest.fn(),
    };
    const nodemailer = new NodemailerEmailService(loggerService);

    const result = await nodemailer.send(mailOptions);

    expect(result.value).toEqual(mailOptions);
  });

  it('should return error if email is not sent', async () => {
    const loggerService = {
      log: jest.fn(),
    };
    const nodemailer = new NodemailerEmailService(loggerService);

    sendMailMock.mockImplementationOnce(() => {
      throw new Error();
    });

    const result = await nodemailer.send(mailOptions);
    expect(result.value).toBeInstanceOf(MailServiceError);
  });
});
