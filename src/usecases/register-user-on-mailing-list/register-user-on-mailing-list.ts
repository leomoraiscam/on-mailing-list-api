import { User } from '@/entities/user';
import { UserData } from '@/dtos/user-data';
import { UserRepository } from './ports/user-repository';
import { Either, left, right } from '@/shared/either';
import { InvalidEmailError } from '@/entities/errors/invalid-email-error';
import { InvalidNameError } from '@/entities/errors/invalid-name-error';
import { UseCase } from '../ports/use-case';

export class RegisterUserOnMailingList implements UseCase {
  private readonly repository: UserRepository;

  public constructor(repository: UserRepository) {
    this.repository = repository;
  }

  public async perform(
    request: User
  ): Promise<UserData> {
      const userExists = await this.repository.exists({
        name: request.name.value,
        email: request.email.value
      });

      if (!userExists) {
        await this.repository.add({
          name: request.name.value,
          email: request.email.value
        });
      }
  
      return {
        name: request.name.value,
        email: request.email.value
      }
  }
}
