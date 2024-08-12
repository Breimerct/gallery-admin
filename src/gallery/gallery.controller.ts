import { ValidationPipeTransform } from '@/common/pipe/ValidationPipeTransform';
import { rootPath } from '@/constants';
import { editFileName } from '@/helpers/utils';
import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  Patch,
  Post,
  Req,
  Res,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Request, Response } from 'express';
import { diskStorage } from 'multer';
import { CreateGalleryDto } from './dto/create-gallery.dto';
import { UpdateGalleryDto } from './dto/update-gallery.dto';
import { GalleryService } from './gallery.service';
import { ImageResponseDto } from './dto/image.response.dto';
import { ResponseMessageDto } from '@/common/dto/response-message.dto';
import { AuthGuard } from '@/auth/guard/auth.guard';
import { ValidateFileInterceptor } from './interceptor/validate-file/validate-file.interceptor';
import { ValidateMongoIdGuard } from '@/common/guards/validate-mongo-id/validate-mongo-id.guard';

@Controller('gallery')
@ApiBearerAuth()
@ApiTags('Gallery')
@UseInterceptors(ClassSerializerInterceptor)
export class GalleryController {
  constructor(private readonly galleryService: GalleryService) {}

  @Post('image')
  @UseGuards(AuthGuard)
  @ApiOperation({
    summary: 'Create image',
    description: 'Create image',
  })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Image has been successfully created',
    type: ImageResponseDto,
  })
  @UseInterceptors(ValidateFileInterceptor)
  @UseInterceptors(
    FileInterceptor('image', {
      storage: diskStorage({
        destination: rootPath,
        filename: editFileName,
      }),
    }),
  )
  @ApiConsumes('multipart/form-data')
  create(
    @Body(new ValidationPipeTransform()) createGalleryDto: CreateGalleryDto,
    @UploadedFile() image: Express.Multer.File,
    @Req() request: Request,
  ) {
    return this.galleryService.create(createGalleryDto, image, request);
  }

  @Get('image/:imgName')
  @ApiOperation({ summary: 'Get image file' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Image has been successfully found',
  })
  @ApiParam({
    name: 'imgName',
    type: 'string',
    required: true,
    example: `${Date.now()}.webp`,
  })
  getImage(@Param('imgName') imgName: string, @Res() res: Response) {
    const imagePath = this.galleryService.getImage(imgName);

    res.sendFile(imagePath);
  }

  @Get('images/:id')
  @UseGuards(ValidateMongoIdGuard)
  @ApiOperation({
    summary: 'Get all images',
    description: 'Get all images',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Images have been successfully found',
    type: [ImageResponseDto],
  })
  @ApiParam({
    name: 'id',
    type: 'string',
    required: true,
    example: '60f7b5d9e0b4c5f1f0e3c4b7',
    description: 'User id',
  })
  findAll(@Param('id') userId: string) {
    return this.galleryService.findAllByUserId(userId);
  }

  @Get('image/:id')
  @UseGuards(AuthGuard)
  @UseGuards(ValidateMongoIdGuard)
  @ApiOperation({
    summary: 'Get one image',
    description: 'Get one image by id',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Image has been successfully found',
    type: ImageResponseDto,
  })
  findOne(@Param('id') id: string) {
    return this.galleryService.findOne(id);
  }

  @Patch('images/update-many')
  @UseGuards(AuthGuard)
  @ApiOperation({
    summary: 'Update many images',
    description: 'Update many images at once',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Images have been successfully updated',
    type: ResponseMessageDto,
  })
  @ApiBody({
    type: [UpdateGalleryDto],
  })
  updateMany(@Body() updateGalleryDto: UpdateGalleryDto[]) {
    return this.galleryService.updateMany(updateGalleryDto);
  }

  @Patch('image:id')
  @UseGuards(AuthGuard)
  @UseGuards(ValidateMongoIdGuard)
  @ApiOperation({
    summary: 'Update image',
    description: 'Update image by id',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Image has been successfully updated',
    type: ImageResponseDto,
  })
  update(@Param('id') id: string, @Body() updateGalleryDto: UpdateGalleryDto) {
    return this.galleryService.update(id, updateGalleryDto);
  }

  @Delete('image/:id')
  @UseGuards(AuthGuard)
  @UseGuards(ValidateMongoIdGuard)
  @ApiOperation({
    summary: 'Delete image',
    description: 'Delete image by id',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Image has been successfully deleted',
    type: ImageResponseDto,
  })
  remove(@Param('id') id: string) {
    return this.galleryService.remove(id);
  }
}
