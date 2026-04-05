import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class SiteConfigService {
    constructor(private prisma: PrismaService) { }

    async getConfig(tenantId: string) {
        return this.prisma.siteConfig.findUnique({
            where: { tenantId },
            include: { tenant: true }
        });
    }

    async updateConfig(tenantId: string, data: any) {
        return this.prisma.siteConfig.update({
            where: { tenantId },
            data,
        });
    }

    async togglePublish(tenantId: string, isPublished: boolean) {
        return this.prisma.siteConfig.update({
            where: { tenantId },
            data: { isPublished }
        });
    }
}
