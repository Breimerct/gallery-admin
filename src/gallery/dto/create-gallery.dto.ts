import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsMongoId, IsOptional, IsString } from 'class-validator';

import { Exclude } from 'class-transformer';

export class CreateGalleryDto {
  @ApiProperty()
  @IsMongoId({ message: 'Id must be a mongoId' })
  userId: string;

  @ApiProperty()
  @IsString({ message: 'Nickname must be a string' })
  nicknameUser: string;
  
  @ApiProperty({ default: 'This is a title' })
  @IsString({ message: 'Title must be a string' })
  title: string;

  @ApiPropertyOptional({ default: 'This is a description' })
  @IsString({ message: 'Description must be a string' })
  description: string;

  @Exclude()
  createdAt?: Date;

  @ApiProperty({ type: 'string', format: 'binary' })
  image: string;
}
