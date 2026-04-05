import { Controller, Get, UseGuards, Request, Query } from '@nestjs/common';
import { DashboardService } from './dashboard.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('dashboard')
@UseGuards(JwtAuthGuard)
export class DashboardController {
    constructor(private readonly dashboardService: DashboardService) { }

    @Get('stats')
    getStats(@Request() req) {
        return this.dashboardService.getStats(req.user.id);
    }

    @Get('analytics')
    getAnalytics(
        @Request() req,
        @Query() query: { startDate?: string; endDate?: string }
    ) {
        const start = query.startDate ? new Date(query.startDate) : undefined;
        const end = query.endDate ? new Date(query.endDate) : undefined;
        return this.dashboardService.getAnalytics(req.user.id, start, end);
    }
}
