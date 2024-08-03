import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { Response } from 'express';
import { Observable, map } from 'rxjs';

// 响应拦截器 - 内容修改
@Injectable()
export class FormatResponseInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {

    const response:Response = context.switchToHttp().getResponse()
    return next.handle().pipe( map( data => {
      return {
        status:response.statusCode,
        message:'OK',
        data
      }
    }));
  }
}
