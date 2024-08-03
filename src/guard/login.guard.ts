import { CanActivate, ExecutionContext, Inject, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { Observable } from 'rxjs';
import {  Request } from 'express'
import { UnLoginException } from 'src/filters/unlogin.filter';
import { UserData } from 'src/interfaces/user-data.interface';


declare module 'express' {
  interface Request {
    user:UserData
  }
}
    

@Injectable()
export class LoginGuard implements CanActivate {

  @Inject()
  private reflector:Reflector;
  @Inject(JwtService)
  private jwtService:JwtService

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {

    const request:Request = context.switchToHttp().getRequest()

    const requireLogin = this.reflector.getAllAndOverride('require-login',[ context.getClass(), context.getHandler() ])

    if( !requireLogin ) return true;
    if(!request.headers.authorization)throw new UnLoginException('用户未登录')
    try{
      const data = this.jwtService.verify(request.headers.authorization.split(' ')[1])
      request.user = {
        userId:data.userId,
        username:data.username,
        role:data.role
      }
      return true
    }catch(e){
      throw new UnLoginException('身份验证失败，请重新登录')
    }

  }
}
