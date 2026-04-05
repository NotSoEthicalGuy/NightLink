import { Controller, Get, Post, Body, UseGuards, Request } from '@nestjs/common';
import { VerificationService } from './verification.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CreateVerificationRequestDto } from './dto/create-verification-request.dto';

@Controller('verification')
@UseGuards(JwtAuthGuard)
export class VerificationController {
    constructor(private verificationService: VerificationService) { }

    @Post('request')
    createRequest(@Request() req, @Body() dto: CreateVerificationRequestDto) {
        return this.verificationService.createRequest(req.user.id, dto);
    }

    @Get('my-status')
    getMyStatus(@Request() req) {
        return this.verificationService.getMyRequest(req.user.id);
    }
}
