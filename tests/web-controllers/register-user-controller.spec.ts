import { InvalidEmailError } from '@/entities/errors/invalid-email-error';
import { InvalidNameError } from '@/entities/errors/invalid-name-error';
import { UserData } from '@/dtos/user-data';
import { UseCase } from '@/usecases/ports/use-case';
import { UserRepository } from '@/usecases/register-user-on-mailing-list/ports/user-repository';
import { RegisterUserOnMailingList } from '@/usecases/register-user-on-mailing-list/register-user-on-mailing-list';
import { MissingParamError } from '@/web-controllers/errors/missing-param-error';
import { HttpRequest } from '@/web-controllers/ports/http-request';
import { HttpResponse } from '@/web-controllers/ports/http-response';
import { RegisterUserAndSendEmailController } from '@/web-controllers/register-user-and-send-email-controller';
import { InMemoryUserRepository } from '@/usecases/register-user-on-mailing-list/repositories/in-memory-user-repository';
import { SendEmail } from '@/usecases/send-email/send-email';
import { RegisterAndSendEmail } from '@/usecases/register-and-send-email/register-and-send-email';
import { EmailOptions, EmailService } from '@/usecases/send-email/ports/email-service';
import { Either, right } from '@/shared/either';
import { MailServiceError } from '@/usecases/errors/mail-service-error';

describe('Register user web controller', () => {
  const attachmentFilePath = '../resources/text.txt'
  const fromName = 'Test'
  const fromEmail = 'from_email@mail.com'
  const toName = 'any_name'
  const toEmail = 'any_email@mail.com'
  const subject = 'Test e-mail'
  const emailBody = 'Hello world attachment test'
  const emailBodyHtml = '<b>Hello world attachment test</b>'
  const attachment = [{
    filename: attachmentFilePath,
    contentType: 'text/plain'
  }]

  const mailOptions: EmailOptions = {
    host: 'test',
    port: 867,
    username: 'test',
    password: 'test',
    from: fromName + ' ' + fromEmail,
    to: toName + '<' + toEmail + '>',
    subject: subject,
    text: emailBody,
    html: emailBodyHtml,
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
  const repository: UserRepository = new InMemoryUserRepository(users);
  const registerUseCase: RegisterUserOnMailingList = new RegisterUserOnMailingList(repository)
  const mailServiceStub = new MailServiceStub()
  const sendEmailUseCase: SendEmail = new SendEmail(mailOptions, mailServiceStub)
  const registerAndSendEmailUseCase: RegisterAndSendEmail =
    new RegisterAndSendEmail(registerUseCase, sendEmailUseCase)
  const controller: RegisterUserAndSendEmailController = new RegisterUserAndSendEmailController(registerAndSendEmailUseCase)
  const errorThrowingUseCaseStub: UseCase = new ErrorThrowingUseCaseStub();

  it('should return status code 201 when request contains valid user data', async () => {
    const request: HttpRequest = {
      body: {
        name: 'any name',
        email: 'any@email.com',
      },
    };

    const response: HttpResponse = await controller.handle(request);

    expect(response.statusCode).toEqual(201);
    expect(response.body).toEqual(request.body);
  });

  it('should return status code 400 when request contains invalid user name', async () => {
    const requestWithInvalidName: HttpRequest = {
      body: {
        name: 'A',
        email: 'any@email.com',
      },
    };

    const response: HttpResponse = await controller.handle(
      requestWithInvalidName
    );

    expect(response.statusCode).toEqual(400);
    expect(response.body).toBeInstanceOf(InvalidNameError);
  });

  it('should return status code 400 when request contains invalid user email', async () => {
    const requestWithInvalidEmail: HttpRequest = {
      body: {
        name: 'Any',
        email: 'anyemail.com',
      },
    };

    const response: HttpResponse = await controller.handle(
      requestWithInvalidEmail
    );

    expect(response.statusCode).toEqual(400);
    expect(response.body).toBeInstanceOf(InvalidEmailError);
  });

  it('should return status code 400 when request is missing user name', async () => {
    const requestMissingName: HttpRequest = {
      body: {
        email: 'anyemail.com',
      },
    };

    const response: HttpResponse = await controller.handle(requestMissingName);

    expect(response.statusCode).toEqual(400);
    expect(response.body).toBeInstanceOf(MissingParamError);
    expect((response.body as Error).message).toEqual(
      'Missing parameter from request: name.'
    );
  });

  it('should return status code 400 when request is missing user email', async () => {
    const requestMissingEmail: HttpRequest = {
      body: {
        name: 'any',
      },
    };

    const response: HttpResponse = await controller.handle(requestMissingEmail);

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

    const response: HttpResponse = await controller.handle(
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
        name: 'Any name',
        email: 'any@email.com',
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
