import { ApiProperty } from "@nestjs/swagger"

export class UpdateInfoDto {
    @ApiProperty()
    nickname:string
    @ApiProperty()
    phone_number:string
    @ApiProperty()
    user_pic:string
}