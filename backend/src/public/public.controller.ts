import { Controller, Get, Param, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Controller('public')
export default class PublicController {
    constructor(private prisma: PrismaService) { }

    @Get('site/:slug')
    async getSiteData(@Param('slug') slug: string) {
        const tenant = await this.prisma.tenant.findUnique({
            where: { slug },
            include: {
                profile: true,
                siteConfig: true,
            },
        });

        if (!tenant) {
            throw new NotFoundException('Site not found');
        }

        const events = await this.prisma.event.findMany({
            where: {
                tenantId: tenant.id,
                isPublished: true,
            },
            orderBy: {
                eventDate: 'asc',
            },
        });

        return {
            tenant: {
                name: tenant.name,
                slug: tenant.slug,
                profile: tenant.profile,
                isVerified: tenant.isVerified,
                role: tenant.role,
            },
            config: tenant.siteConfig,
            events,
        };
    }

    @Get('event/:id')
    async getEventData(@Param('id') id: string) {
        const event = await this.prisma.event.findUnique({
            where: { id },
            include: {
                ticketTypes: true,
                tenant: {
                    include: {
                        profile: true,
                        siteConfig: true
                    }
                }
            }
        });

        if (!event) {
            throw new NotFoundException('Event not found');
        }

        return event;
    }

    @Get('track/:tenantId/:type')
    async trackEvent(
        @Param('tenantId') tenantId: string,
        @Param('type') type: string
    ) {
        await this.prisma.analyticsEvent.create({
            data: {
                tenantId,
                type
            }
        });
        return { success: true };
    }
}
