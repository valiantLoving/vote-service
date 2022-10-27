import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';

@Catch()
export class CommonExceptionFilter<T extends Error> implements ExceptionFilter {
  private readonly logger = new Logger(CommonExceptionFilter.name);
  catch(exception: T, host: ArgumentsHost) {
    // 打印错误信息,便于排查
    this.logger.error(exception.stack);

    const request = host.switchToHttp().getRequest() as Request;
    const response = host.switchToHttp().getResponse() as Response;

    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;
    const message =
      exception instanceof HttpException
        ? typeof exception.getResponse() == 'string'
          ? exception.getResponse()
          : (<any>exception.getResponse()).message
        : exception.message;

    // 返回客户端固定的200的响应码
    response.status(200).json({
      code: status,
      message,
      timestamp: new Date().toISOString(),
      path: request.url,
    });
  }
}
