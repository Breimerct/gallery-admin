import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { HttpStatus, applyDecorators } from '@nestjs/common';

import { ResponseUserDto } from '../dto/response-user.dto';

export function GetUserOneUserDoc() {
  return applyDecorators(
    ApiOperation({
      summary: 'Get one user',
      description: 'Get one user by id',
    }),
    ApiResponse({
      status: HttpStatus.OK,
      description: 'User has been successfully found',
      type: ResponseUserDto,
    }),
  );
}

export function UpdateUserDoc() {
  return applyDecorators(
    ApiOperation({
      summary: 'Update user',
      description: 'Update user by id',
    }),
    ApiResponse({
      status: HttpStatus.OK,
      description: 'User has been successfully updated',
      type: ResponseUserDto,
    }),
  );
}

export function RemoveUserDoc() {
  return applyDecorators(
    ApiOperation({
      summary: 'Remove user',
      description: 'Remove user by id',
    }),
    ApiResponse({
      status: HttpStatus.OK,
      description: 'User has been successfully removed',
      type: ResponseUserDto,
    }),
  );
}
