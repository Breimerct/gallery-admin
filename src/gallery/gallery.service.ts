import {
  getRootPath,
  getUrlImg,
  internalServerError,
  toLowerCaseObject,
} from '@/helpers/utils';
import {
  BadRequestException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { InjectModel } from '@nestjs/mongoose';
import { plainToClass, plainToInstance } from 'class-transformer';
import { Request } from 'express';
import { existsSync } from 'fs';
import { Model } from 'mongoose';
import { CreateGalleryDto } from './dto/create-gallery.dto';
import { ImageResponseDto } from './dto/image.response.dto';
import { UpdateGalleryDto } from './dto/update-gallery.dto';
import { Image } from './schemas/gallery.schema';
import { UserService } from '@/user/user.service';
import { ResponseMessageDto } from '@/common/dto/response-message.dto';

@Injectable()
export class GalleryService {
  constructor(
    @InjectModel(Image.name)
    private readonly imageModel: Model<Image>,
    private readonly userService: UserService,
  ) {}

  async create(
    createGalleryDto: CreateGalleryDto,
    image: Express.Multer.File,
    protocol: string,
    host: string,
  ) {
    const url = getUrlImg(protocol, host, image.filename);
    const lowerCaseDto = toLowerCaseObject(createGalleryDto, ['userId']);

    const totalImages = await this.imageModel
      .countDocuments()
      .catch(internalServerError);

    const newImage: Image = {
      title: lowerCaseDto.title,
      description: lowerCaseDto.description,
      createdAt: lowerCaseDto?.createdAt,
      userId: lowerCaseDto.userId,
      imageUri: url,
      order: totalImages + 1,
    };

    const createResult = await this.imageModel
      .create(newImage)
      .catch(internalServerError);

    return plainToClass(ImageResponseDto, createResult.toJSON());
  }

  getImage(imgName: string) {
    const rootPath = getRootPath(imgName);
    const isExistFile = existsSync(rootPath);

    if (!isExistFile) {
      throw new NotFoundException('img not found');
    }

    return rootPath;
  }

  async findAllByNicknameUser(nicknameUser: string) {
    const user = await this.userService
      .findOne({ nickname: nicknameUser })
      .catch(internalServerError);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const allImages = await this.imageModel
      .find()
      .where('userId')
      .equals(user._id)
      .lean()
      .catch(internalServerError);

    return plainToInstance(ImageResponseDto, allImages);
  }

  async findOne(id: string) {
    const image = await this.imageModel
      .findById(id)
      .lean()
      .catch(internalServerError);

    if (!image) {
      throw new NotFoundException('Image not found');
    }

    return plainToClass(ImageResponseDto, image);
  }

  async update(id: string, updateGalleryDto: UpdateGalleryDto) {
    const image = await this.imageModel.findById(id).catch(internalServerError);
    const lowerCaseDto = toLowerCaseObject(updateGalleryDto, ['userId', 'nicknameUser']);

    if (!image) {
      throw new NotFoundException('Image not found');
    }

    const updated = await this.imageModel
      .findByIdAndUpdate(id, { $set: lowerCaseDto }, { new: true, lean: true })
      .catch(internalServerError);

    return plainToClass(ImageResponseDto, updated);
  }

  async updateMany(updateDtos: UpdateGalleryDto[]): Promise<ResponseMessageDto> {
    const backupDocuments = [];
    const lowerCaseDtos = updateDtos.map(dto => {
      return toLowerCaseObject(dto, ['userId']);
    });

    try {
      for (const updateDto of lowerCaseDtos) {
        const originalDocument = await this.imageModel
          .findById(updateDto._id)
          .exec()
          .catch(internalServerError);

        backupDocuments.push(originalDocument);

        await this.imageModel
          .updateOne({ _id: updateDto._id }, { $set: updateDto })
          .exec();
      }
      return {
        status: HttpStatus.OK,
        message: 'Images have been successfully updated',
      };
    } catch (error) {
      for (const backup of backupDocuments) {
        await this.imageModel
          .updateOne({ _id: backup._id }, { $set: backup })
          .exec()
          .catch(internalServerError);
      }
      throw new BadRequestException('Update failed, rolling back changes.');
    }
  }

  async remove(id: string) {
    const image = await this.imageModel.findById(id);

    if (!image) {
      throw new NotFoundException('Image not found');
    }

    const deleted = await this.imageModel
      .findByIdAndDelete(id)
      .lean()
      .catch(internalServerError);

    return plainToClass(ImageResponseDto, deleted);
  }
}
