import { UserData } from '@/dtos/user-data';
import { RegisterUserAndSendEmailUseCase } from '@/usecases/register-user-and-send-email/register-user-and-send-email-use-case';
import { RegisterUserOnMailingListUseCase } from '@/usecases/register-user-on-mailing-list/register-user-on-mailing-list-use-case';
import { SendEmailUseCase } from '@/usecases/send-email/send-email-use-case';
import { UserRepository } from '@/usecases/register-user-on-mailing-list/ports/user-repository';
import { InMemoryUserRepository } from '@/usecases/register-user-on-mailing-list/repositories/in-memory-user-repository';
import { MailServiceMock } from '../../fixtures/mocks/mail-service-mock';
import { mailOptions } from '../../fixtures/stubs/email-options-stub';

describe('Register and send email to user use case', () => {
  let users: UserData[];
  let userRepository: UserRepository;
  let registerUserOnMailingListUseCase: RegisterUserOnMailingListUseCase;
  let registerUserAndSendEmailUseCase: RegisterUserAndSendEmailUseCase;
  let mailServiceMock: MailServiceMock;
  let sendEmailUseCase: SendEmailUseCase;

  beforeEach(() => {
    users = [];
    userRepository = new InMemoryUserRepository(users);
    registerUserOnMailingListUseCase = new RegisterUserOnMailingListUseCase(userRepository);
    mailServiceMock = new MailServiceMock();
    sendEmailUseCase = new SendEmailUseCase(mailOptions, mailServiceMock);
    registerUserAndSendEmailUseCase =
      new RegisterUserAndSendEmailUseCase(registerUserOnMailingListUseCase, sendEmailUseCase);
  })

  it('should add user with complete data to mailing list', async () => {
    const data = {
      name: 'John Doe',
      email: 'jonh_doe@email.com'
    };

    const response: UserData = (await registerUserAndSendEmailUseCase.perform({ ...data })).value as UserData;
        
    expect(response.name).toBe('John Doe');
    expect(mailServiceMock.timesSendWasCalled).toEqual(1);
  });

  it('should not register user and send him/her an email with invalid email', async () => {
    const data = {
      name: 'John Doe',
      email: 'jonh_doeemail.com'
    };

    const response = (await registerUserAndSendEmailUseCase.perform({ ...data })).value as Error;
    
    expect(response.name).toEqual('InvalidEmailError');
  })

  it('should not register user and send him/her an email with invalid name', async () => {
    const data = {
      name: 'a',
      email: 'jonh_doe@email.com'
    };

    const response = (await registerUserAndSendEmailUseCase.perform({ ...data })).value as Error;
    
    expect(response.name).toEqual('InvalidNameError');
  })
});
