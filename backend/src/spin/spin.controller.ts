import { Controller, Get, Post, Patch, Body, UseGuards, Request } from '@nestjs/common';
import { SpinService } from './spin.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { UserRole } from '@prisma/client';

@Controller('spin')
@UseGuards(JwtAuthGuard)
export class SpinController {
    constructor(private spinService: SpinService) { }

    @Get('status')
    getStatus(@Request() req) {
        return this.spinService.getStatus(req.user.id);
    }

    @Post()
    spin(@Request() req) {
        return this.spinService.spin(req.user.id);
    }

    // Admin endpoints
    @Get('admin/config')
    @UseGuards(RolesGuard)
    @Roles(UserRole.ADMIN)
    getConfig() {
        return this.spinService.getConfig();
    }

    @Patch('admin/config')
    @UseGuards(RolesGuard)
    @Roles(UserRole.ADMIN)
    updateConfig(@Body() body: any) {
        return this.spinService.updateConfig(body);
    }

    @Get('admin/logs')
    @UseGuards(RolesGuard)
    @Roles(UserRole.ADMIN)
    getLogs() {
        return this.spinService.getLogs();
    }

    @Get('admin/rewards')
    @UseGuards(RolesGuard)
    @Roles(UserRole.ADMIN)
    getRewardLogs() {
        return this.spinService.getRewardLogs();
    }

    @Post('admin/grant')
    @UseGuards(RolesGuard)
    @Roles(UserRole.ADMIN)
    grantReward(@Body() body: { tenantId: string; rewardType: string }, @Request() req) {
        return this.spinService.grantManualReward(body.tenantId, body.rewardType, req.user.id);
    }

    @Post('admin/grant-spins')
    @UseGuards(RolesGuard)
    @Roles(UserRole.ADMIN)
    grantSpins(@Body() body: { tenantId: string; amount: number }) {
        return this.spinService.grantExtraSpins(body.tenantId, body.amount || 1);
    }
}
