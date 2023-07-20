import { UserData } from '@/dtos/user-data';
import { Either, right } from '@/shared/either';
import { MailServiceError } from '@/usecases/errors/mail-service-error';
import { RegisterUserAndSendEmailUseCase } from '@/usecases/register-user-and-send-email/register-user-and-send-email';
import { RegisterUserOnMailingList } from '@/usecases/register-user-on-mailing-list/register-user-on-mailing-list';
import {
  EmailOptions,
  EmailService,
} from '@/usecases/send-email/ports/email-service';
import { SendEmail } from '@/usecases/send-email/send-email';
import { UserRepository } from '@/usecases/register-user-on-mailing-list/ports/user-repository';
import { InMemoryUserRepository } from '@/usecases/register-user-on-mailing-list/repositories/in-memory-user-repository';

describe('Register and send email to user use case', () => {
  const attachmentFilePath = '../resources/text.txt';
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

  class MailServiceMock implements EmailService {
    public timesSendWasCalled = 0;

    async send(
      emailOptions: EmailOptions
    ): Promise<Either<MailServiceError, EmailOptions>> {
      this.timesSendWasCalled += 1;

      return right(emailOptions);
    }
  }

  it('should add user with complete data to mailing list', async () => {
    const users: UserData[] = []
    const repo: UserRepository = new InMemoryUserRepository(users)
    const registerUseCase: RegisterUserOnMailingList = new RegisterUserOnMailingList(repo)
    const mailServiceMock = new MailServiceMock()
    const sendEmailUseCase: SendEmail = new SendEmail(mailOptions, mailServiceMock)
    const registerAndSendEmailUseCase: RegisterUserAndSendEmailUseCase =
      new RegisterUserAndSendEmailUseCase(registerUseCase, sendEmailUseCase)
    
    const name = 'any_name'
    const email = 'any@email.com'
    
    const response: UserData = (await registerAndSendEmailUseCase.perform({ name, email })).value as UserData
        
    expect(response.name).toBe('any_name')
    expect(mailServiceMock.timesSendWasCalled).toEqual(1)
  });

  it('should not register user and send him/her an email with invalid email', async () => {
    const users: UserData[] = []
    const repo: UserRepository = new InMemoryUserRepository(users)
    const registerUseCase: RegisterUserOnMailingList = new RegisterUserOnMailingList(repo)
    const mailServiceMock = new MailServiceMock()
    const sendEmailUseCase: SendEmail = new SendEmail(mailOptions, mailServiceMock)
    const registerAndSendEmailUseCase: RegisterUserAndSendEmailUseCase =
      new RegisterUserAndSendEmailUseCase(registerUseCase, sendEmailUseCase)
    
    const name = 'any_name'
    const invalidEmail = 'invalid_email'

    const response = (await registerAndSendEmailUseCase.perform({ name: name, email: invalidEmail })).value as Error
    
    expect(response.name).toEqual('InvalidEmailError')
  })

  it('should not register user and send him/her an email with invalid name', async () => {
    const users: UserData[] = []
    const repo: UserRepository = new InMemoryUserRepository(users)
    const registerUseCase: RegisterUserOnMailingList = new RegisterUserOnMailingList(repo)
    const mailServiceMock = new MailServiceMock()
    const sendEmailUseCase: SendEmail = new SendEmail(mailOptions, mailServiceMock)
    const registerAndSendEmailUseCase: RegisterUserAndSendEmailUseCase =
      new RegisterUserAndSendEmailUseCase(registerUseCase, sendEmailUseCase)
    
    const invalidName = 'a'
    const email = 'any@mail.com'

    const response = (await registerAndSendEmailUseCase.perform({ name: invalidName, email: email })).value as Error
    
    expect(response.name).toEqual('InvalidNameError')
  })
});
