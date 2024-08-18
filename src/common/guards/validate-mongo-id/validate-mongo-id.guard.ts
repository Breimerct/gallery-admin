import {
  BadRequestException,
  CanActivate,
  ExecutionContext,
  Injectable,
} from '@nestjs/common';

import { Request } from 'express';
import mongoose from 'mongoose';
import { validateMongoId } from '@/helpers/utils';

@Injectable()
export class ValidateMongoIdGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<Request>();
    const mongoId: string = String(request.params?.id || request.query?.id);

    validateMongoId(mongoId);

    return true;
  }
}
