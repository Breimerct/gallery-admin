import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

import { ApiProperty } from '@nestjs/swagger';

export class EmailResetPassDto {
  @ApiProperty({ default: 'http://localhost:3000/reset-password' })
  @IsString()
  @IsNotEmpty()
  frontUrl: string;

  @ApiProperty({ default: 'breimerct@gmail.com'})
  @IsEmail()
  @IsNotEmpty()
  email: string;
}
