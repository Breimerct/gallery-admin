import {
  ArgumentMetadata,
  BadRequestException,
  HttpStatus,
  Injectable,
  InternalServerErrorException,
  PipeTransform,
} from '@nestjs/common';

import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';

@Injectable()
export class ValidationPipeTransform implements PipeTransform<any> {
  async transform(value: any, { metatype }: ArgumentMetadata) {
    let object = value;

    if (!metatype || !this.toValidate(metatype)) {
      return value;
    }

    try {
      object = plainToInstance(metatype, value);
    } catch (error) {
      throw new InternalServerErrorException();
    }

    const errors = await validate(object);
    if (errors.length > 0) {
      const errorMessages = this.formatErrors(errors);
      throw new BadRequestException({
        message: 'Input data validation failed',
        errors: errorMessages,
        statusCode: HttpStatus.BAD_REQUEST,
      });
    }

    return object;
  }

  private toValidate(metatype: Function): boolean {
    const types: Function[] = [String, Boolean, Number, Array, Object];
    return !types.includes(metatype);
  }

  private formatErrors(errors: any[]) {
    return errors.flatMap(err =>
      Object.values(err.constraints).map(constraint => ({
        field: err.property,
        errorMessage: constraint,
      })),
    );
  }
}
