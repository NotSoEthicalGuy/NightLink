import { IsString, IsOptional, IsBoolean, IsObject } from 'class-validator';

export class UpdateSiteConfigDto {
    @IsOptional()
    @IsString()
    templateId?: string;

    @IsOptional()
    @IsString()
    colorPalette?: string;

    @IsOptional()
    @IsString()
    fontFamily?: string;

    @IsOptional()
    sectionsVisibility?: any;

    @IsOptional()
    @IsBoolean()
    isPublished?: boolean;

    @IsOptional()
    @IsString()
    googleAnalyticsId?: string;

    @IsOptional()
    @IsString()
    facebookPixelId?: string;

    @IsOptional()
    @IsString()
    logoUrl?: string;

    @IsOptional()
    @IsString()
    secondaryColor?: string;

    @IsOptional()
    themeConfig?: any;
}
