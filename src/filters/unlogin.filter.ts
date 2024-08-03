import { ArgumentsHost, Catch, ExceptionFilter, HttpStatus } from '@nestjs/common';
import {Response} from 'express'
export class UnLoginException {
  message:string
  constructor(message?){
    this.message = message
  }
}
@Catch(UnLoginException)
export class UnloginFilter implements ExceptionFilter {
  catch(exception: UnLoginException, host: ArgumentsHost) {
    const response:Response = host.switchToHttp().getResponse()

    response.json({
      status:HttpStatus.UNAUTHORIZED,
      message:'fail',
      data:exception.message || '用户未登录'
    }).end()

  }
}
