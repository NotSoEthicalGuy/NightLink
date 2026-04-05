import { Controller, Post, Get, Body, HttpCode, HttpStatus, UseGuards, Request } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto, SignupDto, RequestOtpDto, VerifyOtpDto, ResetPasswordDto } from './dto/auth.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
import { JwtAuthGuard } from './jwt-auth.guard';

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) { }

    @Post('request-otp')
    @HttpCode(HttpStatus.OK)
    async requestOtp(@Body() dto: RequestOtpDto) {
        return this.authService.requestSignupOtp(dto);
    }

    @Post('resend-otp')
    @HttpCode(HttpStatus.OK)
    async resendOtp(@Body() dto: RequestOtpDto) {
        return this.authService.resendOtp(dto);
    }

    @Post('verify-otp')
    @HttpCode(HttpStatus.OK)
    async verifyOtp(@Body() dto: VerifyOtpDto) {
        return this.authService.verifyOtp(dto);
    }

    @Post('signup')
    async signup(@Body() dto: SignupDto) {
        return this.authService.signup(dto);
    }

    @Post('login')
    @HttpCode(HttpStatus.OK)
    async login(@Body() dto: LoginDto) {
        return this.authService.login(dto);
    }

    @Post('forgot-password')
    @HttpCode(HttpStatus.OK)
    async forgotPassword(@Body() dto: RequestOtpDto) {
        return this.authService.requestForgotPasswordOtp(dto);
    }

    @Post('verify-forgot-password')
    @HttpCode(HttpStatus.OK)
    async verifyForgotPassword(@Body() dto: VerifyOtpDto) {
        return this.authService.verifyOtp(dto);
    }

    @Post('reset-password')
    @HttpCode(HttpStatus.OK)
    async resetPassword(@Body() dto: ResetPasswordDto) {
        return this.authService.resetPassword(dto);
    }

    @Post('change-password')
    @UseGuards(JwtAuthGuard)
    @HttpCode(HttpStatus.OK)
    async changePassword(@Request() req, @Body() dto: ChangePasswordDto) {
        return this.authService.changePassword(req.user.id, dto.oldPassword, dto.newPassword);
    }

    @Post('verify-password')
    @UseGuards(JwtAuthGuard)
    @HttpCode(HttpStatus.OK)
    async verifyPassword(@Request() req, @Body() dto: { password: string }) {
        return this.authService.verifyPassword(req.user.id, dto.password);
    }

    @Get('me')
    @UseGuards(JwtAuthGuard)
    async getMe(@Request() req) {
        return this.authService.validateUser(req.user.id);
    }

    @Post('simulate-payment')
    @UseGuards(JwtAuthGuard)
    @HttpCode(HttpStatus.OK)
    async simulatePayment(@Request() req, @Body() dto: { plan: 'STANDARD' | 'PREMIUM' }) {
        return this.authService.simulatePayment(req.user.id, dto.plan);
    }
}
