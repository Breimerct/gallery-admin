import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { JwtToken } from './schemas/jwt-token.schema';
import { Model } from 'mongoose';
import { JwtService } from '@nestjs/jwt';
import { internalServerError, validateMongoId } from '@/helpers/utils';
import { JWT_SECRET_KEY } from '@/constants';
import { EXPIRATION_OPTIONS } from '@/constants/expirationOptions';

@Injectable()
export class JwtTokenService {
  constructor(
    @InjectModel(JwtToken.name) private jwtTokenModel: Model<JwtToken>,
    private readonly jwtService: JwtService,
  ) {}

  async createToken(
    userId: string,
    expiresInOption: keyof typeof EXPIRATION_OPTIONS = '2w',
  ) {
    const { expiresIn, expirationDate } = EXPIRATION_OPTIONS[expiresInOption];

    const tokenString = await this.jwtService
      .signAsync({ userId }, { expiresIn: expiresIn })
      .catch(internalServerError);

    const { _id } = await this.jwtTokenModel
      .create({ token: tokenString, userId, expirationDate })
      .catch(internalServerError);

    return _id.toString();
  }

  async verifyToken(tokenId: string): Promise<string> {
    validateMongoId(tokenId);

    const token = await this.findOneToken({ _id: tokenId });

    if (!token) {
      throw new NotFoundException('Token not found');
    }

    const { userId } = await this.verifyTokenString(token.token).catch(
      () => {
        this.deleteToken(tokenId);
        throw new UnauthorizedException('Invalid or expired token');
      },
    );

    return userId;
  }

  async findOneToken(fields: Partial<JwtToken & { _id: string }>) {
    const token = await this.jwtTokenModel
      .findOne(fields)
      .lean()
      .catch(internalServerError);

    console.log(token);

    return token;
  }

  generateToken(userId: string, expiresIn: string) {
    return this.jwtService
      .signAsync({ userId }, { expiresIn })
      .catch(internalServerError);
  }

  verifyTokenString(token: string) {
    return this.jwtService.verifyAsync<{ userId: string }>(token, {
      secret: JWT_SECRET_KEY,
    });
  }

  async deleteToken(tokenId: string) {
    await this.jwtTokenModel
      .findByIdAndDelete(tokenId)
      .catch(internalServerError);

    return true;
  }
}
