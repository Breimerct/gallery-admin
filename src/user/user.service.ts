import {
  hashPassword,
  internalServerError,
  toLowerCaseObject,
} from '@/helpers/utils';
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { plainToClass, plainToInstance } from 'class-transformer';
import { Model } from 'mongoose';
import { CreateUserDto } from './dto/create-user.dto';
import { ResponseUserDto } from './dto/response-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './schemas/user.schema';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name)
    private readonly userModel: Model<User>,
  ) {}

  async create(createUserDto: CreateUserDto) {
    const lowerCaseDto = toLowerCaseObject<CreateUserDto>(createUserDto, [
      'password',
      'nickname'
    ]);

    const existUserWithEmail = await this.userModel.exists({
      email: lowerCaseDto.email,
    });

    const existWithNickname = await this.userModel.exists({
      nickname: lowerCaseDto.nickname,
    });

    if (existWithNickname) {
      throw new BadRequestException('Nickname already exists in another user');
    }

    if (existUserWithEmail) {
      throw new BadRequestException('Email already exists in another user');
    }

    const passwordHash = await hashPassword(lowerCaseDto.password);

    const createUser = await this.userModel
      .create({
        ...lowerCaseDto,
        password: passwordHash,
      })
      .catch(internalServerError);

    return plainToClass(ResponseUserDto, createUser.toJSON());
  }

  async findOne(userDto: Partial<User & { _id: string }>) {
    const user = await this.userModel
      .findOne(userDto)
      .lean()
      .catch(internalServerError);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    const lowerCaseDto = toLowerCaseObject<UpdateUserDto>(updateUserDto, [
      'password',
      'nickname',
    ]);

    const user = await this.findOne({ _id: id });

    const existUserWithEmail = await this.userModel.exists({
      email: lowerCaseDto.email,
      $and: [{ _id: { $ne: id } }],
    });

    const existWithNickname = await this.userModel.exists({
      nickname: lowerCaseDto.nickname,
      $and: [{ _id: { $ne: id } }],
    });

    if (existWithNickname && user.nickname !== lowerCaseDto.nickname) {
      throw new BadRequestException('Nickname already exists in another user');
    }

    if (existUserWithEmail && user.email !== lowerCaseDto.email) {
      throw new BadRequestException('Email already exists in another user');
    }

    const updatedUser = await this.userModel
      .findByIdAndUpdate(id, { $set: lowerCaseDto }, { new: true, lean: true })
      .catch(internalServerError);

    return plainToClass(ResponseUserDto, updatedUser);
  }

  async remove(_id: string) {
    const user = await this.findOne({ _id });

    const result = await this.userModel
      .deleteOne({ _id: user._id })
      .lean()
      .catch(internalServerError);

    return plainToClass(ResponseUserDto, result);
  }
}
