import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { NotificationsService } from '../notifications/notifications.service';

@Injectable()
export class ReservationsService {
    constructor(
        private prisma: PrismaService,
        private notifications: NotificationsService
    ) { }

    async create(dto: any) {
        // 1. Check ticket availability
        const ticketType = await this.prisma.ticketType.findUnique({
            where: { id: dto.ticketTypeId },
            include: { event: { include: { tenant: true } } }
        });

        if (!ticketType) throw new NotFoundException('Ticket type not found');

        const available = ticketType.totalQuantity - (ticketType.reservedQuantity + ticketType.soldQuantity);
        if (available < dto.quantity) {
            throw new BadRequestException('Not enough tickets available');
        }

        // 2. Create reservation
        const reservationCode = Math.random().toString(36).substring(2, 10).toUpperCase();
        const expiresAt = new Date();
        expiresAt.setMinutes(expiresAt.getMinutes() + 60);

        const reservation = await this.prisma.reservation.create({
            data: {
                reservationCode,
                ticketTypeId: dto.ticketTypeId,
                eventId: ticketType.eventId,
                tenantId: ticketType.event.tenantId,
                customerName: dto.customerName,
                customerEmail: dto.customerEmail,
                customerPhone: dto.customerPhone,
                quantity: dto.quantity,
                totalAmount: ticketType.price * dto.quantity,
                status: 'PENDING_PAYMENT',
                expiresAt
            }
        });

        // 3. Update ticket reserved quantity
        await this.prisma.ticketType.update({
            where: { id: dto.ticketTypeId },
            data: { reservedQuantity: { increment: dto.quantity } }
        });

        // 4. Send notification to PR
        await this.notifications.create(ticketType.event.tenantId, {
            type: 'NEW_RESERVATION',
            title: 'New Spot Reserved! 🔥',
            message: `${dto.customerName} just reserved ${dto.quantity} tickets for "${ticketType.event.name}". Awaiting payment.`,
            data: { reservationId: reservation.id, reservationCode: reservation.reservationCode }
        });

        return reservation;
    }

    async findByCode(code: string) {
        const res = await this.prisma.reservation.findUnique({
            where: { reservationCode: code },
            include: {
                event: true,
                ticketType: true,
                tenant: {
                    include: { siteConfig: true }
                }
            }
        });
        if (!res) throw new NotFoundException('Reservation not found');
        return res;
    }

    async updateStatus(tenantId: string, id: string, status: any) {
        const reservation = await this.prisma.reservation.findFirst({
            where: { id, tenantId },
            include: { ticketType: true }
        });

        if (!reservation) throw new NotFoundException('Reservation not found');

        // Handle quantity shifts when status changes
        if (status === 'PAID_CONFIRMED' && reservation.status !== 'PAID_CONFIRMED') {
            await this.prisma.ticketType.update({
                where: { id: reservation.ticketTypeId },
                data: {
                    reservedQuantity: { decrement: reservation.quantity },
                    soldQuantity: { increment: reservation.quantity }
                }
            });
        } else if (status === 'REJECTED' || status === 'CANCELLED') {
            if (reservation.status === 'PENDING_PAYMENT') {
                await this.prisma.ticketType.update({
                    where: { id: reservation.ticketTypeId },
                    data: { reservedQuantity: { decrement: reservation.quantity } }
                });
            } else if (reservation.status === 'PAID_CONFIRMED') {
                await this.prisma.ticketType.update({
                    where: { id: reservation.ticketTypeId },
                    data: { soldQuantity: { decrement: reservation.quantity } }
                });
            }
        }

        return this.prisma.reservation.update({
            where: { id },
            data: { status, confirmedAt: status === 'PAID_CONFIRMED' ? new Date() : undefined }
        });
    }

    async findAllForPR(tenantId: string) {
        return this.prisma.reservation.findMany({
            where: { tenantId },
            orderBy: { createdAt: 'desc' },
            include: { event: true, ticketType: true }
        });
    }

    async getEventReservationsCsv(tenantId: string, eventId: string) {
        const reservations = await this.prisma.reservation.findMany({
            where: { tenantId, eventId },
            include: { ticketType: true, event: true },
            orderBy: { createdAt: 'desc' }
        });

        if (reservations.length === 0) return 'No reservations found';

        const headers = ['Code', 'Customer Name', 'Email', 'Phone', 'Ticket Type', 'Quantity', 'Total Amount', 'Status', 'Date'];
        const rows = reservations.map(r => [
            r.reservationCode,
            r.customerName,
            r.customerEmail,
            r.customerPhone,
            r.ticketType.name,
            r.quantity,
            r.totalAmount,
            r.status,
            r.createdAt.toISOString()
        ]);

        return [headers, ...rows].map(row => row.join(',')).join('\n');
    }

    async cancel(id: string) {
        const res = await this.prisma.reservation.findUnique({ where: { id } });
        if (!res) throw new NotFoundException('Reservation not found');

        if (res.status === 'PENDING_PAYMENT') {
            await this.prisma.ticketType.update({
                where: { id: res.ticketTypeId },
                data: { reservedQuantity: { decrement: res.quantity } }
            });
        }

        return this.prisma.reservation.update({
            where: { id },
            data: { status: 'CANCELLED' }
        });
    }
}
