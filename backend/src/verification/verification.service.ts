import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateVerificationRequestDto } from './dto/create-verification-request.dto';
import { VerificationStatus } from '@prisma/client';

@Injectable()
export class VerificationService {
    constructor(private prisma: PrismaService) { }

    async createRequest(tenantId: string, dto: CreateVerificationRequestDto) {
        // Check if there is already a pending request
        const existingRequest = await this.prisma.verificationRequest.findFirst({
            where: {
                tenantId,
                status: VerificationStatus.PENDING,
            },
        });

        if (existingRequest) {
            throw new BadRequestException('You already have a pending verification request.');
        }

        // Check cooldown (optional, but let's implement a simple 30 day rule for rejected ones)
        const lastRejected = await this.prisma.verificationRequest.findFirst({
            where: {
                tenantId,
                status: VerificationStatus.REJECTED,
            },
            orderBy: { updatedAt: 'desc' },
        });

        if (lastRejected) {
            const thirtyDaysAgo = new Date();
            thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
            if (lastRejected.updatedAt > thirtyDaysAgo) {
                throw new BadRequestException('Please wait 30 days after a rejection before reapplying.');
            }
        }

        return this.prisma.verificationRequest.create({
            data: {
                tenantId,
                ...dto,
            },
        });
    }

    async getMyRequest(tenantId: string) {
        return this.prisma.verificationRequest.findFirst({
            where: { tenantId },
            orderBy: { createdAt: 'desc' },
        });
    }

    // Admin Methods
    async getAllRequests(includeArchived: boolean = false) {
        return this.prisma.verificationRequest.findMany({
            where: includeArchived ? {} : { isArchived: false },
            include: {
                tenant: {
                    select: {
                        id: true,
                        name: true,
                        slug: true,
                        email: true,
                        profile: true,
                        isVerified: true,
                    },
                },
            },
            orderBy: { createdAt: 'desc' },
        });
    }

    async toggleArchived(requestId: string, isArchived: boolean) {
        return this.prisma.verificationRequest.update({
            where: { id: requestId },
            data: { isArchived },
        });
    }

    async handleRequest(requestId: string, status: VerificationStatus, adminNotes?: string) {
        const request = await this.prisma.verificationRequest.findUnique({
            where: { id: requestId },
        });

        if (!request) {
            throw new NotFoundException('Request not found');
        }

        const updatedRequest = await this.prisma.verificationRequest.update({
            where: { id: requestId },
            data: { status, adminNotes },
        });

        if (status === VerificationStatus.APPROVED) {
            await this.prisma.tenant.update({
                where: { id: request.tenantId },
                data: { isVerified: true },
            });

            // Notify PR (Optional: implement notification logic here)
        } else if (status === VerificationStatus.REJECTED) {
            await this.prisma.tenant.update({
                where: { id: request.tenantId },
                data: { isVerified: false }, // Ensure it's false
            });
        }

        return updatedRequest;
    }
}
