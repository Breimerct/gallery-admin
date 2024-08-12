import { CreateUserDto } from '@/user/dto/create-user.dto';
import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Param,
  Post,
  Put,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { AuthLoginDto } from './dto/auth-login.dto';
import { UpdatePassDto } from './dto/update-pass.dto';
import { ResponseUserDto } from '@/user/dto/response-user.dto';
import { AuthResponseDto } from './dto/auth-response.dto';
import { AuthGuard } from './guard/auth.guard';
import { EmailResetPassDto } from './dto/emal-reset-pass';
import { ResponseMessageDto } from '@/common/dto/response-message.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';

@Controller('auth')
@ApiTags('Auth')
@UseInterceptors(ClassSerializerInterceptor)
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @ApiOperation({
    summary: 'Register a new user',
    description: 'Register a new user',
  })
  @ApiResponse({
    status: 201,
    description: 'User has been successfully registered',
    type: AuthResponseDto,
  })
  register(@Body() userDto: CreateUserDto) {
    return this.authService.register(userDto);
  }

  @Post('login')
  @ApiOperation({
    summary: 'Login',
    description: 'Login with email and password',
  })
  @ApiResponse({
    status: 200,
    description: 'User has been successfully logged in',
    type: AuthResponseDto,
  })
  login(@Body() loginDto: AuthLoginDto) {
    return this.authService.login(loginDto);
  }

  @Put('update-password/:id')
  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @ApiOperation({
    summary: 'Update password',
    description: 'Update password of a user',
  })
  @ApiResponse({
    status: 200,
    description: 'Password has been successfully updated',
    type: ResponseUserDto,
  })
  updatePassword(@Param('id') id: string, @Body() passwordDto: UpdatePassDto) {
    return this.authService.updatePassword(id, passwordDto);
  }

  @Post('reset-password/send-email')
  @ApiOperation({
    summary: 'Send reset password email',
    description: 'send reset password email to user',
  })
  @ApiResponse({
    status: 200,
    description: 'Email has been successfully sent',
    type: ResponseMessageDto,
  })
  sendResetPasswordEmail(@Body() resetPassDto: EmailResetPassDto) {
    return this.authService.sendPasswordResetEmail(resetPassDto);
  }

  @Put('reset-password')
  @ApiOperation({
    summary: 'Reset password',
    description: 'Reset password with token',
  })
  @ApiResponse({
    status: 200,
    description: 'Password has been successfully reset',
    type: ResponseMessageDto,
  })
  resetPassword(@Body() resetPassDto: ResetPasswordDto) {
    return this.authService.resetPasswordWithToken(resetPassDto);
  }
}
