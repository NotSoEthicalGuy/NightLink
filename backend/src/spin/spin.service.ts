import { Injectable, BadRequestException, OnModuleInit } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class SpinService implements OnModuleInit {
    constructor(private prisma: PrismaService) { }

    async onModuleInit() {
        // Initialize default config if not exists
        const config = await (this.prisma as any).spinConfig.findUnique({
            where: { id: 'global' },
        });

        if (!config) {
            await (this.prisma as any).spinConfig.create({
                data: {
                    id: 'global',
                    isEnabled: true,
                    probabilities: {
                        SUB_3_DAYS: 0.1,
                        SUB_5_DAYS: 0.05,
                        BRANDING_7_DAYS: 0.15,
                        NONE: 0.7,
                    },
                    rewardSettings: {
                        SUB_3_DAYS: { active: true },
                        SUB_5_DAYS: { active: true },
                        BRANDING_7_DAYS: { active: true },
                        NONE: { active: true },
                    },
                },
            });
        }
    }

    async getStatus(tenantId: string) {
        const tenant = await this.prisma.tenant.findUnique({
            where: { id: tenantId },
            select: { lastSpinAt: true, availableSpins: true } as any,
        });

        const config = await (this.prisma as any).spinConfig.findUnique({
            where: { id: 'global' },
        });

        if (!config || !config.isEnabled) {
            return { isAvailable: false, nextSpinAt: null, reason: 'DISABLED', availableSpins: (tenant as any)?.availableSpins || 0 };
        }

        const hasBonusSpins = (tenant as any)?.availableSpins > 0;

        if (!tenant || !(tenant as any).lastSpinAt) {
            return { isAvailable: true, nextSpinAt: new Date(), availableSpins: (tenant as any)?.availableSpins || 0 };
        }

        const nextSpinAt = new Date((tenant as any).lastSpinAt);
        nextSpinAt.setDate(nextSpinAt.getDate() + 7);

        return {
            isAvailable: hasBonusSpins || new Date() >= nextSpinAt,
            nextSpinAt,
            availableSpins: (tenant as any).availableSpins,
            isUsingBonus: hasBonusSpins && new Date() < nextSpinAt
        };
    }

    async spin(tenantId: string) {
        const status = await this.getStatus(tenantId);
        if (!status.isAvailable) {
            throw new BadRequestException('Weekly spin not available yet');
        }

        const config = await (this.prisma as any).spinConfig.findUnique({
            where: { id: 'global' },
        });

        const probabilities: any = config.probabilities;
        const random = Math.random();
        let cumulative = 0;
        let rewardType = 'NONE';

        for (const [type, prob] of Object.entries(probabilities)) {
            cumulative += prob as number;
            if (random <= cumulative) {
                rewardType = type;
                break;
            }
        }

        // Apply reward
        await this.applyReward(tenantId, rewardType, 'SPIN');

        // Logic for tracking spin usage
        const tenant = await this.prisma.tenant.findUnique({
            where: { id: tenantId },
            select: { lastSpinAt: true, availableSpins: true } as any
        });

        if (!tenant) throw new BadRequestException('Tenant not found');

        const lastSpinAtVal = (tenant as any).lastSpinAt;
        const nextRegularSpin = lastSpinAtVal ? new Date(new Date(lastSpinAtVal).getTime() + 7 * 24 * 60 * 60 * 1000) : new Date(0);
        const isBonusSpin = new Date() < nextRegularSpin && (tenant as any).availableSpins > 0;

        if (isBonusSpin) {
            // Consume bonus spin
            await this.prisma.tenant.update({
                where: { id: tenantId },
                data: { availableSpins: { decrement: 1 } } as any,
            });
        } else {
            // Regular weekly spin - reset cooldown
            await this.prisma.tenant.update({
                where: { id: tenantId },
                data: { lastSpinAt: new Date() } as any,
            });
        }

        // Log the spin
        await (this.prisma as any).spinLog.create({
            data: {
                tenantId,
                rewardType,
            },
        });

        return { rewardType, isBonusSpin };
    }


    // Admin methods
    async grantExtraSpins(tenantId: string, amount: number) {
        return this.prisma.tenant.update({
            where: { id: tenantId },
            data: { availableSpins: { increment: amount } } as any,
        });
    }

    async applyReward(tenantId: string, rewardType: string, source: string, adminId?: string) {
        const tenant = await this.prisma.tenant.findUnique({
            where: { id: tenantId },
        });

        if (!tenant) throw new BadRequestException('Tenant not found');

        let duration = 0;

        switch (rewardType) {
            case 'SUB_3_DAYS':
                duration = 3;
                await this.extendSubscription(tenantId, duration);
                break;
            case 'SUB_5_DAYS':
                duration = 5;
                await this.extendSubscription(tenantId, duration);
                break;
            case 'BRANDING_7_DAYS':
                duration = 7;
                await this.enableBranding(tenantId, duration);
                break;
            case 'NONE':
            default:
                break;
        }

        if (rewardType !== 'NONE') {
            await (this.prisma as any).rewardLog.create({
                data: {
                    tenantId,
                    rewardType,
                    duration,
                    source,
                    adminId,
                },
            });
        }
    }

    private async extendSubscription(tenantId: string, days: number) {
        const tenant = await this.prisma.tenant.findUnique({ where: { id: tenantId } });
        if (!tenant) return;
        const currentExpiry = tenant.subscriptionExpiresAt || new Date();
        const newExpiry = new Date(Math.max(currentExpiry.getTime(), new Date().getTime()));
        newExpiry.setDate(newExpiry.getDate() + days);

        await this.prisma.tenant.update({
            where: { id: tenantId },
            data: { subscriptionExpiresAt: newExpiry, subscriptionStatus: 'ACTIVE' },
        });
    }

    private async enableBranding(tenantId: string, days: number) {
        const tenant = await this.prisma.tenant.findUnique({ where: { id: tenantId } });
        if (!tenant) return;
        const currentBrandingUntil = (tenant as any).customBrandingUntil || new Date();
        const newUntil = new Date(Math.max(new Date(currentBrandingUntil).getTime(), new Date().getTime()));
        newUntil.setDate(newUntil.getDate() + days);

        await this.prisma.tenant.update({
            where: { id: tenantId },
            data: { customBrandingUntil: newUntil } as any,
        });
    }

    // Admin methods
    async getConfig() {
        return (this.prisma as any).spinConfig.findUnique({ where: { id: 'global' } });
    }

    async updateConfig(dto: any) {
        return (this.prisma as any).spinConfig.update({
            where: { id: 'global' },
            data: dto,
        });
    }

    async getLogs() {
        return (this.prisma as any).spinLog.findMany({
            include: { tenant: { select: { name: true, email: true } } },
            orderBy: { createdAt: 'desc' },
            take: 100,
        });
    }

    async getRewardLogs(tenantId?: string) {
        return (this.prisma as any).rewardLog.findMany({
            where: tenantId ? { tenantId } : {},
            include: { tenant: { select: { name: true, email: true } } },
            orderBy: { createdAt: 'desc' },
            take: 100,
        });
    }

    async grantManualReward(tenantId: string, rewardType: string, adminId: string) {
        await this.applyReward(tenantId, rewardType, 'ADMIN', adminId);
        return { success: true };
    }
}
