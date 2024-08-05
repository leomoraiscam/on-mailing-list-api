import { MongodbUserRepository } from '@/external/database/mongodb/repositories/mongodb-user-repository';
import { WinstonLoggerProvider } from '@/external/providers/logger/wintson-logger-provider';
import { NodemailerEmailProvider } from '@/external/providers/mail/nodemailer-email-provider';
import { RegisterUser } from '@/usecases/register-user/register-user';
import { SendEmailToUserWithBonus } from '@/usecases/send-email-to-user-with-bonus/send-email-to-user-with-bonus';
import { RegisterUserController } from '@/web-controllers/register-user-controller';

import { getEmailOptions } from '../config/email';

export const makeRegisterUserController = (): RegisterUserController => {
  const mongodbUserRepository = new MongodbUserRepository();
  const loggerService = new WinstonLoggerProvider();
  const emailService = new NodemailerEmailProvider(loggerService);
  const registerUser = new RegisterUser(mongodbUserRepository, loggerService);
  const sendEmailToUserWithBonus = new SendEmailToUserWithBonus(
    getEmailOptions(),
    emailService,
    loggerService
  );

  return new RegisterUserController(registerUser, sendEmailToUserWithBonus);
};
