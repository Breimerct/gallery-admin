import { Exclude, Expose, Transform } from 'class-transformer';

import { ApiProperty } from '@nestjs/swagger';
import { UI_AVATAR_URL_BASE } from '@/constants';

export class ResponseUserDto {
  constructor(partial: Partial<ResponseUserDto>) {
    Object.assign(this, partial);
  }

  @ApiProperty()
  @Transform(({ value }) => value.toString())
  _id: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  lastName: string;

  @ApiProperty()
  @Expose()
  get fullName(): string {
    return `${this.name} ${this.lastName}`;
  }

  @ApiProperty()
  @Expose()
  get profileImage(): string {
    return encodeURI(`${UI_AVATAR_URL_BASE}&name=${this.fullName}`);
  }

  @ApiProperty()
  email: string;

  @Exclude()
  password: string;

  @ApiProperty()
  updatedAt: Date;

  @Exclude()
  createdAt: Date;
}
