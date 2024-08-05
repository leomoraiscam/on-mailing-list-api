import { NodemailerEmailService } from '@/external/mail-services/nodemailer-email-service';
import { MailServiceError } from '@/usecases/errors/mail-service-error';
import { mailOptions } from '@test/doubles/stubs/email-options-stub';

const mockSendMail = jest.fn();
const mockLoggerService = {
  log: jest.fn(),
};

jest.mock('nodemailer', () => ({
  createTransport: jest.fn(() => ({
    sendMail: mockSendMail,
  })),
}));

let nodemailerEmailService: NodemailerEmailService;

describe('Nodemailer mail service external adapter', () => {
  beforeEach(() => {
    nodemailerEmailService = new NodemailerEmailService(mockLoggerService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should return ok if email is sent', async () => {
    mockSendMail.mockResolvedValue('ok');

    const result = await nodemailerEmailService.send(mailOptions);

    expect(mockSendMail).toBeCalledWith(mailOptions);
    expect(mockSendMail).toBeCalledTimes(1);
    expect(result.value).toEqual(mailOptions);
  });

  it('should return error if email is not sent', async () => {
    mockSendMail.mockImplementationOnce(() => {
      throw new Error();
    });

    const result = await nodemailerEmailService.send(mailOptions);

    expect(result.value).toBeInstanceOf(MailServiceError);
  });
});
