import { IsEmail, IsString } from "class-validator";

import { ApiProperty } from "@nestjs/swagger";

export class CreateUserDto {
    @ApiProperty()
    @IsString()
    readonly nickname: string;

    @ApiProperty()
    @IsEmail()
    readonly email: string;

    @ApiProperty()
    @IsString()
    readonly password: string;

    @ApiProperty()
    @IsString()
    readonly name: string;

    @ApiProperty()
    @IsString()
    readonly lastName: string;
}
