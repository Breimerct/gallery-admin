import {
  BadRequestException,
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';

import { Observable } from 'rxjs';
import { Request } from 'express';
import { extname } from 'path';
import { unlinkSync } from 'fs';

@Injectable()
export class ValidateFileInterceptor implements NestInterceptor {
  async intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Promise<Observable<any>> {
    const request = context.switchToHttp().getRequest<Request>();
    const { path: pathFile, size: sizeFile, originalname } = request.file;
    const fileExtName = extname(originalname);

    try {
      if (!originalname.match(/\.(jpg|png|jpeg)$/)) {
        throw new BadRequestException(
          `file extension ${fileExtName} not allowed!`,
          { description: 'Only .png, .jpg or .jpeg' },
        );
      }
    } catch (error) {
      unlinkSync(pathFile);
      throw error;
    }

    return next.handle();
  }
}
