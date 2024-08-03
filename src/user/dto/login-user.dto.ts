import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, MaxLength, MinLength } from "class-validator";

export class LoginUserDto {
    @IsNotEmpty({
        message:'用户名/邮箱不能为空'
    })
    @ApiProperty()
    username:string

    @IsNotEmpty({
        message:'密码不能为空'
    })
    @MinLength(4,{
        message:'密码不能少于4位'
    })
    @MaxLength(20,{
        message:'密码不能多于20位'
    })
    @ApiProperty()
    password:string
}