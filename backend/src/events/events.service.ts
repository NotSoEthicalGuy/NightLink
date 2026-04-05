import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateEventDto } from './dto/create-event.dto';

@Injectable()
export class EventsService {
    constructor(private prisma: PrismaService) { }

    async create(tenantId: string, dto: CreateEventDto) {
        // Fetch tenant for default ticket templates if none provided
        let ticketTypesData = dto.ticketTypes;
        if (!ticketTypesData || ticketTypesData.length === 0) {
            const tenant = await this.prisma.tenant.findUnique({
                where: { id: tenantId },
                select: { defaultTicketTemplates: true } as any
            });
            if (tenant && (tenant as any).defaultTicketTemplates) {
                // Map to remove any IDs or metadata from templates
                ticketTypesData = ((tenant as any).defaultTicketTemplates as any[]).map(t => ({
                    name: t.name,
                    description: t.description,
                    price: t.price,
                    totalQuantity: t.totalQuantity
                }));
            }
        }

        return this.prisma.event.create({
            data: {
                tenantId,
                name: dto.name,
                description: dto.description || '',
                eventDate: new Date(dto.eventDate),
                eventTime: dto.eventTime,
                venueName: dto.venueName,
                venueAddress: dto.venueAddress,
                coverImageUrl: dto.coverImageUrl,
                isPublished: dto.isPublished || false,
                isDraft: dto.isDraft !== undefined ? dto.isDraft : true,
                ticketTypes: {
                    create: ticketTypesData,
                },
            },
            include: {
                ticketTypes: true,
            },
        });
    }

    async duplicate(tenantId: string, id: string) {
        const source = await this.findOne(tenantId, id);

        return this.prisma.event.create({
            data: {
                tenantId,
                name: `${source.name} (Copy)`,
                description: source.description,
                eventDate: source.eventDate,
                eventTime: source.eventTime,
                venueName: source.venueName,
                venueAddress: source.venueAddress,
                coverImageUrl: source.coverImageUrl,
                isPublished: false,
                isDraft: true,
                ticketTypes: {
                    create: source.ticketTypes.map(tt => ({
                        name: tt.name,
                        description: tt.description,
                        price: tt.price,
                        totalQuantity: tt.totalQuantity,
                    })),
                },
            },
            include: {
                ticketTypes: true,
            },
        });
    }

    async findAll(tenantId: string) {
        return this.prisma.event.findMany({
            where: { tenantId },
            orderBy: { eventDate: 'asc' },
            include: {
                ticketTypes: true,
                _count: {
                    select: { reservations: true }
                }
            },
        });
    }

    async findOne(tenantId: string, id: string) {
        const event = await this.prisma.event.findFirst({
            where: { id, tenantId },
            include: {
                ticketTypes: true,
                reservations: true,
            },
        });

        if (!event) {
            throw new NotFoundException(`Event with ID ${id} not found`);
        }

        return event;
    }

    async update(tenantId: string, id: string, dto: any) {
        const event = await this.findOne(tenantId, id);

        return this.prisma.event.update({
            where: { id: event.id },
            data: {
                name: dto.name,
                description: dto.description,
                eventDate: dto.eventDate ? new Date(dto.eventDate) : undefined,
                eventTime: dto.eventTime,
                venueName: dto.venueName,
                venueAddress: dto.venueAddress,
                coverImageUrl: dto.coverImageUrl,
                isPublished: dto.isPublished,
                isDraft: dto.isDraft,
                ticketTypes: dto.ticketTypes ? {
                    deleteMany: {},
                    create: dto.ticketTypes,
                } : undefined,
            },
            include: {
                ticketTypes: true,
            },
        });
    }
}
