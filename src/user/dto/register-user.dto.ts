import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, MaxLength, MinLength } from "class-validator";

export class RegisterUserDto {
    @IsNotEmpty({
        message:'用户名不能为空'
    })
    @ApiProperty()
    username:string

    @IsNotEmpty({
        message:'昵称不能为空'
    })
    @ApiProperty()
    nickname:string

    @IsNotEmpty({
        message:'密码不能为空'
    })
    @MinLength(4,{
        message:'密码不能少于4位'
    })
    @MaxLength(20,{
        message:'密码不能多与20位'
    })
    @ApiProperty()
    password:string
    
    @IsEmail({},{
        message:'邮箱格式不合法'
    })
    @ApiProperty()
    email:string
    
    @IsNotEmpty({
        message:'验证码不能为空'
    })
    @ApiProperty()
    captcha:string
}