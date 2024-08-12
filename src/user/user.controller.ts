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
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@/auth/guard/auth.guard';
import { ValidateMongoIdGuard } from '@/common/guards/validate-mongo-id/validate-mongo-id.guard';

@Controller('user')
@ApiBearerAuth()
@ApiTags('User')
@UseInterceptors(ClassSerializerInterceptor)
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get(':id')
  @UseGuards(AuthGuard)
  @UseGuards(ValidateMongoIdGuard)
  @ApiOperation({
    summary: 'Get one user',
    description: 'Get one user by id',
  })
  @ApiResponse({
    status: 200,
    description: 'User has been successfully found',
    type: ResponseUserDto,
  })
  async findOne(@Param('id') id: string) {
    const user = await this.userService.findOne({ _id: id });

    return plainToClass(ResponseUserDto, user);
  }

  @Patch(':id')
  @UseGuards(AuthGuard)
  @UseGuards(ValidateMongoIdGuard)
  @ApiOperation({
    summary: 'Update user',
    description: 'Update user by id',
  })
  @ApiResponse({
    status: 200,
    description: 'User has been successfully updated',
    type: ResponseUserDto,
  })
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(id, updateUserDto);
  }

  @Delete(':id')
  @UseGuards(AuthGuard)
  @UseGuards(ValidateMongoIdGuard)
  @ApiOperation({
    summary: 'Remove user',
    description: 'Remove user by id',
  })
  @ApiResponse({
    status: 200,
    description: 'User has been successfully removed',
    type: ResponseUserDto,
  })
  remove(@Param('id') id: string) {
    return this.userService.remove(id);
  }
}
