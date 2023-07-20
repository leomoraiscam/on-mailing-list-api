import { EmailOptions } from '@/usecases/send-email/ports/email-service'
import { NodemailerEmailService } from '@/external/mail-services/nodemailer-email-service'
import { MailServiceError } from '@/usecases/errors/mail-service-error'

const attachmentFilePath = '../resources/text.txt';
const fromName = 'MailingList';
const fromEmail = 'mainling_list_contact@mail.com';
const toName = 'John Doe';
const toEmail = 'jonh_doe@mail.com';
const subject = 'Test e-mail';
const emailBody = 'Hello world attachment test';
const emailBodyHtml = '<b>Hello world attachment test</b>';
const attachment = [{
  filename: attachmentFilePath,
  contentType: 'text/plain'
}];

const mailOptions: EmailOptions = {
  host: 'localhost',
  port: 8671,
  username: 'fakeMailConfiguration',
  password: '123456',
  from: fromName + ' ' + fromEmail,
  to: toName + '<' + toEmail + '>',
  subject: subject,
  text: emailBody,
  html: emailBodyHtml,
  attachments: attachment
}

jest.mock('nodemailer');

const nodemailer = require('nodemailer');
const sendMailMock = jest.fn().mockReturnValueOnce('ok');

nodemailer.createTransport.mockReturnValue({ sendMail: sendMailMock });

describe('Nodemailer mail service adapter', () => {
  beforeEach(() => {
    sendMailMock.mockClear()
    nodemailer.createTransport.mockClear()
  })

  it('should return ok if email is sent', async () => {
    const nodemailer = new NodemailerEmailService();
    const result = await nodemailer.send(mailOptions);

    expect(result.value).toEqual(mailOptions)
  })

  it('should return error if email is not sent', async () => {
    const nodemailer = new NodemailerEmailService()
    
    sendMailMock.mockImplementationOnce(() => {
      throw new Error()
    })
    
    const result = await nodemailer.send(mailOptions)
    expect(result.value).toBeInstanceOf(MailServiceError)
  })
})