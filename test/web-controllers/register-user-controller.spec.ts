import { UserData } from '@/dtos/user-data';
import { RegisterUser } from '@/usecases/register-user/register-user';
import { SendEmailToUserWithBonus } from '@/usecases/send-email-to-user-with-bonus/send-email-to-user-with-bonus';
import { ControllerError } from '@/web-controllers/errors/controller-error';
import { HttpRequest } from '@/web-controllers/ports/http-request';
import { HttpResponse } from '@/web-controllers/ports/http-response';
import { RegisterUserController } from '@/web-controllers/register-user-controller';
import { InMemoryUserRepository } from '@test/doubles/repositories/in-memory-user-repository';
import { mailOptions } from '@test/doubles/stubs/email-options-stub';
import { MailServiceStub } from '@test/doubles/stubs/mail-service-stub';

let inMemoryUserRepository: InMemoryUserRepository;
let registerUser: RegisterUser;
let sendEmailToUserWithBonus: SendEmailToUserWithBonus;
let registerUserController: RegisterUserController;
let mailServiceStub: MailServiceStub;
const mockLoggerService = {
  log: jest.fn(),
};

describe('Register user web controller', () => {
  beforeEach(() => {
    mailServiceStub = new MailServiceStub();
    inMemoryUserRepository = new InMemoryUserRepository();
    registerUser = new RegisterUser(inMemoryUserRepository, mockLoggerService);
    sendEmailToUserWithBonus = new SendEmailToUserWithBonus(
      mailOptions,
      mailServiceStub,
      mockLoggerService
    );
    registerUserController = new RegisterUserController(
      registerUser,
      sendEmailToUserWithBonus
    );
  });

  it('should return status code 201 when request contains valid user data', async () => {
    const request: HttpRequest<UserData> = {
      body: {
        name: 'Evan Nelson',
        email: 'zarmuov@etedo.vn',
      },
    };

    const response: HttpResponse<UserData | ControllerError> =
      await registerUserController.handle(request);

    expect(response.statusCode).toEqual(201);
    expect(response.body).toEqual(request.body);
  });

  it('should return status code 400 when request contains invalid user name', async () => {
    const requestWithInvalidName: HttpRequest<UserData> = {
      body: {
        name: 'A',
        email: 'wo@luhe.mr',
      },
    };

    const response: HttpResponse<UserData | ControllerError> =
      await registerUserController.handle(requestWithInvalidName);

    expect(response.statusCode).toEqual(400);
    expect(response.body.name).toEqual('InvalidNameError');
  });

  it('should return status code 400 when request contains invalid user email', async () => {
    const requestWithInvalidEmail: HttpRequest<UserData> = {
      body: {
        name: 'Cornelia Pena',
        email: 'wrongEmail.com',
      },
    };

    const response: HttpResponse<UserData | ControllerError> =
      await registerUserController.handle(requestWithInvalidEmail);

    expect(response.statusCode).toEqual(400);
    expect(response.body.name).toEqual('InvalidEmailError');
  });

  it('should return status code 400 when request is missing user name', async () => {
    const requestMissingName: HttpRequest<Partial<UserData>> = {
      body: {
        email: 'mo@ebe.cf',
      },
    };

    const response: HttpResponse<UserData | ControllerError> =
      await registerUserController.handle(requestMissingName);

    expect(response.statusCode).toEqual(400);
    expect(response.body.name).toEqual('MissingParamError');
    expect((response.body as ControllerError).message).toEqual(
      'Missing "name" parameter from request.'
    );
  });

  it('should return status code 400 when request is missing user email', async () => {
    const requestMissingEmail: HttpRequest<Partial<UserData>> = {
      body: {
        name: 'Leo Abbott',
      },
    };

    const response: HttpResponse<UserData | ControllerError> =
      await registerUserController.handle(requestMissingEmail);

    expect(response.statusCode).toEqual(400);
    expect(response.body.name).toEqual('MissingParamError');
    expect((response.body as ControllerError).message).toEqual(
      'Missing "email" parameter from request.'
    );
  });

  it('should return status code 400 when request is missing user name and email', async () => {
    const requestMissingNameAndEmail: HttpRequest<Partial<UserData>> = {
      body: {},
    };

    const response: HttpResponse<Partial<UserData> | ControllerError> =
      await registerUserController.handle(requestMissingNameAndEmail);

    expect(response.statusCode).toEqual(400);
    expect(response.body.name).toEqual('MissingParamError');
    expect((response.body as ControllerError).message).toEqual(
      'Missing "name" parameter from request.'
    );
  });

  it('should return status code 500 when server raises', async () => {
    const request: HttpRequest<UserData> = {
      body: {
        name: 'Bradley May',
        email: 'za@lisop.gs',
      },
    };

    const errorThrowingRegisterUserUseCaseStub = jest
      .spyOn(registerUser, 'perform')
      .mockImplementationOnce(() => {
        throw Error();
      }) as any;
    const errorThrowingSendEmailToUserWithBonusUseCaseStub = jest
      .spyOn(sendEmailToUserWithBonus, 'perform')
      .mockImplementationOnce(() => {
        throw Error();
      }) as any;

    const controller = new RegisterUserController(
      errorThrowingRegisterUserUseCaseStub,
      errorThrowingSendEmailToUserWithBonusUseCaseStub
    );

    const response: HttpResponse<UserData | ControllerError> =
      await controller.handle(request);

    expect(response.statusCode).toEqual(500);
    expect(response.body.name).toEqual('TypeError');
  });
});
