import { UserData } from '@/dtos/user-data';
import { User } from '@/entities/user';
import { LoggerService } from '@/external/logger-services/ports/logger-service';

import { UseCase } from '../ports/use-case';
import { UserRepository } from './ports/user-repository';

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
