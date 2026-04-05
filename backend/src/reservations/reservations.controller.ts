import { Controller, Post, Get, Patch, Param, Body, UseGuards, Request, NotFoundException } from '@nestjs/common';
import { ReservationsService } from './reservations.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('reservations')
export class ReservationsController {
    constructor(private readonly reservationsService: ReservationsService) { }

    @Post()
    create(@Body() dto: any) {
        return this.reservationsService.create(dto);
    }

    @Get('code/:code')
    findByCode(@Param('code') code: string) {
        return this.reservationsService.findByCode(code);
    }

    @Post(':id/cancel')
    cancel(@Param('id') id: string) {
        return this.reservationsService.cancel(id);
    }

    // PR Endpoints
    @Get('manage')
    @UseGuards(JwtAuthGuard)
    findAll(@Request() req) {
        return this.reservationsService.findAllForPR(req.user.id);
    }

    @Patch(':id/status')
    @UseGuards(JwtAuthGuard)
    updateStatus(@Request() req, @Param('id') id: string, @Body('status') status: string) {
        return this.reservationsService.updateStatus(req.user.id, id, status);
    }

    @Get('export-csv/:eventId')
    @UseGuards(JwtAuthGuard)
    async exportCsv(@Request() req, @Param('eventId') eventId: string) {
        return this.reservationsService.getEventReservationsCsv(req.user.id, eventId);
    }
}
