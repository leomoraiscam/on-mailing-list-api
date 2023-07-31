export interface UseCase<T, R> {
  perform: (request?: T) => Promise<T | R>;
}
