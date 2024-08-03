import { CanActivate, ExecutionContext, Inject, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import {  Request } from 'express'
import { UnLoginException } from 'src/filters/unlogin.filter';

@Injectable()
export class IdentityGuard implements CanActivate {

  @Inject()
  private reflector:Reflector
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request:Request = context.switchToHttp().getRequest()

    if(!request.user) return true;
    const identities:string[] = this.reflector.getAllAndOverride('identity',[ context.getHandler(),context.getClass() ])
    if( !identities )return true;
    if(identities.includes(request.user.role))return true
    throw new UnLoginException('您没有访问该接口的权限');
  }
}
