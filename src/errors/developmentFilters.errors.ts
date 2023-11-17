import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';

@Catch()
export class AllExceptionsFilterDevelopment implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();

    const httpStatus =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    if (exception.message.error) {
      response.status(httpStatus).json({
        statusCode: httpStatus,
        type: 'Error',
        message: exception?.response?.message || exception.message.error,
      });
    } else {
      console.log(exception);
      response.status(httpStatus).json({
        statusCode: httpStatus,
        type: exception.name,
        message: exception?.response?.message || exception.message,
      });
    }
  }
}
