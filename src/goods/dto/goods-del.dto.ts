import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, MaxLength, MinLength } from "class-validator";

export class GoodsDelDto {
    @IsNotEmpty({
        message:'货品名称不能为空'
    })
    @ApiProperty()
    name:string
}