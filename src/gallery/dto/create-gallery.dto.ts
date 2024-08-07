import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsDate, IsOptional, IsString } from 'class-validator';

import { Transform } from 'class-transformer';

export class CreateGalleryDto {
  @ApiProperty({ default: 'This is a title' })
  @IsString({ message: 'Title must be a string' })
  title: string;

  @ApiPropertyOptional({ default: 'This is a description' })
  @IsString({ message: 'Description must be a string' })
  description: string;

  @ApiPropertyOptional({ default: new Date() })
  @Transform(({ value }) => new Date(value))
  @IsOptional()
  @IsDate()
  createdAt?: Date;

  @ApiProperty({ type: 'string', format: 'binary' })
  image: string;
}
