import { CreateUserDto } from '@/user/dto/create-user.dto';
import {
  Body,
  ClassSerializerInterceptor,
  Controller, Param,
  Post,
  Put,
  Req,
  UseGuards,
  UseInterceptors
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { AuthLoginDto } from './dto/auth-login.dto';
import { UpdatePassDto } from './dto/update-pass.dto';
import { AuthGuard } from './guard/auth.guard';
import { EmailResetPassDto } from './dto/emal-reset-pass';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { ForgotPasswordDoc, LoginDoc, LogoutDoc, RegisterDoc, ResetPasswordDoc, UpdatePasswordDoc } from './doc';

@Controller('auth')
@ApiTags('Auth')
@UseInterceptors(ClassSerializerInterceptor)
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @RegisterDoc()
  register(@Body() userDto: CreateUserDto) {
    return this.authService.register(userDto);
  }

  @Post('login')
  @LoginDoc()
  login(@Body() loginDto: AuthLoginDto) {
    return this.authService.login(loginDto);
  }

  @Post('logout')
  @UseGuards(AuthGuard)
  @LogoutDoc()
  logout(@Req() request: Request) {
    const tokenId = request['token'];
    return this.authService.logout(tokenId);
  }

  @Put('update-password/:id')
  @UseGuards(AuthGuard)
  @UpdatePasswordDoc()
  updatePassword(@Param('id') id: string, @Body() passwordDto: UpdatePassDto) {
    return this.authService.updatePassword(id, passwordDto);
  }

  @Post('forgot-password')
  @ForgotPasswordDoc()
  sendResetPasswordEmail(@Body() resetPassDto: EmailResetPassDto) {
    return this.authService.sendPasswordResetEmail(resetPassDto);
  }

  @Put('reset-password')
  @ResetPasswordDoc()
  resetPassword(@Body() resetPassDto: ResetPasswordDto) {
    return this.authService.resetPasswordWithToken(resetPassDto);
  }
}
