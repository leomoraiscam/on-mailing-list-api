export interface LoggerService {
  log(level: string, message: string, metadata?: object): void;
}
