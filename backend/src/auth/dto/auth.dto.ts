import { IsEmail, IsNotEmpty, IsString, MinLength, Matches } from 'class-validator';

export class SignupDto {
    @IsNotEmpty()
    @IsString()
    @MinLength(2)
    name: string;

    @IsNotEmpty()
    @IsEmail()
    email: string;

    @IsNotEmpty()
    @IsString()
    @MinLength(3)
    @Matches(/^[a-z0-9-]+$/, {
        message: 'Username can only contain lowercase letters, numbers, and hyphens',
    })
    slug: string;

    @IsNotEmpty()
    @IsString()
    @MinLength(6)
    password: string;

    @IsNotEmpty()
    @IsString()
    whatsapp: string;

    @IsNotEmpty()
    @IsString()
    preferredPaymentMethod: string;

    @IsNotEmpty()
    @IsString()
    otpCode: string;
}

export class RequestOtpDto {
    @IsNotEmpty()
    @IsEmail()
    email: string;
}

export class VerifyOtpDto {
    @IsNotEmpty()
    @IsEmail()
    email: string;

    @IsNotEmpty()
    @IsString()
    @MinLength(6)
    code: string;
}

export class LoginDto {
    @IsNotEmpty()
    @IsEmail()
    email: string;

    @IsNotEmpty()
    @IsString()
    password: string;
}

export class ResetPasswordDto {
    @IsNotEmpty()
    @IsEmail()
    email: string;

    @IsNotEmpty()
    @IsString()
    @MinLength(6)
    code: string;

    @IsNotEmpty()
    @IsString()
    @MinLength(6)
    newPassword: string;
}
