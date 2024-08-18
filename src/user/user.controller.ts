import {
  Controller,
  Get, Body,
  Patch,
  Param,
  Delete,
  UseInterceptors,
  ClassSerializerInterceptor,
  UseGuards
} from '@nestjs/common';
import { UserService } from './user.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { plainToClass } from 'class-transformer';
import { ResponseUserDto } from './dto/response-user.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@/auth/guard/auth.guard';
import { ValidateMongoIdGuard } from '@/common/guards/validate-mongo-id/validate-mongo-id.guard';
import { GetUserOneUserDoc, RemoveUserDoc, UpdateUserDoc } from './doc';

@Controller('user')
@ApiBearerAuth()
@ApiTags('User')
@UseInterceptors(ClassSerializerInterceptor)
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get(':id')
  @UseGuards(AuthGuard)
  @UseGuards(ValidateMongoIdGuard)
  @GetUserOneUserDoc()
  async findOne(@Param('id') id: string) {
    const user = await this.userService.findOne({ _id: id });

    return plainToClass(ResponseUserDto, user);
  }

  @Patch(':id')
  @UseGuards(AuthGuard)
  @UseGuards(ValidateMongoIdGuard)
  @UpdateUserDoc()
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(id, updateUserDto);
  }

  @Delete(':id')
  @UseGuards(AuthGuard)
  @UseGuards(ValidateMongoIdGuard)
  @RemoveUserDoc()
  remove(@Param('id') id: string) {
    return this.userService.remove(id);
  }
}
