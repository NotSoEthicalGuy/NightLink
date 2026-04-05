import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { VerificationStatus } from '@prisma/client';

@Injectable()
export class AdminService {
    constructor(private prisma: PrismaService) { }

    async logAction(adminId: string, action: string, targetType: string, targetId: string, details?: any) {
        return this.prisma.adminLog.create({
            data: {
                adminId,
                action,
                targetType,
                targetId,
                details: details || {},
            }
        });
    }

    // PR Management
    async getAllTenants() {
        return this.prisma.tenant.findMany({
            select: {
                id: true,
                name: true,
                slug: true,
                email: true,
                isVerified: true,
                isDeactivated: true,
                subscriptionExpiresAt: true,
                availableSpins: true,
                profile: true,
                _count: {
                    select: { events: true, reservations: true }
                }
            } as any,
            orderBy: { createdAt: 'desc' }
        });
    }

    async updateTenantStatus(adminId: string, tenantId: string, data: { isDeactivated?: boolean, isVerified?: boolean, adminNotes?: string, name?: string, slug?: string }) {
        const tenant = await this.prisma.tenant.findUnique({ where: { id: tenantId } });
        if (!tenant) throw new NotFoundException('PR not found');

        const updated = await this.prisma.tenant.update({
            where: { id: tenantId },
            data,
        });

        await this.logAction(adminId, 'UPDATE_TENANT', 'Tenant', tenantId, data);
        return updated;
    }

    async updateTenantProfile(adminId: string, tenantId: string, profileData: any) {
        const updated = await this.prisma.profile.update({
            where: { tenantId },
            data: profileData,
        });

        await this.logAction(adminId, 'MODERATED_PROFILE', 'Profile', tenantId, profileData);
        return updated;
    }

    async softDeleteTenant(adminId: string, tenantId: string) {
        const updated = await this.prisma.tenant.update({
            where: { id: tenantId },
            data: { deletedAt: new Date(), isDeactivated: true },
        });

        await this.logAction(adminId, 'SOFT_DELETE_TENANT', 'Tenant', tenantId);
        return updated;
    }

    // Event Oversight
    async getAllEvents() {
        return this.prisma.event.findMany({
            include: {
                tenant: { select: { id: true, name: true, slug: true } },
                _count: { select: { reservations: true } }
            },
            orderBy: { eventDate: 'desc' }
        });
    }

    async toggleEventVisibility(adminId: string, eventId: string, isPublished: boolean) {
        const updated = await this.prisma.event.update({
            where: { id: eventId },
            data: { isPublished },
        });

        await this.logAction(adminId, 'TOGGLE_EVENT_VISIBILITY', 'Event', eventId, { isPublished });
        return updated;
    }

    async softDeleteEvent(adminId: string, eventId: string) {
        const updated = await this.prisma.event.update({
            where: { id: eventId },
            data: { isPublished: false, deletedAt: new Date() } as any,
        });

        await this.logAction(adminId, 'SOFT_DELETE_EVENT', 'Event', eventId);
        return updated;
    }

    // Reservation Visibility
    async getAllReservations() {
        // Mask customer data as requested (Read-only view for abuse detection)
        const reservations = await this.prisma.reservation.findMany({
            include: {
                event: { select: { name: true } },
                tenant: { select: { name: true } },
                ticketType: { select: { name: true } }
            },
            orderBy: { createdAt: 'desc' },
            take: 100, // Limit for performance
        });

        return reservations.map(res => ({
            ...res,
            customerName: res.customerName.charAt(0) + '***',
            customerEmail: '***@***.***',
            customerPhone: '***-***',
        }));
    }

    // Subscription & Audit Logs
    async getAdminLogs() {
        return this.prisma.adminLog.findMany({
            orderBy: { createdAt: 'desc' },
            take: 100
        });
    }

    async getTenantFullProfile(tenantId: string) {
        const tenant = await this.prisma.tenant.findUnique({
            where: { id: tenantId },
            include: {
                profile: true,
                _count: {
                    select: { events: true, reservations: true }
                }
            }
        });

        if (!tenant) throw new NotFoundException('PR partner not found');

        return {
            id: tenant.id,
            name: tenant.name,
            email: tenant.email,
            slug: tenant.slug,
            role: tenant.role,
            subscriptionStatus: tenant.subscriptionStatus,
            createdAt: tenant.createdAt,
            profile: tenant.profile,
            stats: tenant._count,
        };
    }

    async getAnalytics(filters: { startDate?: string, endDate?: string, tenantId?: string } = {}) {
        const { startDate, endDate, tenantId } = filters;

        const start = startDate ? new Date(startDate) : new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
        const end = endDate ? new Date(endDate) : new Date();

        const [
            totalPrs,
            activePrs,
            activeEvents,
            topTenants,
            paidReservations
        ] = await Promise.all([
            this.prisma.tenant.count({ where: { role: 'PR' } }),
            this.prisma.tenant.count({ where: { role: 'PR', isDeactivated: false } }),
            this.prisma.event.count({ where: { isPublished: true, deletedAt: null as any } }),
            this.prisma.tenant.findMany({
                where: { role: 'PR' },
                include: { _count: { select: { reservations: true } } },
                orderBy: { reservations: { _count: 'desc' } },
                take: 5
            }),
            this.prisma.reservation.findMany({
                where: {
                    status: 'PAID_CONFIRMED',
                    createdAt: { gte: start, lte: end },
                    ...(tenantId ? { tenantId } : {})
                },
                select: { totalAmount: true, createdAt: true, quantity: true }
            })
        ]);

        // Calculate daily stats for the pulse graph
        const dailyMap: Record<string, { count: number, revenue: number }> = {};
        paidReservations.forEach(res => {
            const date = res.createdAt.toISOString().split('T')[0];
            if (!dailyMap[date]) dailyMap[date] = { count: 0, revenue: 0 };
            dailyMap[date].count += res.quantity;
            dailyMap[date].revenue += res.totalAmount;
        });

        const dailyStats = Object.entries(dailyMap)
            .map(([date, data]) => ({ date, ...data }))
            .sort((a, b) => a.date.localeCompare(b.date));

        const totalRevenue = paidReservations.reduce((sum, res) => sum + res.totalAmount, 0);
        const totalTickets = paidReservations.reduce((sum, res) => sum + res.quantity, 0);

        return {
            totalPrs,
            activePrs,
            activeEvents,
            totalRevenue,
            totalTickets,
            dailyStats,
            topPrs: topTenants.map(t => ({
                id: t.id,
                name: t.name,
                volume: t._count.reservations
            }))
        };
    }

    async getPlatformSales(filters: { tenantId?: string, take?: number } = {}) {
        return this.prisma.reservation.findMany({
            where: {
                status: 'PAID_CONFIRMED',
                ...(filters.tenantId ? { tenantId: filters.tenantId } : {})
            },
            include: {
                tenant: { select: { name: true } },
                event: { select: { name: true } },
                ticketType: { select: { name: true, price: true } }
            },
            orderBy: { createdAt: 'desc' },
            take: filters.take || 50
        });
    }
}
