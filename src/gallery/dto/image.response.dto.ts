import { Exclude, Transform } from 'class-transformer';

export class ImageResponseDto {
  @Transform(({ value }) => value.toString())
  _id: string;

  title: string;

  description: string;

  imageUri: string;

  createdAt: Date;

  order: number;

  constructor(partial: Partial<ImageResponseDto>) {
    Object.assign(this, partial);
  }
}
