import { CallHandler, ExecutionContext, Injectable, Logger, NestInterceptor } from '@nestjs/common';
import { Observable, tap } from 'rxjs';
import {  Request,Response } from 'express'


@Injectable()
export class InvokeRecordInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {

    const request:Request = context.switchToHttp().getRequest()
    const response:Response = context.switchToHttp().getResponse()
    const userAgent = request.headers['user-agent']

    const { ip, method, path } = request
    Logger.debug(`${ip} ${method} ${path} ${userAgent} : ${context.getClass().name} ${context.getHandler().name} invoked...`)
    Logger.debug(`user: ${request.user?.userId}, ${request.user?.username}`);
    const now = Date.now()
    return next.handle().pipe( tap(res => {
      Logger.debug(`${method} ${path} ${ip} ${userAgent}: ${response.statusCode}: ${Date.now() - now}ms`)
      Logger.debug(`Response: ${JSON.stringify(res)}`);
    }));

  }
}
