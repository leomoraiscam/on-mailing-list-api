import { UserData } from '@/dtos/user-data';
import { InvalidEmailError } from '@/entities/errors/invalid-email-error';
import { InvalidNameError } from '@/entities/errors/invalid-name-error';
import { UseCase } from '@/usecases/ports/use-case';
import { RegisterUserAndSendEmailUseCase } from '@/usecases/register-user-and-send-email/register-user-and-send-email-use-case';
import { UserRepository } from '@/usecases/register-user-on-mailing-list/ports/user-repository';
import { RegisterUserOnMailingListUseCase } from '@/usecases/register-user-on-mailing-list/register-user-on-mailing-list-use-case';
import { InMemoryUserRepository } from '@/usecases/register-user-on-mailing-list/repositories/in-memory-user-repository';
import { SendEmailUseCase } from '@/usecases/send-email/send-email-use-case';
import { MissingParamError } from '@/web-controllers/errors/missing-param-error';
import { HttpRequest } from '@/web-controllers/ports/http-request';
import { HttpResponse } from '@/web-controllers/ports/http-response';
import { RegisterUserAndSendEmailController } from '@/web-controllers/register-user-and-send-email-controller';

import { mailOptions } from '../fixtures/stubs/email-options-stub';
import { ErrorThrowingUseCaseStub } from '../fixtures/stubs/error-throwing-stub';
import { MailServiceStub } from '../fixtures/stubs/mail-service-stub';

describe('Register user web controller', () => {
  let users: UserData[];
  let userRepository: UserRepository;
  let registerUserOnMailingListUseCase: RegisterUserOnMailingListUseCase;
  let mailServiceStub: MailServiceStub;
  let sendEmailUseCase: SendEmailUseCase;
  let registerUserAndSendEmailUseCase: RegisterUserAndSendEmailUseCase;
  let registerUserAndSendEmailController: RegisterUserAndSendEmailController;

  beforeEach(() => {
    users = [];
    userRepository = new InMemoryUserRepository(users);
    const loggerService = {
      log: jest.fn(),
    };
    registerUserOnMailingListUseCase = new RegisterUserOnMailingListUseCase(
      userRepository,
      loggerService
    );
    mailServiceStub = new MailServiceStub();
    sendEmailUseCase = new SendEmailUseCase(
      mailOptions,
      mailServiceStub,
      loggerService
    );
    registerUserAndSendEmailUseCase = new RegisterUserAndSendEmailUseCase(
      registerUserOnMailingListUseCase,
      sendEmailUseCase,
      loggerService
    );
    registerUserAndSendEmailController = new RegisterUserAndSendEmailController(
      registerUserAndSendEmailUseCase
    );
  });

  it('should return status code 201 when request contains valid user data', async () => {
    const request: HttpRequest<UserData> = {
      body: {
        name: 'John Doe',
        email: 'john_doe@email.com',
      },
    };

    const response: HttpResponse<UserData | Error> =
      await registerUserAndSendEmailController.handle(request);

    expect(response.statusCode).toEqual(201);
    expect(response.body).toEqual(request.body);
  });

  it('should return status code 400 when request contains invalid user name', async () => {
    const requestWithInvalidName: HttpRequest<UserData> = {
      body: {
        name: 'A',
        email: 'john_doe@email.com',
      },
    };

    const response: HttpResponse<UserData | Error> =
      await registerUserAndSendEmailController.handle(requestWithInvalidName);

    expect(response.statusCode).toEqual(400);
    expect(response.body).toBeInstanceOf(InvalidNameError);
  });

  it('should return status code 400 when request contains invalid user email', async () => {
    const requestWithInvalidEmail: HttpRequest<UserData> = {
      body: {
        name: 'John Doe',
        email: 'johnDoe.com',
      },
    };

    const response: HttpResponse<UserData | Error> =
      await registerUserAndSendEmailController.handle(requestWithInvalidEmail);

    expect(response.statusCode).toEqual(400);
    expect(response.body).toBeInstanceOf(InvalidEmailError);
  });

  it('should return status code 400 when request is missing user name', async () => {
    const requestMissingName: HttpRequest<Partial<UserData>> = {
      body: {
        email: 'john_doe@email.com',
      },
    };

    const response: HttpResponse<UserData | Error> =
      await registerUserAndSendEmailController.handle(requestMissingName);

    expect(response.statusCode).toEqual(400);
    expect(response.body).toBeInstanceOf(MissingParamError);
    expect((response.body as Error).message).toEqual(
      'Missing parameter from request: name.'
    );
  });

  it('should return status code 400 when request is missing user email', async () => {
    const requestMissingEmail: HttpRequest<Partial<UserData>> = {
      body: {
        name: 'John Doe',
      },
    };

    const response: HttpResponse<UserData | Error> =
      await registerUserAndSendEmailController.handle(requestMissingEmail);

    expect(response.statusCode).toEqual(400);
    expect(response.body).toBeInstanceOf(MissingParamError);
    expect((response.body as Error).message).toEqual(
      'Missing parameter from request: email.'
    );
  });

  it('should return status code 400 when request is missing user name and email', async () => {
    const requestMissingNameAndEmail: HttpRequest<Partial<UserData>> = {
      body: {},
    };

    const response: HttpResponse<Partial<UserData> | Error> =
      await registerUserAndSendEmailController.handle(
        requestMissingNameAndEmail
      );

    expect(response.statusCode).toEqual(400);
    expect(response.body).toBeInstanceOf(MissingParamError);
    expect((response.body as Error).message).toEqual(
      'Missing parameter from request: name email.'
    );
  });

  it('should return status code 500 when server raises', async () => {
    const errorThrowingUseCaseStub: UseCase = new ErrorThrowingUseCaseStub();

    const request: HttpRequest<UserData> = {
      body: {
        name: 'John Doe',
        email: 'john_doe@email.com',
      },
    };

    const controller: RegisterUserAndSendEmailController =
      new RegisterUserAndSendEmailController(errorThrowingUseCaseStub);

    const response: HttpResponse<UserData | Error> = await controller.handle(
      request
    );

    expect(response.statusCode).toEqual(500);
    expect(response.body).toBeInstanceOf(Error);
  });
});
