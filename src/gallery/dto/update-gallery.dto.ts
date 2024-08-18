import { ApiProperty, ApiPropertyOptional, PartialType } from '@nestjs/swagger';

import { CreateGalleryDto } from './create-gallery.dto';
import { IsMongoId } from 'class-validator';

export class UpdateGalleryDto extends PartialType(CreateGalleryDto) {
  @ApiProperty()
  @IsMongoId({ message: 'Invalid image id' })
  _id: string;

  @ApiPropertyOptional()
  order: number;

  @ApiPropertyOptional()
  createdAt: Date;
}
