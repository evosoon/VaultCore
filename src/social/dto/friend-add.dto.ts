import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty } from "class-validator";

export class FriendAddDto {
    @IsNotEmpty({
        message:'ID (friend) 不能为空'
    })
    @ApiProperty()
    id:number
    @ApiProperty()
    friendGroup:string
}