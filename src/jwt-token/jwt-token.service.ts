import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { JwtToken } from './schemas/jwt-token.schema';
import { Model } from 'mongoose';
import { JwtService } from '@nestjs/jwt';
import { internalServerError } from '@/helpers/utils';
import { JwtTokenPayloadDto } from './dto/jwt-token-payload.dto';

@Injectable()
export class JwtTokenService {
  constructor(
    @InjectModel(JwtToken.name) private jwtTokenModel: Model<JwtToken>,
    private readonly jwtService: JwtService,
  ) {}

  async createToken(payload: JwtTokenPayloadDto) {
    const token = await this.jwtService
      .signAsync(payload)
      .catch(internalServerError);

    const { _id } = await this.jwtTokenModel
      .create({ token })
      .catch(internalServerError);

    return _id.toString();
  }

  async verifyToken(tokenId: string) {
    const token = await this.jwtTokenModel
      .findById(tokenId)
      .lean()
      .catch(internalServerError);

    if (!token) {
      throw new NotFoundException('Token not found');
    }

    const tokenPayload = await this.jwtService
      .verifyAsync(token.token)
      .catch(internalServerError);

    return tokenPayload as JwtTokenPayloadDto;
  }
}
