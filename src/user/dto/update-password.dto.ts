import { ApiProperty } from "@nestjs/swagger"
import { IsNotEmpty, MinLength, MaxLength, IsEmail } from "class-validator"

export class UpdatePasswordDto {

    @IsNotEmpty({message:'邮箱不能为空'})
    @IsEmail({},{message:'邮箱不合法'})
    @ApiProperty()
    email:string


    @IsNotEmpty({message:'密码不能为空'})
    @MinLength(4,{message:'密码不能少于 4 位'})
    @MaxLength(20,{message:'密码不能大于 20 位'})
    @ApiProperty()
    password:string

    @IsNotEmpty({message:'验证码不能为空'})
    @ApiProperty()
    captcha:string
}