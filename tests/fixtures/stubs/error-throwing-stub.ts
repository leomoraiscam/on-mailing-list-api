import { UseCase } from '@/usecases/ports/use-case';

export class ErrorThrowingUseCaseStub implements UseCase<Request, void> {
  perform(_: Request): Promise<void> {
    throw Error();
  }
}
