import { ExecutionContext, SetMetadata, createParamDecorator } from "@nestjs/common";

interface Request {
    user
}
// 需要登录
export const RequireLogin = () => SetMetadata('require-login',true)
// 需要权限
export const RequireIdentity = (...role:string[]) => SetMetadata('identity',role)
// UserInfo 参数装饰器
export const UserInfo = createParamDecorator((data: string, ctx: ExecutionContext)=>{
    const request:Request = ctx.switchToHttp().getRequest()
    if(!request.user) return null
    return data?request.user[data] : request.user
})