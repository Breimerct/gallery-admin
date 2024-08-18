import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { JwtToken } from './schemas/jwt-token.schema';
import { Model } from 'mongoose';
import { JwtService } from '@nestjs/jwt';
import { internalServerError } from '@/helpers/utils';
import { JWT_SECRET_KEY, twoWeeksFromNow } from '@/constants';
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

    const token = await this.jwtTokenModel.findOne({ userId }).lean();

    const tokenString = await this.jwtService
      .signAsync({ userId }, { expiresIn: expiresIn })
      .catch(internalServerError);

    if (!!token) {
      await this.jwtTokenModel.findByIdAndUpdate(token._id, {
        $set: {
          token: tokenString,
          expirationDate,
        },
      });

      return token._id.toString();
    }

    const { _id } = await this.jwtTokenModel
      .create({ token: tokenString, userId, expirationDate })
      .catch(internalServerError);

    return _id.toString();
  }

  async verifyToken(tokenId: string): Promise<string> {
    const { token, ...rest } = await this.jwtTokenModel
      .findById(tokenId)
      .lean()
      .catch(internalServerError);

    if (!token) {
      throw new NotFoundException('Token not found');
    }

    const { userId } = await this.jwtService
      .verifyAsync(token, {
        secret: JWT_SECRET_KEY,
      })
      .catch(() => {
        throw new UnauthorizedException('Invalid token or token expired');
      });

    await this.jwtTokenModel.findByIdAndUpdate(tokenId, {
      $set: {
        expirationDate: twoWeeksFromNow,
      },
    });

    return userId;
  }

  async deleteToken(tokenId: string) {
    await this.jwtTokenModel
      .findByIdAndDelete(tokenId)
      .catch(internalServerError);

    return true;
  }
}
