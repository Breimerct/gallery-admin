import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsMongoId, IsString } from 'class-validator';

export class UpdateGalleryDto{
  @ApiProperty()
  @IsMongoId({ message: 'Invalid image id' })
  _id: string;

  @ApiPropertyOptional()
  order: number;

  @ApiPropertyOptional()
  createdAt: Date;

  @ApiProperty({ default: 'This is a title' })
  @IsString({ message: 'Title must be a string' })
  title: string;

  @ApiPropertyOptional({ default: 'This is a description' })
  @IsString({ message: 'Description must be a string' })
  description: string;

  @ApiProperty({ type: 'string', format: 'binary' })
  image: string;
}
