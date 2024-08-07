import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";

import { IsDate, IsString } from "class-validator";

export class CreateGalleryDto {
    constructor(partial: Partial<CreateGalleryDto>) {
        Object.assign(this, partial);
    }

    @ApiProperty({ default: 'This is a title' })
    @IsString({ message: 'Title must be a string' })
    title: string;

    @ApiPropertyOptional({ default: 'This is a description' })
    @IsString({ message: 'Description must be a string' })
    description: string;

    @ApiPropertyOptional({ default: new Date() })
    @IsDate({ message: 'Date must be a date' })
    createdAt: Date;

    @ApiProperty({ type: 'string', format: 'binary', required: true })
    image: string;
}
