import { Exclude, Transform } from 'class-transformer';

import { ApiProperty } from '@nestjs/swagger';

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

  @Exclude()
  userId: string;

  @Exclude()
  nicknameUser: string;
}
