import { NodemailerEmailService } from '@/external/mail-services/nodemailer-email-service';
import { MongodbUserRepository } from '@/external/repositories/mongodb/mongodb-user-repository';
import { RegisterAndSendEmail } from '@/usecases/register-and-send-email/register-and-send-email';
import { RegisterUserOnMailingList } from '@/usecases/register-user-on-mailing-list/register-user-on-mailing-list';
import { SendEmail } from '@/usecases/send-email/send-email';
import { RegisterUserAndSendEmailController } from '@/web-controllers/register-user-and-send-email-controller';
import { getEmailOptions } from '../config/email';

export const makeRegisterAndSendUserController = (): RegisterUserAndSendEmailController => {
  const mongodbUserRepository = new MongodbUserRepository()
  const emailService = new NodemailerEmailService();
  const registerUserOnMailingListUseCase = new RegisterUserOnMailingList(mongodbUserRepository);
  const sendEmailUseCase = new SendEmail(getEmailOptions(), emailService);
  const registerAndSendEmailUseCase = new RegisterAndSendEmail(registerUserOnMailingListUseCase, sendEmailUseCase)
  const registerUserController = new RegisterUserAndSendEmailController(
    registerAndSendEmailUseCase
  );

  return registerUserController;
};
