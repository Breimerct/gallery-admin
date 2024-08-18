import { ApiHideProperty, ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsMongoId, IsString } from 'class-validator';

export class UpdateUserDto {
    @ApiHideProperty()
    nickname?: string;

    @ApiProperty()
    @IsEmail()
    email?: string;

    @ApiProperty()
    @IsString()
    password?: string;

    @ApiProperty()
    @IsString()
    name?: string;

    @ApiProperty()
    @IsString()
    lastName?: string;
}
