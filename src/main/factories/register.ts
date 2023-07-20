import { NodemailerEmailService } from '@/external/mail-services/nodemailer-email-service';
import { MongodbUserRepository } from '@/external/repositories/mongodb/mongodb-user-repository';
import { RegisterUserAndSendEmailUseCase } from '@/usecases/register-user-and-send-email/register-user-and-send-email';
import { RegisterUserOnMailingList } from '@/usecases/register-user-on-mailing-list/register-user-on-mailing-list';
import { SendEmail } from '@/usecases/send-email/send-email';
import { RegisterUserAndSendEmailController } from '@/web-controllers/register-user-and-send-email-controller';
import { getEmailOptions } from '../config/email';

export const makeRegisterAndSendUserController = (): RegisterUserAndSendEmailController => {
  const mongodbUserRepository = new MongodbUserRepository()
  const emailService = new NodemailerEmailService();
  const registerUserOnMailingListUseCase = new RegisterUserOnMailingList(mongodbUserRepository);
  const sendEmailUseCase = new SendEmail(getEmailOptions(), emailService);
  const registerUserAndSendEmailUseCase = new RegisterUserAndSendEmailUseCase(registerUserOnMailingListUseCase, sendEmailUseCase)
  const registerUserController = new RegisterUserAndSendEmailController(
    registerUserAndSendEmailUseCase
  );

  return registerUserController;
};
