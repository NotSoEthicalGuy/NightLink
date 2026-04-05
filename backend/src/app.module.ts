import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { SiteConfigModule } from './site-config/site-config.module';
import { EventsModule } from './events/events.module';
import { ProfileModule } from './profile/profile.module';
import { PublicModule } from './public/public.module';
import { NotificationsModule } from './notifications/notifications.module';
import { ReservationsModule } from './reservations/reservations.module';
import { DashboardModule } from './dashboard/dashboard.module';
import { MailModule } from './mail/mail.module';
import { AdminModule } from './admin/admin.module';
import { VerificationModule } from './verification/verification.module';
import { PrismaModule } from './prisma/prisma.module';

import { SpinModule } from './spin/spin.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    PrismaModule,
    AuthModule,
    SiteConfigModule,
    EventsModule,
    ProfileModule,
    PublicModule,
    NotificationsModule,
    ReservationsModule,
    DashboardModule,
    MailModule,
    AdminModule,
    VerificationModule,
    SpinModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
