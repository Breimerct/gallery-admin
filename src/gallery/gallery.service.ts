import { getRootPath, getUrlImg, internalServerError } from '@/helpers/utils';
import {
  BadRequestException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { type ImageType } from '@/typings/types';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import { plainToClass, plainToInstance } from 'class-transformer';
import { Request } from 'express';
import { existsSync } from 'fs';
import { Connection, Model } from 'mongoose';
import { CreateGalleryDto } from './dto/create-gallery.dto';
import { ImageResponseDto } from './dto/image.response.dto';
import { UpdateGalleryDto } from './dto/update-gallery.dto';
import { Image } from './schemas/gallery.schema';

@Injectable()
export class GalleryService {
  constructor(
    @InjectModel(Image.name)
    private readonly imageModel: Model<ImageType>,
    @InjectConnection() private readonly connection: Connection,
  ) {}

  async create(
    createGalleryDto: CreateGalleryDto,
    image: Express.Multer.File,
    resquest: Request,
  ) {
    const protocol = resquest.protocol;
    const host = resquest.get('host');
    const url = getUrlImg(protocol, host, image.filename);

    const totalImages = await this.imageModel
      .countDocuments()
      .catch(internalServerError);

    const newImage = {
      title: createGalleryDto.title,
      description: createGalleryDto.description,
      imageUri: url,
      createdAt: createGalleryDto?.createdAt,
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

  async findAll() {
    const allImages = await this.imageModel
      .find()
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

    if (!image) {
      throw new NotFoundException('Image not found');
    }

    const objectResponse = plainToClass(ImageResponseDto, image);

    const updated = await this.imageModel
      .findByIdAndUpdate(
        id,
        { $set: objectResponse },
        { new: true, lean: true },
      )
      .catch(internalServerError);

    return plainToClass(ImageResponseDto, updated);
  }

  async updateMany(updateDtos: UpdateGalleryDto[]) {
    const backupDocuments = [];
    try {
      for (const updateDto of updateDtos) {
        const originalDocument = await this.imageModel
          .findById(updateDto._id)
          .exec()
          .catch(internalServerError);

        backupDocuments.push(originalDocument);

        await this.imageModel
          .updateOne({ _id: updateDto._id }, { $set: updateDto })
          .exec();
      }
      return { success: true };
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
