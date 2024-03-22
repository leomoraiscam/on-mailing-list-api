import { UserData } from '@/dtos/user-data';
import { RegisterUserAndSendEmailUseCase } from '@/usecases/register-user-and-send-email/register-user-and-send-email-use-case';
import { RegisterUserUseCase } from '@/usecases/register-user/register-user-use-case';
import { InMemoryUserRepository } from '@/usecases/register-user/repositories/in-memory/in-memory-user-repository';
import { SendEmailUseCase } from '@/usecases/send-email/send-email-use-case';
import { MailServiceMock } from '@test/fixtures/mocks/mail-service-mock';
import { mailOptions } from '@test/fixtures/stubs/email-options-stub';
import { MailServiceErrorStub } from '@test/fixtures/stubs/mail-service-error-stub';

let inMemoryUserRepository: InMemoryUserRepository;
let registerUserUseCase: RegisterUserUseCase;
let sendEmailUseCase: SendEmailUseCase;
let registerUserAndSendEmailUseCase: RegisterUserAndSendEmailUseCase;
let mailServiceMock: MailServiceMock;
let mailServiceErrorStub: MailServiceErrorStub;
const mockLoggerService = {
  log: jest.fn(),
};

describe('Register and send email to user use case', () => {
  beforeEach(() => {
    inMemoryUserRepository = new InMemoryUserRepository();
    mailServiceMock = new MailServiceMock();
    mailServiceErrorStub = new MailServiceErrorStub();
    registerUserUseCase = new RegisterUserUseCase(
      inMemoryUserRepository,
      mockLoggerService
    );
    sendEmailUseCase = new SendEmailUseCase(
      mailOptions,
      mailServiceMock,
      mockLoggerService
    );
    registerUserAndSendEmailUseCase = new RegisterUserAndSendEmailUseCase(
      registerUserUseCase,
      sendEmailUseCase,
      mockLoggerService
    );
  });

  it('should add user with complete data to mailing list', async () => {
    const name = 'Herbert Larson';
    const email = 'riljo@pemjebdo.rs';

    const response: UserData = (
      await registerUserAndSendEmailUseCase.perform({ name, email })
    ).value as UserData;

    expect(response.name).toBe(name);
    expect(mailServiceMock.timesSendWasCalled).toEqual(1);
  });

  it('should not register user and send him/her an email with invalid email', async () => {
    const response = (
      await registerUserAndSendEmailUseCase.perform({
        name: 'Minerva Hudson',
        email: 'invalidEmail.com',
      })
    ).value as Error;

    expect(response.name).toEqual('InvalidEmailError');
  });

  it('should not register user and send him/her an email with invalid name', async () => {
    const response = (
      await registerUserAndSendEmailUseCase.perform({
        name: 'a',
        email: 'fok@ifaaje.kn',
      })
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
      registerUserUseCase,
      sendEmailUseCase,
      mockLoggerService
    );

    const result = await registerUserAndSendEmailUseCase.perform({
      name: 'Herbert Larson',
      email: 'riljo@pemjebdo.rs',
    });

    expect(mockLoggerService.log).toHaveBeenCalledTimes(2);
    expect(mockLoggerService.log).toHaveBeenCalledWith(
      'error',
      `${RegisterUserAndSendEmailUseCase.name}: [${JSON.stringify(
        result.value
      )}]`
    );
  });
});
