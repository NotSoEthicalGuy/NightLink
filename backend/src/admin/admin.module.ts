import { Module } from '@nestjs/common';
import { AdminService } from './admin.service';
import { AdminController } from './admin.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { VerificationModule } from '../verification/verification.module';

@Module({
    imports: [PrismaModule, VerificationModule],
    controllers: [AdminController],
    providers: [AdminService],
})
export class AdminModule { }
