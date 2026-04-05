import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class NotificationsService {
    constructor(private prisma: PrismaService) { }

    async create(tenantId: string, data: { type: string; title: string; message: string; data?: any }) {
        return this.prisma.notification.create({
            data: {
                tenantId,
                ...data
            }
        });
    }

    async findAll(tenantId: string) {
        const notifications = await this.prisma.notification.findMany({
            where: { tenantId },
            orderBy: { createdAt: 'desc' },
            take: 50
        });

        // For NEW_RESERVATION notifications, fetch the current reservation status
        const notificationsWithStatus = await Promise.all(
            notifications.map(async (notif) => {
                if (notif.type === 'NEW_RESERVATION' && notif.data && typeof notif.data === 'object' && 'reservationId' in notif.data) {
                    const reservation = await this.prisma.reservation.findUnique({
                        where: { id: notif.data.reservationId as string },
                        select: { status: true }
                    });
                    return {
                        ...notif,
                        reservationStatus: reservation?.status || null
                    };
                }
                return notif;
            })
        );

        return notificationsWithStatus;
    }

    async markAsRead(tenantId: string, id: string) {
        return this.prisma.notification.updateMany({
            where: { id, tenantId },
            data: { isRead: true }
        });
    }

    async markAllAsRead(tenantId: string) {
        return this.prisma.notification.updateMany({
            where: { tenantId },
            data: { isRead: true }
        });
    }

    async countUnread(tenantId: string) {
        return this.prisma.notification.count({
            where: {
                tenantId,
                isRead: false
            }
        });
    }
}
