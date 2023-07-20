import { InvalidEmailError } from '@/entities/errors/invalid-email-error';
import { InvalidNameError } from '@/entities/errors/invalid-name-error';
import { UserData } from '@/dtos/user-data';
import { UseCase } from '@/usecases/ports/use-case';
import { UserRepository } from '@/usecases/register-user-on-mailing-list/ports/user-repository';
import { RegisterUserOnMailingListUseCase } from '@/usecases/register-user-on-mailing-list/register-user-on-mailing-list-use-case';
import { MissingParamError } from '@/web-controllers/errors/missing-param-error';
import { HttpRequest } from '@/web-controllers/ports/http-request';
import { HttpResponse } from '@/web-controllers/ports/http-response';
import { RegisterUserAndSendEmailController } from '@/web-controllers/register-user-and-send-email-controller';
import { InMemoryUserRepository } from '@/usecases/register-user-on-mailing-list/repositories/in-memory-user-repository';
import { SendEmailUseCase } from '@/usecases/send-email/send-email-use-case';
import { RegisterUserAndSendEmailUseCase } from '@/usecases/register-user-and-send-email/register-user-and-send-email-use-case';
import { EmailOptions, EmailService } from '@/usecases/send-email/ports/email-service';
import { Either, right } from '@/shared/either';
import { MailServiceError } from '@/usecases/errors/mail-service-error';

describe('Register user web controller', () => {
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

  class ErrorThrowingUseCaseStub implements UseCase {
    perform(request: any): Promise<void> {
      throw Error();
    }
  }
    
  class MailServiceStub implements EmailService {
    async send (emailOptions: EmailOptions): Promise<Either<MailServiceError, EmailOptions>> {
      return right(emailOptions)
    }
  }
  
  const users: UserData[] = [];
  const userRepository: UserRepository = new InMemoryUserRepository(users);
  const registerUserOnMailingListUseCase: RegisterUserOnMailingListUseCase = new RegisterUserOnMailingListUseCase(userRepository);
  const mailServiceStub = new MailServiceStub();
  const sendEmailUseCase: SendEmailUseCase = new SendEmailUseCase(mailOptions, mailServiceStub)
  const registerUserAndSendEmailUseCase: RegisterUserAndSendEmailUseCase =
    new RegisterUserAndSendEmailUseCase(registerUserOnMailingListUseCase, sendEmailUseCase)
  const registerUserAndSendEmailController: RegisterUserAndSendEmailController = new RegisterUserAndSendEmailController(registerUserAndSendEmailUseCase)
  const errorThrowingUseCaseStub: UseCase = new ErrorThrowingUseCaseStub();

  it('should return status code 201 when request contains valid user data', async () => {
    const request: HttpRequest = {
      body: {
        name: 'John Doe',
        email: 'john_doe@email.com',
      },
    };

    const response: HttpResponse = await registerUserAndSendEmailController.handle(request);

    expect(response.statusCode).toEqual(201);
    expect(response.body).toEqual(request.body);
  });

  it('should return status code 400 when request contains invalid user name', async () => {
    const requestWithInvalidName: HttpRequest = {
      body: {
        name: 'A',
        email: 'john_doe@email.com',
      },
    };

    const response: HttpResponse = await registerUserAndSendEmailController.handle(
      requestWithInvalidName
    );

    expect(response.statusCode).toEqual(400);
    expect(response.body).toBeInstanceOf(InvalidNameError);
  });

  it('should return status code 400 when request contains invalid user email', async () => {
    const requestWithInvalidEmail: HttpRequest = {
      body: {
        name: 'John Doe',
        email: 'johnDoe.com',
      },
    };

    const response: HttpResponse = await registerUserAndSendEmailController.handle(
      requestWithInvalidEmail
    );

    expect(response.statusCode).toEqual(400);
    expect(response.body).toBeInstanceOf(InvalidEmailError);
  });

  it('should return status code 400 when request is missing user name', async () => {
    const requestMissingName: HttpRequest = {
      body: {
        email: 'john_doe@email.com',
      },
    };

    const response: HttpResponse = await registerUserAndSendEmailController.handle(requestMissingName);

    expect(response.statusCode).toEqual(400);
    expect(response.body).toBeInstanceOf(MissingParamError);
    expect((response.body as Error).message).toEqual(
      'Missing parameter from request: name.'
    );
  });

  it('should return status code 400 when request is missing user email', async () => {
    const requestMissingEmail: HttpRequest = {
      body: {
        name: 'John Doe',
      },
    };

    const response: HttpResponse = await registerUserAndSendEmailController.handle(requestMissingEmail);

    expect(response.statusCode).toEqual(400);
    expect(response.body).toBeInstanceOf(MissingParamError);
    expect((response.body as Error).message).toEqual(
      'Missing parameter from request: email.'
    );
  });

  it('should return status code 400 when request is missing user name and email', async () => {
    const requestMissingNameAndEmail: HttpRequest = {
      body: {},
    };

    const response: HttpResponse = await registerUserAndSendEmailController.handle(
      requestMissingNameAndEmail
    );

    expect(response.statusCode).toEqual(400);
    expect(response.body).toBeInstanceOf(MissingParamError);
    expect((response.body as Error).message).toEqual(
      'Missing parameter from request: name email.'
    );
  });

  it('should return status code 500 when server raises', async () => {
    const request: HttpRequest = {
      body: {
        name: 'John Doe',
        email: 'john_doe@email.com',
      },
    };

    const controller: RegisterUserAndSendEmailController = new RegisterUserAndSendEmailController(
      errorThrowingUseCaseStub
    );

    const response: HttpResponse = await controller.handle(
      request
    );

    expect(response.statusCode).toEqual(500);
    expect(response.body).toBeInstanceOf(Error);
  });
});
