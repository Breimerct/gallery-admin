import { ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { HttpStatus, applyDecorators } from '@nestjs/common';

import { AuthResponseDto } from '../dto/auth-response.dto';
import { ResponseMessageDto } from '@/common/dto/response-message.dto';

export function RegisterDoc() {
  return applyDecorators(
    ApiOperation({
      summary: 'Register a new user',
      description: 'Register a new user',
    }),
    ApiResponse({
      status: HttpStatus.CREATED,
      description: 'User has been successfully registered',
      type: AuthResponseDto,
    }),
  );
}

export function LoginDoc() {
  return applyDecorators(
    ApiOperation({
      summary: 'Login',
      description: 'Login with email and password',
    }),
    ApiResponse({
      status: HttpStatus.OK,
      description: 'User has been successfully logged in',
      type: AuthResponseDto,
    }),
  );
}

export function LogoutDoc() {
  return applyDecorators(
    ApiBearerAuth(),
    ApiOperation({
      summary: 'Logout',
      description: 'Logout from the system',
    }),
    ApiResponse({
      status: HttpStatus.OK,
      description: 'User has been successfully logged out',
      type: ResponseMessageDto,
    }),
  );
}

export function UpdatePasswordDoc() {
  return applyDecorators(
    ApiBearerAuth(),
    ApiOperation({
      summary: 'Update password',
      description: 'Update password of a user',
    }),
    ApiResponse({
      status: HttpStatus.OK,
      description: 'Password has been successfully updated',
      type: ResponseMessageDto,
    }),
  );
}

export function ForgotPasswordDoc() {
    return applyDecorators(
        ApiOperation({
        summary: 'Send reset password email',
        description: 'Send reset password email to user',
        }),
        ApiResponse({
        status: HttpStatus.OK,
        description: 'Email has been successfully sent',
        type: ResponseMessageDto,
        }),
    );
}

export function ResetPasswordDoc() {
    return applyDecorators(
        ApiOperation({
        summary: 'Reset password',
        description: 'Reset password with token',
        }),
        ApiResponse({
        status: HttpStatus.OK,
        description: 'Password has been successfully reset',
        type: ResponseMessageDto,
        }),
    );
}