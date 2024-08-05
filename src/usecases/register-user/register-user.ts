import { UserData } from '@/dtos/user-data';
import { InvalidEmailError } from '@/entities/user/errors/invalid-email-error';
import { InvalidNameError } from '@/entities/user/errors/invalid-name-error';
import { User } from '@/entities/user/user';
import { Either, left, right } from '@/shared/either';
import { UserRepository } from '@/usecases/ports/repositories/user-repository';

import { LoggerProvider } from '../ports/providers/logger/logger-provider';
import { UseCase } from '../ports/services/use-case';

export class RegisterUser
  implements
    UseCase<UserData, Either<InvalidNameError | InvalidEmailError, UserData>>
{
  private readonly userRepository: UserRepository;
  private readonly loggerService: LoggerProvider;

  public constructor(
    userRepository: UserRepository,
    loggerService: LoggerProvider
  ) {
    this.userRepository = userRepository;
    this.loggerService = loggerService;
  }

  public async perform(
    request: UserData
  ): Promise<Either<InvalidNameError | InvalidEmailError, UserData>> {
    const userOrError: Either<InvalidNameError | InvalidEmailError, User> =
      User.create({ name: request.name, email: request.email });

    if (userOrError.isLeft()) {
      return left(userOrError.value);
    }

    const user: User = userOrError.value;
    const existingUser = await this.userRepository.findByEmail(
      user.email.value
    );

    if (!existingUser) {
      await this.userRepository.create({
        name: user.name.value,
        email: user.email.value,
      });

      this.loggerService.log(
        'log',
        `${RegisterUser.name}: [${JSON.stringify(
          request
        )}] - Recipient added on database`
      );
    } else {
      this.loggerService.log(
        'log',
        `${RegisterUser.name}: [${JSON.stringify(
          request
        )}] - Recipient already exist on database`
      );
    }

    return right(request);
  }
}
