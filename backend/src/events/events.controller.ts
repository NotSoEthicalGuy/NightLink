import { Controller, Get, Post, Body, Param, UseGuards, Request, Patch } from '@nestjs/common';
import { EventsService } from './events.service';
import { CreateEventDto } from './dto/create-event.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('events')
@UseGuards(JwtAuthGuard)
export class EventsController {
    constructor(private readonly eventsService: EventsService) { }

    @Post()
    create(@Request() req, @Body() createEventDto: CreateEventDto) {
        return this.eventsService.create(req.user.id, createEventDto);
    }

    @Get()
    findAll(@Request() req) {
        return this.eventsService.findAll(req.user.id);
    }

    @Get(':id')
    findOne(@Request() req, @Param('id') id: string) {
        return this.eventsService.findOne(req.user.id, id);
    }

    @Patch(':id')
    update(@Request() req, @Param('id') id: string, @Body() updateEventDto: CreateEventDto) {
        return this.eventsService.update(req.user.id, id, updateEventDto);
    }

    @Post(':id/duplicate')
    duplicate(@Request() req, @Param('id') id: string) {
        return this.eventsService.duplicate(req.user.id, id);
    }
}
