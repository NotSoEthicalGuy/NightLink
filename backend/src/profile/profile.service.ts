import { Injectable, NotFoundException, ConflictException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UpdateProfileDto } from './dto/update-profile.dto';

@Injectable()
export class ProfileService {
    constructor(private prisma: PrismaService) { }

    async getProfile(tenantId: string) {
        const tenant = await this.prisma.tenant.findUnique({
            where: { id: tenantId },
            include: {
                profile: true,
            },
        });

        if (!tenant) {
            throw new NotFoundException('User not found');
        }

        return {
            id: tenant.id,
            name: tenant.name,
            email: tenant.email,
            slug: tenant.slug,
            role: tenant.role,
            subscriptionStatus: tenant.subscriptionStatus,
            createdAt: tenant.createdAt,
            profile: tenant.profile,
            defaultTicketTemplates: (tenant as any).defaultTicketTemplates,
        };
    }

    async updateProfile(tenantId: string, dto: UpdateProfileDto) {
        const { name, slug, email, ...profileData } = dto;

        // Enforce Mandatory WhatsApp
        if (!profileData.contactInfo?.whatsapp) {
            throw new BadRequestException('WhatsApp number is mandatory for PR agents');
        }

        // Check slug availability if changed
        if (slug) {
            const existingSlug = await this.prisma.tenant.findFirst({
                where: {
                    slug,
                    NOT: { id: tenantId },
                },
            });
            if (existingSlug) {
                throw new ConflictException('Username (slug) already taken');
            }
        }

        // Check email availability if changed
        if (email) {
            const existingEmail = await this.prisma.tenant.findFirst({
                where: {
                    email,
                    NOT: { id: tenantId },
                },
            });
            if (existingEmail) {
                throw new ConflictException('Email already in use');
            }
        }

        // Update Tenant and Profile
        return this.prisma.tenant.update({
            where: { id: tenantId },
            data: {
                name,
                slug,
                email,
                profile: {
                    update: profileData,
                },
            },
            include: {
                profile: true,
            },
        });
    }

    async saveTicketTemplates(tenantId: string, templates: any[]) {
        return this.prisma.tenant.update({
            where: { id: tenantId },
            data: {
                defaultTicketTemplates: templates as any,
            },
        });
    }
}
