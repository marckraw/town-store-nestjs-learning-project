import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Response } from 'express';
import { SqliteError } from 'better-sqlite3';

@Catch(Error)
export class AllErrorsFilter implements ExceptionFilter {
  private logger = new Logger(AllErrorsFilter.name);
  catch(exception: Error | any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    const request = ctx.getRequest<Request>();

    this.logger.debug(`Client preferred language is ${request['language']}`);

    if (exception instanceof HttpException) {
      // jeżeli to NestJS'owy błąd, instancja HttpException, to obsłuż ją tak jak do tej pory:
      response.status(exception.getStatus()).json(exception.getResponse());
      // nie idź dalej, żeby nie zrobić "podwójnego response" na jeden request!
      return;
    }

    if (exception instanceof SqliteError) {
      this.logger.error(exception);
      return response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        message: 'DB query error',
        errors: 'DB Error',
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      });
    }
    // jeśli błąd posiada pole `code` sprawdź, czy to nie file-system error
    if (
      [
        'EACCES',
        'EEXIST',
        'ENOENT',
        'ENOTDIR',
        'ENOTEMPTY',
        'EMFILE',
        'EISDIR',
      ].includes(exception?.code)
    ) {
      return response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        message: 'File i/o error (check logs)',
        error: 'Internal Server Error',
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      });
    }

    // Jeśli to nieznany błąd (inny niż HttpException):
    this.logger.debug(exception?.message);

    response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
      message: 'Unknown error',
      error: 'Internal Server Error',
      statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
    });
  }
}
