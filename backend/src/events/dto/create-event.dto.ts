import { IsNotEmpty, IsString, IsDateString, IsOptional, ValidateNested, IsBoolean, IsArray, IsNumber, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateTicketTypeDto {
    @IsNotEmpty()
    @IsString()
    name: string;

    @IsOptional()
    @IsString()
    description?: string;

    @IsNotEmpty()
    @IsNumber()
    @Min(0)
    price: number;

    @IsNotEmpty()
    @IsNumber()
    @Min(1)
    totalQuantity: number;
}

export class CreateEventDto {
    @IsNotEmpty()
    @IsString()
    name: string;

    @IsOptional()
    @IsString()
    description?: string;

    @IsNotEmpty()
    @IsDateString()
    eventDate: string; // ISO 8601

    @IsNotEmpty()
    @IsString()
    eventTime: string;

    @IsNotEmpty()
    @IsString()
    venueName: string;

    @IsNotEmpty()
    @IsString()
    venueAddress: string;

    @IsOptional()
    @IsString()
    coverImageUrl?: string;

    @IsOptional()
    @IsBoolean()
    isPublished?: boolean;

    @IsOptional()
    @IsBoolean()
    isDraft?: boolean;

    @IsOptional()
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => CreateTicketTypeDto)
    ticketTypes?: CreateTicketTypeDto[];
}
