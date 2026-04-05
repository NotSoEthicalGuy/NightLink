import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class DashboardService {
    constructor(private prisma: PrismaService) { }

    async getStats(tenantId: string) {
        const totalEvents = await this.prisma.event.count({
            where: { tenantId }
        });

        const activeReservations = await this.prisma.reservation.count({
            where: {
                tenantId,
                status: { in: ['PENDING_PAYMENT', 'PAID_CONFIRMED'] }
            }
        });

        const confirmedSalesData = await this.prisma.reservation.aggregate({
            where: {
                tenantId,
                status: 'PAID_CONFIRMED'
            },
            _sum: {
                totalAmount: true
            }
        });

        const totalSales = confirmedSalesData._sum.totalAmount || 0;

        const recentReservations = await this.prisma.reservation.findMany({
            where: { tenantId },
            orderBy: { createdAt: 'desc' },
            take: 5,
            include: { event: true, ticketType: true }
        });

        const upcomingEvents = await this.prisma.event.findMany({
            where: {
                tenantId,
                eventDate: { gte: new Date() }
            },
            orderBy: { eventDate: 'asc' },
            take: 5,
            include: {
                ticketTypes: true,
                _count: {
                    select: { reservations: true }
                }
            }
        });

        return {
            stats: {
                totalEvents,
                activeReservations,
                totalSales,
                websiteVisits: 0
            },
            recentReservations,
            upcomingEvents
        };
    }

    async getAnalytics(tenantId: string, startDate?: Date, endDate?: Date) {
        const whereClause: any = { tenantId };
        if (startDate || endDate) {
            whereClause.createdAt = {};
            if (startDate) whereClause.createdAt.gte = startDate;
            if (endDate) whereClause.createdAt.lte = endDate;
        }

        const [
            totalReservations,
            confirmedReservations,
            pendingPayments,
            expiredReservations,
            canceledReservations,
            events,
            whatsappClicks,
            paymentViews
        ] = await Promise.all([
            this.prisma.reservation.count({ where: whereClause }),
            this.prisma.reservation.count({ where: { ...whereClause, status: 'PAID_CONFIRMED' } }),
            this.prisma.reservation.count({ where: { ...whereClause, status: 'PENDING_PAYMENT' } }),
            this.prisma.reservation.count({ where: { ...whereClause, status: 'EXPIRED' } }),
            this.prisma.reservation.count({ where: { ...whereClause, status: 'CANCELLED' } }),
            this.prisma.event.findMany({
                where: { tenantId },
                include: {
                    _count: { select: { reservations: true } },
                    ticketTypes: true
                }
            }),
            this.prisma.analyticsEvent.count({ where: { tenantId, type: 'WHATSAPP_CLICK', ...(startDate || endDate ? { createdAt: whereClause.createdAt } : {}) } }),
            this.prisma.analyticsEvent.count({ where: { tenantId, type: 'PAYMENT_VIEW', ...(startDate || endDate ? { createdAt: whereClause.createdAt } : {}) } })
        ]);

        const eventPerformance = events.map(event => {
            const totalAllocated = event.ticketTypes.reduce((acc, t) => acc + t.totalQuantity, 0);
            const totalReserved = event.ticketTypes.reduce((acc, t) => acc + t.reservedQuantity, 0);
            const totalSold = event.ticketTypes.reduce((acc, t) => acc + t.soldQuantity, 0);
            const remaining = totalAllocated - totalReserved - totalSold;

            let status = 'Active';
            if (new Date(event.eventDate) < new Date()) status = 'Ended';
            else if (remaining <= 0) status = 'Sold out';

            return {
                id: event.id,
                name: event.name,
                date: event.eventDate,
                allocated: totalAllocated,
                reserved: totalReserved,
                confirmed: totalSold,
                remaining,
                status
            };
        });

        const soldOutCount = eventPerformance.filter(e => e.status === 'Sold out').length;
        const totalTicketsRemaining = eventPerformance.reduce((acc, e) => acc + Math.max(0, e.remaining), 0);

        const funnel = {
            created: totalReservations,
            pending: pendingPayments,
            confirmed: confirmedReservations,
            lost: expiredReservations + canceledReservations
        };

        const ticketTypes = await this.prisma.ticketType.findMany({
            where: { event: { tenantId } },
            orderBy: { soldQuantity: 'desc' },
            take: 10,
            include: { event: { select: { name: true } } }
        });

        const todayStart = new Date();
        todayStart.setHours(0, 0, 0, 0);

        const [
            todayReservations,
            todayConfirmed,
            todayExpired
        ] = await Promise.all([
            this.prisma.reservation.count({ where: { tenantId, createdAt: { gte: todayStart } } }),
            this.prisma.reservation.count({ where: { tenantId, status: 'PAID_CONFIRMED', confirmedAt: { gte: todayStart } } }),
            this.prisma.reservation.count({ where: { tenantId, status: 'EXPIRED', updatedAt: { gte: todayStart } } })
        ]);

        return {
            summary: {
                totalReservations,
                confirmedReservations,
                pendingPayments,
                ticketsRemaining: totalTicketsRemaining,
                soldOutEvents: soldOutCount,
                today: {
                    reservations: todayReservations,
                    confirmed: todayConfirmed,
                    expired: todayExpired
                }
            },
            eventPerformance,
            funnel,
            insights: {
                whatsappClicks,
                paymentViews
            },
            topTicketTypes: ticketTypes.map(t => ({
                name: `${t.name} (${t.event.name})`,
                reserved: t.reservedQuantity,
                confirmed: t.soldQuantity,
                remaining: t.totalQuantity - t.reservedQuantity - t.soldQuantity
            }))
        };
    }
}
