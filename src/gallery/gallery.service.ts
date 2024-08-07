import { Injectable, NotFoundException } from '@nestjs/common';
import { getRootPath, getUrlImg } from '@/helpers/utils';

import { CreateGalleryDto } from './dto/create-gallery.dto';
import { Image } from '@/typings/types';
import { Request } from 'express';
import { UpdateGalleryDto } from './dto/update-gallery.dto';
import { existsSync } from 'fs';

const data: Image[] = [];

@Injectable()
export class GalleryService {
  create(
    createGalleryDto: CreateGalleryDto,
    image: Express.Multer.File,
    resquest: Request
  ) {
    const protocol = resquest.protocol;
    const host = resquest.get('host');
    const url = getUrlImg(protocol, host, image.filename);

    const newImage = {
      id: crypto.randomUUID().toString(),
      title: createGalleryDto.title,
      description: createGalleryDto.description,
      imageUrl: url,
      createdAt: createGalleryDto.createdAt,
    };

    data.push(newImage);

    return newImage;
  }

  getImage(imgName: string) {
    const rootPath = getRootPath(imgName);
    const isExistFile = existsSync(rootPath);

    if (!isExistFile) {
      throw new NotFoundException('img not found');
    }

    return rootPath
  }

  findAll() {
    return data;
  }

  findOne(id: string) {
    return data.find((image) => image.id === id);
  }

  update(id: string, updateGalleryDto: UpdateGalleryDto) {
    return `This action updates a #${id} gallery`;
  }

  remove(id: string) {
    return data.filter((image) => image.id !== id);
  }
}
