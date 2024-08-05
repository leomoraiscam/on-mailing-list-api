import winston, { createLogger, Logger } from 'winston';

import { LoggerProvider } from '@/usecases/ports/providers/logger/logger-provider';

export class WinstonLoggerProvider implements LoggerProvider {
  private logger: Logger;

  log(level: string, message: string, metadata?: object): void {
    this.logger = createLogger({
      level,
      format: winston.format.json(),
    });

    this.logger.log(level, message, { metadata });
  }
}
