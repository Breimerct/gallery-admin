import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsMongoId, IsString } from 'class-validator';

export class CreateGalleryDto {
  @ApiProperty()
  @IsMongoId({ message: 'Id must be a mongoId' })
  userId: string;
  
  @ApiProperty({ default: 'This is a title' })
  @IsString({ message: 'Title must be a string' })
  title: string;

  @ApiPropertyOptional({ default: 'This is a description' })
  @IsString({ message: 'Description must be a string' })
  description: string;

  @ApiPropertyOptional({ default: new Date() })
  createdAt?: Date;

  @ApiProperty({ type: 'string', format: 'binary' })
  image: string;
}
