import { UserData } from '@/dtos/user-data';
import { InMemoryUserRepository } from '@/external/repositories/mongodb/in-memory-user-repository';
import { UserRepository } from '@/external/repositories/mongodb/ports/user-repository';
import { RegisterUserAndSendEmailUseCase } from '@/usecases/register-user-and-send-email/register-user-and-send-email-use-case';
import { RegisterUserOnMailingListUseCase } from '@/usecases/register-user/register-user-on-mailing-list-use-case';
import { SendEmailUseCase } from '@/usecases/send-email/send-email-use-case';
import { MailServiceMock } from '@test/fixtures/mocks/mail-service-mock';
import { mailOptions } from '@test/fixtures/stubs/email-options-stub';
import { MailServiceErrorStub } from '@test/fixtures/stubs/mail-service-error-stub';

let users: UserData[];
let userRepository: UserRepository;
let registerUserOnMailingListUseCase: RegisterUserOnMailingListUseCase;
let registerUserAndSendEmailUseCase: RegisterUserAndSendEmailUseCase;
let mailServiceMock: MailServiceMock;
let mailServiceErrorStub: MailServiceErrorStub;
let sendEmailUseCase: SendEmailUseCase;
const mockLoggerService = {
  log: jest.fn(),
};

describe('Register and send email to user use case', () => {
  beforeEach(() => {
    users = [];
    userRepository = new InMemoryUserRepository(users);
    registerUserOnMailingListUseCase = new RegisterUserOnMailingListUseCase(
      userRepository,
      mockLoggerService
    );
    mailServiceMock = new MailServiceMock();
    mailServiceErrorStub = new MailServiceErrorStub();
    sendEmailUseCase = new SendEmailUseCase(
      mailOptions,
      mailServiceMock,
      mockLoggerService
    );
    registerUserAndSendEmailUseCase = new RegisterUserAndSendEmailUseCase(
      registerUserOnMailingListUseCase,
      sendEmailUseCase,
      mockLoggerService
    );
  });

  it('should add user with complete data to mailing list', async () => {
    const data = {
      name: 'Herbert Larson',
      email: 'riljo@pemjebdo.rs',
    };

    const response: UserData = (
      await registerUserAndSendEmailUseCase.perform({ ...data })
    ).value as UserData;

    expect(response.name).toBe('Herbert Larson');
    expect(mailServiceMock.timesSendWasCalled).toEqual(1);
  });

  it('should not register user and send him/her an email with invalid email', async () => {
    const data = {
      name: 'Minerva Hudson',
      email: 'invalidEmail.com',
    };

    const response = (
      await registerUserAndSendEmailUseCase.perform({ ...data })
    ).value as Error;

    expect(response.name).toEqual('InvalidEmailError');
  });

  it('should not register user and send him/her an email with invalid name', async () => {
    const data = {
      name: 'a',
      email: 'fok@ifaaje.kn',
    };

    const response = (
      await registerUserAndSendEmailUseCase.perform({ ...data })
    ).value as Error;

    expect(response.name).toEqual('InvalidNameError');
  });

  it('should not be able to add and send email when send mail fails', async () => {
    sendEmailUseCase = new SendEmailUseCase(
      mailOptions,
      mailServiceErrorStub,
      mockLoggerService
    );
    registerUserAndSendEmailUseCase = new RegisterUserAndSendEmailUseCase(
      registerUserOnMailingListUseCase,
      sendEmailUseCase,
      mockLoggerService
    );

    const data = {
      name: 'Herbert Larson',
      email: 'riljo@pemjebdo.rs',
    };

    const result = await registerUserAndSendEmailUseCase.perform({ ...data });

    expect(mockLoggerService.log).toHaveBeenCalledTimes(2);
    expect(mockLoggerService.log).toHaveBeenCalledWith(
      'error',
      `${RegisterUserAndSendEmailUseCase.name} [${JSON.stringify(
        result.value
      )}]`
    );
  });
});
