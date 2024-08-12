import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';

export class ImageResponseDto {
  constructor(partial: Partial<ImageResponseDto>) {
    Object.assign(this, partial);
  }

  @ApiProperty()
  @Transform(({ value }) => value.toString())
  _id: string;

  @ApiProperty()
  title: string;

  @ApiProperty()
  description: string;

  @ApiProperty()
  imageUri: string;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  order: number;

  @ApiProperty()
  @Transform(({ value }) => value.toString())
  userId: string;
}
