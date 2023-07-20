import { UserData } from '@/dtos/user-data';
import { Either, right } from '@/shared/either';
import { MailServiceError } from '@/usecases/errors/mail-service-error';
import { RegisterUserAndSendEmailUseCase } from '@/usecases/register-user-and-send-email/register-user-and-send-email-use-case';
import { RegisterUserOnMailingListUseCase } from '@/usecases/register-user-on-mailing-list/register-user-on-mailing-list-use-case';
import {
  EmailOptions,
  EmailService,
} from '@/usecases/send-email/ports/email-service';
import { SendEmailUseCase } from '@/usecases/send-email/send-email-use-case';
import { UserRepository } from '@/usecases/register-user-on-mailing-list/ports/user-repository';
import { InMemoryUserRepository } from '@/usecases/register-user-on-mailing-list/repositories/in-memory-user-repository';

describe('Register and send email to user use case', () => {
  const attachmentFilePath = '../resources/text.txt';
  const fromName = 'MailingList';
  const fromEmail = 'mainling_list_contact@mail.com';
  const toName = 'John Doe';
  const toEmail = 'jonh_doe@mail.com';
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
    host: 'localhost',
    port: 8671,
    username: 'fakeMailConfiguration',
    password: '123456',
    from: fromName + ' ' + fromEmail,
    to: toName + '<' + toEmail + '>',
    subject: subject,
    text: emailBody,
    html: emailBodyHTML,
    attachments: attachment
  }

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
    const users: UserData[] = [];
    const userRepository: UserRepository = new InMemoryUserRepository(users);
    const registerUserOnMailingListUseCase: RegisterUserOnMailingListUseCase = new RegisterUserOnMailingListUseCase(userRepository);
    const mailServiceMock = new MailServiceMock();
    const sendEmailUseCase: SendEmailUseCase = new SendEmailUseCase(mailOptions, mailServiceMock);
    const registerUserAndSendEmailUseCase: RegisterUserAndSendEmailUseCase =
      new RegisterUserAndSendEmailUseCase(registerUserOnMailingListUseCase, sendEmailUseCase);
    
    const data = {
      name: 'John Doe',
      email: 'jonh_doe@email.com'
    };

    const response: UserData = (await registerUserAndSendEmailUseCase.perform({ ...data })).value as UserData;
        
    expect(response.name).toBe('John Doe');
    expect(mailServiceMock.timesSendWasCalled).toEqual(1);
  });

  it('should not register user and send him/her an email with invalid email', async () => {
    const users: UserData[] = [];
    const userRepository: UserRepository = new InMemoryUserRepository(users);
    const registerUserOnMailingListUseCase: RegisterUserOnMailingListUseCase = new RegisterUserOnMailingListUseCase(userRepository);
    const mailServiceMock = new MailServiceMock();
    const sendEmailUseCase: SendEmailUseCase = new SendEmailUseCase(mailOptions, mailServiceMock);
    const registerUserAndSendEmailUseCase: RegisterUserAndSendEmailUseCase =
      new RegisterUserAndSendEmailUseCase(registerUserOnMailingListUseCase, sendEmailUseCase);
    
    const data = {
      name: 'John Doe',
      email: 'jonh_doeemail.com'
    };

    const response = (await registerUserAndSendEmailUseCase.perform({ ...data })).value as Error;
    
    expect(response.name).toEqual('InvalidEmailError');
  })

  it('should not register user and send him/her an email with invalid name', async () => {
    const users: UserData[] = [];
    const userRepository: UserRepository = new InMemoryUserRepository(users);
    const registerUserOnMailingListUseCase: RegisterUserOnMailingListUseCase = new RegisterUserOnMailingListUseCase(userRepository);
    const mailServiceMock = new MailServiceMock();
    const sendEmailUseCase: SendEmailUseCase = new SendEmailUseCase(mailOptions, mailServiceMock);
    const registerUserAndSendEmailUseCase: RegisterUserAndSendEmailUseCase =
      new RegisterUserAndSendEmailUseCase(registerUserOnMailingListUseCase, sendEmailUseCase);
    
    const data = {
      name: 'a',
      email: 'jonh_doe@email.com'
    };

    const response = (await registerUserAndSendEmailUseCase.perform({ ...data })).value as Error;
    
    expect(response.name).toEqual('InvalidNameError');
  })
});
