import { IsString, IsOptional, IsArray, IsPhoneNumber } from 'class-validator';

export class CreateVerificationRequestDto {
    @IsString()
    fullName: string;

    @IsPhoneNumber()
    phoneNumber: string;

    @IsString()
    @IsOptional()
    instagramHandle?: string;

    @IsString()
    @IsOptional()
    clubsWorked?: string;

    @IsString()
    @IsOptional()
    notes?: string;

    @IsArray()
    @IsOptional()
    proofUrls?: string[];
}
