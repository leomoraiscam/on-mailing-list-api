import { WinstonLoggerService } from '@/external/logger-services/wintson-logger-services';
import { NodemailerEmailService } from '@/external/mail-services/nodemailer-email-service';
import { MongodbUserRepository } from '@/external/repositories/mongodb/implementations/mongodb-user-repository';
import { RegisterUser } from '@/usecases/register-user/register-user';
import { SendEmailToUserWithBonus } from '@/usecases/send-email-to-user-with-bonus/send-email-to-user-with-bonus';
import { RegisterUserController } from '@/web-controllers/register-user-controller';

import { getEmailOptions } from '../config/email';

export const makeRegisterUserController = (): RegisterUserController => {
  const mongodbUserRepository = new MongodbUserRepository();
  const loggerService = new WinstonLoggerService();
  const emailService = new NodemailerEmailService(loggerService);
  const registerUser = new RegisterUser(mongodbUserRepository, loggerService);
  const sendEmailToUserWithBonus = new SendEmailToUserWithBonus(
    getEmailOptions(),
    emailService,
    loggerService
  );

  return new RegisterUserController(registerUser, sendEmailToUserWithBonus);
};
