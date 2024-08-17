import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

import { HydratedDocument } from 'mongoose';

export type jwtTokenDocument = HydratedDocument<JwtToken>;

@Schema({
  versionKey: false,
  timestamps: true,
})
export class JwtToken {
  @Prop({ required: true })
  token: string;

  @Prop({ required: true })
  userId: string;

  @Prop({ required: false, default: false })
  isUsed: string;
}

export const JwtTokenSchema = SchemaFactory.createForClass(JwtToken);
