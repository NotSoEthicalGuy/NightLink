import { IsString, IsOptional, IsObject, IsUrl } from 'class-validator';

export class UpdateProfileDto {
    @IsOptional()
    @IsString()
    displayName?: string;

    @IsOptional()
    @IsString()
    bio?: string;

    @IsOptional()
    @IsString()
    photoUrl?: string;

    @IsOptional()
    @IsString()
    coverMediaUrl?: string;

    @IsOptional()
    @IsString()
    coverMediaType?: string;

    @IsOptional()
    @IsObject()
    contactInfo?: any;

    // Fields for the Tenant (account) information
    @IsOptional()
    @IsString()
    name?: string;

    @IsOptional()
    @IsString()
    email?: string;

    @IsOptional()
    @IsString()
    slug?: string;
}
