import { ApiProperty } from "@nestjs/swagger"
import { IsEmail, IsNotEmpty } from "class-validator"

export class UpdateEmailDto {
    @IsNotEmpty({
        message:'邮箱不能为空'
    })
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