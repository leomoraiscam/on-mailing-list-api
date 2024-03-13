import { UserData } from '@/dtos/user-data';
import { InvalidEmailError } from '@/entities/user/errors/invalid-email-error';
import { InvalidNameError } from '@/entities/user/errors/invalid-name-error';
import { Either } from '@/shared/either';

import { MailServiceError } from '../errors/mail-service-error';

export type RegisterAndSendEmailResponse = Either<
  InvalidNameError | InvalidEmailError | MailServiceError,
  UserData
>;
