import { Controller, Get, Inject, Logger, Param, Query } from '@nestjs/common';
import { EmailService } from './email.service';
import { RedisService } from 'src/redis/redis.service';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('邮件')
@Controller('email')
export class EmailController {

  @Inject(RedisService)
  private redisService:RedisService
  constructor(private readonly emailService: EmailService) {}

  @ApiOperation({summary:"注册验证码"})
  @Get('signup_captcha')
  async SignupCaptcha( @Query('address') address:string ){
    const captcha = Math.random().toString().slice(2,8)
    try{
      await this.redisService.set(`signup_captcha_${address}`,captcha, 5*60 )
      await this.emailService.send({
        to:address,
        subject:'注册验证码',
        html:` <p>感谢你注册 Vault 平台，你的注册邮箱为 ${address} 。请回填如下验证码： </p>
        <p>${captcha}</p>
        <p>验证码 5 分钟内有效，5 分钟后需要重新激活邮箱。</p>`
      })
      return '发送成功'
    }catch(e){
      Logger.log(e)
      return '发送失败'
    }
   
  }
  
  @ApiOperation({summary:"找回密码验证码"})
  @Get('reset_password_captcha')
  async ResetPasswordCaptcha( @Query('address') address:string ){
    const captcha = Math.random().toString().slice(2,8)
    try{
      await this.redisService.set(`reset_password_captcha_${address}`,captcha, 5*60 )
      await this.emailService.send({
        to:address,
        subject:'重置密码',
        html:` <p>你的注册邮箱为 ${address} 正在修改密码 。请回填如下验证码（如非本人操作请忽略）： </p>
        <p>${captcha}</p>
        <p>验证码 5 分钟内有效，5 分钟后需要重新激活邮箱。</p>`
      })
      return '发送成功'
    }catch(e){
      Logger.log(e)
      return '发送失败'
    }
  } 
   
  @ApiOperation({summary:"变更邮箱验证码"})
  @Get('reset_email_captcha')
  async ChangeEmailCaptcha( @Query('address') address:string ){
    const captcha = Math.random().toString().slice(2,8)
    try{
      await this.redisService.set(`reset_email_captcha_${address}`,captcha, 5*60 )
      await this.emailService.send({
        to:address,
        subject:'更换绑定邮箱',
        html:` <p>你的注册邮箱为 ${address} 正在修改绑定邮箱 。请回填如下验证码（如非本人操作请忽略）： </p>
        <p>${captcha}</p>
        <p>验证码 5 分钟内有效，5 分钟后需要重新激活邮箱。</p>`
      })
      return '发送成功'
    }catch(e){
      Logger.log(e)
      return '发送失败'
    }
  }
}
