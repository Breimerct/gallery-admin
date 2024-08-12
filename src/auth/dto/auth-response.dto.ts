import { ApiProperty } from '@nestjs/swagger';
import { ResponseUserDto } from '@/user/dto/response-user.dto';

export class AuthResponseDto {
  @ApiProperty()
  user: ResponseUserDto;

  @ApiProperty()
  token: string;
}
