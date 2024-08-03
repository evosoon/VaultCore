import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, MaxLength, MinLength } from "class-validator";

export class GoodsFindDto {
    @ApiProperty()
    name?:string
}