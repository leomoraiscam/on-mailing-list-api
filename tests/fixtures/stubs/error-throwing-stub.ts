import { UseCase } from "@/usecases/ports/use-case";

export class ErrorThrowingUseCaseStub implements UseCase {
  perform(_: Request): Promise<void> {
    throw Error();
  }
}