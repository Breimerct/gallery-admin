import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiOperation,
  ApiParam,
  ApiResponse,
} from '@nestjs/swagger';
import { HttpStatus, applyDecorators } from '@nestjs/common';

import { ImageResponseDto } from '../dto/image.response.dto';
import { ResponseMessageDto } from '@/common/dto/response-message.dto';
import { UpdateGalleryDto } from '../dto/update-gallery.dto';

export function CreateImageDoc() {
  return applyDecorators(
    ApiBearerAuth(),
    ApiConsumes('multipart/form-data'),
    ApiOperation({
      summary: 'Create image',
      description: 'Create image',
    }),
    ApiResponse({
      status: HttpStatus.CREATED,
      description: 'Image has been successfully created',
      type: ImageResponseDto,
    }),
  );
}

export function GetAllImagesDoc() {
  return applyDecorators(
    ApiOperation({
      summary: 'Get all images',
      description: 'Get all images',
    }),
    ApiResponse({
      status: HttpStatus.OK,
      description: 'Images have been successfully found',
      type: [ImageResponseDto],
    }),
    ApiParam({
      name: 'id',
      type: 'string',
      required: true,
      example: '60f7b5d9e0b4c5f1f0e3c4b7',
      description: 'User id',
    }),
  );
}

export function GetOneImageDoc() {
  return applyDecorators(
    ApiBearerAuth(),
    ApiOperation({
      summary: 'Get one image',
      description: 'Get one image by id',
    }),
    ApiResponse({
      status: HttpStatus.OK,
      description: 'Image has been successfully found',
      type: ImageResponseDto,
    }),
  );
}

export function UpdateImageDoc() {
  return applyDecorators(
    ApiBearerAuth(),
    ApiOperation({
      summary: 'Update image',
      description: 'Update image by id',
    }),
    ApiResponse({
      status: HttpStatus.OK,
      description: 'Image has been successfully updated',
      type: ImageResponseDto,
    }),
  );
}

export function RemoveImageDoc() {
  return applyDecorators(
    ApiBearerAuth(),
    ApiOperation({
      summary: 'Delete image',
      description: 'Delete image by id',
    }),
    ApiResponse({
      status: HttpStatus.OK,
      description: 'Image has been successfully deleted',
      type: ImageResponseDto,
    }),
  );
}

export function UpdateManyDoc() {
  return applyDecorators(
    ApiBearerAuth(),
    ApiOperation({
      summary: 'Update many images',
      description: 'Update many images at once',
    }),
    ApiResponse({
      status: HttpStatus.OK,
      description: 'Images have been successfully updated',
      type: ResponseMessageDto,
    }),
    ApiBody({
      type: [UpdateGalleryDto],
    }),
  );
}

export function GetImageFileDoc() {
  return applyDecorators(
    ApiOperation({ summary: 'Get image file' }),
    ApiResponse({
      status: HttpStatus.OK,
      description: 'Image has been successfully found',
    }),
    ApiParam({
      name: 'imgName',
      type: 'string',
      required: true,
      example: `${Date.now()}.webp`,
    }),
  );
}
