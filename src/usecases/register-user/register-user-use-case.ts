import { UserData } from '@/dtos/user-data';
import { User } from '@/entities/user/user';
import { LoggerService } from '@/external/logger-services/ports/logger-service';
import { UserRepository } from '@/external/repositories/mongodb/ports/user-repository';

import { UseCase } from '../ports/use-case';

export class RegisterUserUseCase implements UseCase<User, UserData> {
  private readonly userRepository: UserRepository;

  private readonly loggerService: LoggerService;

  public constructor(
    userRepository: UserRepository,
    loggerService: LoggerService
  ) {
    this.userRepository = userRepository;
    this.loggerService = loggerService;
  }

  public async perform(request: User): Promise<UserData> {
    const userExists = await this.userRepository.exists({
      name: request.name.value,
      email: request.email.value,
    });

    if (!userExists) {
      await this.userRepository.add({
        name: request.name.value,
        email: request.email.value,
      });

      this.loggerService.log(
        'log',
        `${RegisterUserUseCase.name} [${JSON.stringify(
          request
        )}] - Recipient added`
      );
    }

    return {
      name: request.name.value,
      email: request.email.value,
    };
  }
}
