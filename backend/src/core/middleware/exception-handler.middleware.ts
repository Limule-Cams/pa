import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  Logger,
  HttpStatus,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { I18nService, I18nContext } from 'nestjs-i18n'; 

@Catch(HttpException) 
export class GlobalExceptionHandler implements ExceptionFilter {
  private readonly logger = new Logger(GlobalExceptionHandler.name);

  constructor(private readonly i18n: I18nService) {}

  async catch(exception: HttpException, host: ArgumentsHost): Promise<void> {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const status = exception.getStatus();
    let exceptionResponse = exception.getResponse(); 
    const i18nContext = I18nContext.current(host);
    let message: string | object = exception.message; 

    if (i18nContext) {
      if (typeof exceptionResponse === 'string') {       
          message = await this.i18n.t(`errors.${exceptionResponse}`, { lang: i18nContext.lang, defaultValue: exceptionResponse });

          if(message === `errors.${exceptionResponse}`) message = exception.message;

      } else if (typeof exceptionResponse === 'object' && exceptionResponse !== null && 'message' in exceptionResponse) {
          if (Array.isArray(exceptionResponse.message)) {
               message = exceptionResponse.message;
          }
          else if (typeof exceptionResponse.message === 'string') {
              message = await this.i18n.t(`errors.${exceptionResponse.message}`, { lang: i18nContext.lang, defaultValue: exceptionResponse.message });
               if(message === `errors.${exceptionResponse.message}`) message = exceptionResponse.message;
          }
          else {
              message = exceptionResponse;
          }
      }
    }

    const errorResponseBody = {
        statusCode: status,
        timestamp: new Date().toISOString(),
        path: request.url,
        message: (typeof message === 'string' || Array.isArray(message)) ? message : (exceptionResponse['error'] || exception.message),
    };


    this.logger.error(
        `HTTP Status: ${status} Error Response: ${JSON.stringify(errorResponseBody)}`,
        exception.stack
    );


    response.status(status).json(errorResponseBody);
  }
}