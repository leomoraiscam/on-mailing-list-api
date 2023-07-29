import winston, { createLogger, Logger } from 'winston';

import { LoggerService } from './ports/logger-service';

export class WinstonLoggerService implements LoggerService {
  private logger: Logger;

  log(level: string, message: string, metadata?: object): void {
    this.logger = createLogger({
      level,
      format: winston.format.json(),
    });

    this.logger.log(level, message, { metadata });
  }
}
