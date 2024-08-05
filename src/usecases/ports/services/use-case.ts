export interface UseCase<T, R> {
  perform: (request?: T) => Promise<R>;
}
