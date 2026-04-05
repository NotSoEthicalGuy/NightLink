import { Controller, Get, Patch, Body, UseGuards, Request, Param } from '@nestjs/common';
import { AdminService } from './admin.service';
import { VerificationService } from '../verification/verification.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { UserRole, VerificationStatus } from '@prisma/client';

@Controller('admin')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.ADMIN)
export class AdminController {
    constructor(
        private adminService: AdminService,
        private verificationService: VerificationService
    ) { }

    @Get('ping')
    ping() {
        return { status: 'ok', message: 'Admin system online' };
    }

    @Get('analytics')
    getAnalytics(@Request() req) {
        return this.adminService.getAnalytics(req.query);
    }

    @Get('sales')
    getSales(@Request() req) {
        return this.adminService.getPlatformSales(req.query);
    }

    @Get('pr-full-profile/:id')
    getTenantFullProfile(@Param('id') id: string) {
        return this.adminService.getTenantFullProfile(id);
    }

    @Get('tenants')
    getTenants() {
        return this.adminService.getAllTenants();
    }

    @Patch('tenants/:id')
    updateTenant(@Request() req, @Param('id') id: string, @Body() body: any) {
        return this.adminService.updateTenantStatus(req.user.id, id, body);
    }

    @Patch('tenants/:id/profile')
    moderateProfile(@Request() req, @Param('id') id: string, @Body() body: any) {
        return this.adminService.updateTenantProfile(req.user.id, id, body);
    }

    @Patch('tenants/:id/soft-delete')
    deleteTenant(@Request() req, @Param('id') id: string) {
        return this.adminService.softDeleteTenant(req.user.id, id);
    }

    @Get('verification-requests')
    getRequests(@Request() req) {
        const includeArchived = req.query.archived === 'true';
        return this.verificationService.getAllRequests(includeArchived);
    }

    @Patch('verification-requests/:id')
    handleRequest(
        @Request() req,
        @Param('id') id: string,
        @Body() body: { status: VerificationStatus, adminNotes?: string }
    ) {
        return this.verificationService.handleRequest(id, body.status, body.adminNotes);
    }

    @Patch('verification-requests/:id/archive')
    archiveRequest(@Param('id') id: string, @Body() body: { archive: boolean }) {
        return this.verificationService.toggleArchived(id, body.archive);
    }

    @Get('events')
    getEvents() {
        return this.adminService.getAllEvents();
    }

    @Patch('events/:id/visibility')
    toggleEvent(@Request() req, @Param('id') id: string, @Body() body: { isPublished: boolean }) {
        return this.adminService.toggleEventVisibility(req.user.id, id, body.isPublished);
    }

    @Patch('events/:id/soft-delete')
    softDeleteEvent(@Request() req, @Param('id') id: string) {
        return this.adminService.softDeleteEvent(req.user.id, id);
    }

    @Get('reservations')
    getReservations() {
        return this.adminService.getAllReservations();
    }

    @Get('logs')
    getLogs() {
        return this.adminService.getAdminLogs();
    }

}
