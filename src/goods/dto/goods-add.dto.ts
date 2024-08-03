import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, MaxLength, MinLength } from "class-validator";

export class GoodsAddDto {
    @IsNotEmpty({
        message:'货品名称不能为空'
    })
    @ApiProperty()
    name:string

    @IsNotEmpty({
        message:'货品数量不能为空'
    })
    @ApiProperty()
    quantity:number

    @IsNotEmpty({
        message:'货品价格不能为空'
    })
    @ApiProperty()
    price:string
}