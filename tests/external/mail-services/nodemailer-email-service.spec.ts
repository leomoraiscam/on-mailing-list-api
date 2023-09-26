/* eslint-disable @typescript-eslint/no-var-requires */
import { NodemailerEmailService } from '@/external/mail-services/nodemailer-email-service';
import { MailServiceError } from '@/usecases/errors/mail-service-error';

import { mailOptions } from '../../fixtures/stubs/email-options-stub';

jest.mock('nodemailer');

const nodemailer = require('nodemailer');

const sendMailMock = jest.fn().mockReturnValueOnce('ok');
let nodemailerEmailService: NodemailerEmailService;

nodemailer.createTransport.mockReturnValue({ sendMail: sendMailMock });

describe('Nodemailer mail service adapter', () => {
  beforeEach(() => {
    const loggerService = {
      log: jest.fn(),
    };

    nodemailerEmailService = new NodemailerEmailService(loggerService);

    sendMailMock.mockClear();
    nodemailer.createTransport.mockClear();
  });

  it('should return ok if email is sent', async () => {
    const result = await nodemailerEmailService.send(mailOptions);

    expect(result.value).toEqual(mailOptions);
  });

  it.skip('should call nodemailer createTransport with correct options', async () => {
    const spyCreateTransport = jest.spyOn(nodemailer, 'createTransport');

    await nodemailerEmailService.send(mailOptions);

    expect(spyCreateTransport).toHaveBeenCalledWith({
      host: 'localhost',
      port: 8671,
      auth: {
        user: 'fakeMailConfiguration',
        pass: '123456',
      },
    });
  });

  it('should return error if email is not sent', async () => {
    sendMailMock.mockImplementationOnce(() => {
      throw new Error();
    });

    const result = await nodemailerEmailService.send(mailOptions);
    expect(result.value).toBeInstanceOf(MailServiceError);
  });
});
