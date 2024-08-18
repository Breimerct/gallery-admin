import * as bcrypt from 'bcrypt';

import {
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';

import { Request } from 'express';
import mongoose from 'mongoose';
import { rootPath } from '@/constants';

export const editFileName = (
  request: Request,
  file: Express.Multer.File,
  callback: (message: Error, fileName: string) => void,
) => {
  callback(null, `${Date.now()}.webp`);
};

export const getUrlImg = (protocol: string, host: string, fileName: string) => {
  const fullUrl = [`${protocol}://`, host, `/api/v1/gallery/image/`, fileName];

  return fullUrl.join('');
};

export const getRootPath = (fileName: string) => {
  const _rootPath = `${rootPath}/${fileName}`;

  return _rootPath;
};

export const internalServerError = <T>(error: T) => {
  console.log(error);
  throw new InternalServerErrorException(error);
};

export const toLowerCaseObject = <T>(
  object: T,
  exclude: Array<string> = ['password'],
): T => {
  const excludeSet = new Set(exclude);

  const transformedEntries = Object.entries(object).map(([key, value]) => {
    if (excludeSet.has(key)) {
      return [key, value];
    }

    if (typeof value === 'string') {
      return [key, value.toLowerCase()];
    }

    return [key, value];
  });

  return Object.fromEntries(transformedEntries) as T;
};

export const hashPassword = async (password: string) => {
  if (!password) {
    throw new BadRequestException('password required');
  }

  const salt = await bcrypt.genSalt(Number(process.env.SALT_OR_ROUNDS));
  const passwordHash = await bcrypt.hash(password, salt);

  return passwordHash;
};

export const validatePassword = async (
  password: string,
  hashPassword: string,
) => {
  if (!password) {
    throw new BadRequestException('password required');
  }

  if (!hashPassword) {
    throw new BadRequestException('hashPassword required');
  }

  return await bcrypt.compare(password, hashPassword);
};

export const validateMongoId = (mongoId: string) => {
  if (!mongoose.Types.ObjectId.isValid(mongoId)) {
    throw new BadRequestException(`id ${mongoId} is invalid`);
  }
};
