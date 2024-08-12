import { ApiProperty } from '@nestjs/swagger';

export class ResetPasswordDto {
  @ApiProperty({
    description: 'Token to reset password',
    example: 'eyJhbGci...',
  })
  token: string;

  @ApiProperty({
    description: 'New password',
    example: 'newPassword123',
  })
  newPassword: string;
}
