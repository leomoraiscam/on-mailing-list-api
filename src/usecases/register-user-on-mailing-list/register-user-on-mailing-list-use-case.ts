import { UserData } from '@/dtos/user-data';
import { User } from '@/entities/user/user';
import { LoggerService } from '@/external/logger-services/ports/logger-service';

import { UserRepository } from '../../external/repositories/mongodb/ports/user-repository';
import { UseCase } from '../ports/use-case';

export class RegisterUserOnMailingListUseCase
  implements UseCase<User, UserData>
{
  private readonly repository: UserRepository;

  private readonly loggerService: LoggerService;

  public constructor(repository: UserRepository, loggerService: LoggerService) {
    this.repository = repository;
    this.loggerService = loggerService;
  }

  public async perform(request: User): Promise<UserData> {
    const userExists = await this.repository.exists({
      name: request.name.value,
      email: request.email.value,
    });

    if (!userExists) {
      await this.repository.add({
        name: request.name.value,
        email: request.email.value,
      });

      this.loggerService.log(
        'log',
        `${RegisterUserOnMailingListUseCase.name} [${JSON.stringify(
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
