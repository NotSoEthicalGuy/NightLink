import { Injectable, UnauthorizedException, ConflictException, BadRequestException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../prisma/prisma.service';
import { LoginDto, SignupDto, RequestOtpDto, VerifyOtpDto, ResetPasswordDto } from './dto/auth.dto';
import { MailService } from '../mail/mail.service';

@Injectable()
export class AuthService {
    constructor(
        private prisma: PrismaService,
        private jwtService: JwtService,
        private mailService: MailService,
    ) { }

    async requestSignupOtp(dto: RequestOtpDto) {
        // 1. Check if email already exists in Tenant table
        const existingTenant = await this.prisma.tenant.findUnique({
            where: { email: dto.email },
        });
        if (existingTenant) {
            throw new ConflictException('Identity already registered');
        }

        // 2. Cooldown check (60 seconds)
        const existingRecord = await this.prisma.emailVerification.findUnique({
            where: { email: dto.email }
        });

        if (existingRecord && !existingRecord.verified) {
            const lastUpdate = new Date(existingRecord.updatedAt).getTime();
            const now = Date.now();
            if (now - lastUpdate < 60000) {
                throw new BadRequestException('Please wait 60 seconds before requesting a new code');
            }
        }

        // 3. Generate 6 digit code
        const otpValue = Math.floor(100000 + Math.random() * 900000).toString();
        const otpHash = await bcrypt.hash(otpValue, 10);
        const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 mins

        // 4. Upsert verification record
        await this.prisma.emailVerification.upsert({
            where: { email: dto.email },
            update: {
                otpHash,
                expiresAt,
                attempts: 0,
                verified: false
            },
            create: {
                email: dto.email,
                otpHash,
                expiresAt,
            }
        });

        // 5. Send Email (Generic success message for security)
        try {
            await this.mailService.sendVerificationEmail(dto.email, otpValue);
        } catch (error) {
            console.error('Failed to send OTP email:', error);
            // In production, we might still return success to hide email existence, 
            // but for MVP we want to know if it failed.
        }

        return { success: true, message: 'If the email is valid, a code will be sent shortly.' };
    }

    async resendOtp(dto: RequestOtpDto) {
        return this.requestSignupOtp(dto);
    }

    async verifyOtp(dto: VerifyOtpDto) {
        const record = await this.prisma.emailVerification.findUnique({
            where: { email: dto.email }
        });

        if (!record) {
            throw new BadRequestException('Verification session not found');
        }

        if (record.verified) {
            return { success: true, message: 'Email already verified' };
        }

        if (record.attempts >= 5) {
            throw new BadRequestException('Maximum attempts reached. Please request a new code.');
        }

        if (new Date() > record.expiresAt) {
            throw new BadRequestException('Code has expired');
        }

        const isValid = await bcrypt.compare(dto.code, record.otpHash);

        if (!isValid) {
            await this.prisma.emailVerification.update({
                where: { email: dto.email },
                data: { attempts: { increment: 1 } }
            });
            throw new BadRequestException('Invalid verification code');
        }

        await this.prisma.emailVerification.update({
            where: { email: dto.email },
            data: { verified: true }
        });

        return { success: true, message: 'Email verified successfully' };
    }

    async signup(dto: SignupDto) {
        console.log('Signup attempt for:', dto.email);
        // 1. Verify that the email was successfully verified via OTP recently
        const verification = await this.prisma.emailVerification.findUnique({
            where: { email: dto.email }
        });

        console.log('Verification record:', !!verification, 'Verified:', verification?.verified);

        if (!verification || !verification.verified) {
            throw new BadRequestException('Email verification required');
        }

        // Verify OTP code matches hash (Redundant safety check)
        const isOtpValid = await bcrypt.compare(dto.otpCode, verification.otpHash);
        if (!isOtpValid) {
            throw new BadRequestException('Invalid verification code');
        }

        // 2. Check if email/slug already exists (Final guard)
        const conflict = await this.prisma.tenant.findFirst({
            where: {
                OR: [
                    { email: dto.email },
                    { slug: dto.slug }
                ]
            }
        });

        if (conflict) {
            throw new ConflictException(conflict.email === dto.email ? 'Email in use' : 'Username taken');
        }

        // 3. Hash password
        const passwordHash = await bcrypt.hash(dto.password, 10);

        // 4. Create tenant
        const tenant = await this.prisma.tenant.create({
            data: {
                name: dto.name,
                email: dto.email,
                slug: dto.slug,
                passwordHash,
                subscriptionStatus: 'ACTIVE',
                subscriptionExpiresAt: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), // 14 days free trial
            },
        });

        // 5. Cleanup verification record
        await this.prisma.emailVerification.delete({
            where: { email: dto.email }
        });

        // Create default profile
        await this.prisma.profile.create({
            data: {
                tenantId: tenant.id,
                displayName: tenant.name,
                bio: '',
                contactInfo: {
                    whatsapp: dto.whatsapp,
                    preferredPaymentMethod: dto.preferredPaymentMethod
                },
            },
        });

        // Create default site config
        await this.prisma.siteConfig.create({
            data: {
                tenantId: tenant.id,
            },
        });

        // Generate JWT token
        const token = this.jwtService.sign({
            sub: tenant.id,
            email: tenant.email,
        });

        return {
            user: {
                id: tenant.id,
                email: tenant.email,
                name: tenant.name,
                slug: tenant.slug,
                role: tenant.role,
                isSubscribed: tenant.isSubscribed,
                subscriptionPlan: tenant.subscriptionPlan,
                subscriptionStartDate: tenant.subscriptionStartDate,
                subscriptionEndDate: tenant.subscriptionEndDate,
                subscriptionStatus: tenant.subscriptionStatus,
                subscriptionExpiresAt: tenant.subscriptionExpiresAt,
                createdAt: tenant.createdAt,
            },
            token,
        };
    }

    async login(dto: LoginDto) {
        // Find user by email
        const tenant = await this.prisma.tenant.findUnique({
            where: { email: dto.email },
        });

        console.log('Login attempt for:', dto.email);
        console.log('User found:', !!tenant);

        if (!tenant) {
            console.log('User not found in DB');
            throw new UnauthorizedException('Invalid credentials');
        }

        // Verify password
        const isPasswordValid = await bcrypt.compare(dto.password, tenant.passwordHash);

        console.log('Password valid:', isPasswordValid);

        if (!isPasswordValid) {
            console.log('Password mismatch');
            throw new UnauthorizedException('Invalid credentials');
        }

        // Check if account is deactivated
        console.log('Account status - Deactivated:', tenant.isDeactivated, 'Notes:', tenant.adminNotes);
        if (tenant.isDeactivated) {
            throw new UnauthorizedException(`DEACTIVATED|${tenant.adminNotes || 'No reason provided by administrator.'}`);
        }

        // Generate JWT token
        const token = this.jwtService.sign({
            sub: tenant.id,
            email: tenant.email,
        });

        return {
            user: {
                id: tenant.id,
                email: tenant.email,
                name: tenant.name,
                slug: tenant.slug,
                role: tenant.role,
                isSubscribed: tenant.isSubscribed,
                subscriptionPlan: tenant.subscriptionPlan,
                subscriptionStartDate: tenant.subscriptionStartDate,
                subscriptionEndDate: tenant.subscriptionEndDate,
                subscriptionStatus: tenant.subscriptionStatus,
                subscriptionExpiresAt: tenant.subscriptionExpiresAt,
                createdAt: tenant.createdAt,
            },
            token,
        };
    }

    async validateUser(userId: string) {
        const tenant = await this.prisma.tenant.findUnique({
            where: { id: userId },
        });

        if (!tenant) {
            return null;
        }

        return {
            id: tenant.id,
            email: tenant.email,
            name: tenant.name,
            slug: tenant.slug,
            role: tenant.role,
            isVerified: tenant.isVerified,
            isSubscribed: tenant.isSubscribed,
            subscriptionPlan: tenant.subscriptionPlan,
            subscriptionStartDate: tenant.subscriptionStartDate,
            subscriptionEndDate: tenant.subscriptionEndDate,
            subscriptionStatus: tenant.subscriptionStatus,
            subscriptionExpiresAt: tenant.subscriptionExpiresAt,
            createdAt: tenant.createdAt,
        };
    }

    async verifyPassword(userId: string, password: string) {
        const tenant = await this.prisma.tenant.findUnique({
            where: { id: userId },
        });

        if (!tenant) {
            throw new UnauthorizedException('User not found');
        }

        const isPasswordValid = await bcrypt.compare(password, tenant.passwordHash);
        return { isValid: isPasswordValid };
    }

    async requestForgotPasswordOtp(dto: RequestOtpDto) {
        // 1. Check if email exists
        const tenant = await this.prisma.tenant.findUnique({
            where: { email: dto.email },
        });
        if (!tenant) {
            // Return success even if email doesn't exist for security
            return { success: true, message: 'If the email is registered, a code will be sent shortly.' };
        }

        // 2. Generate and send code
        const otpValue = Math.floor(100000 + Math.random() * 900000).toString();
        const otpHash = await bcrypt.hash(otpValue, 10);
        const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

        await this.prisma.emailVerification.upsert({
            where: { email: dto.email },
            update: { otpHash, expiresAt, attempts: 0, verified: false },
            create: { email: dto.email, otpHash, expiresAt }
        });

        await this.mailService.sendForgotPasswordEmail(dto.email, otpValue);

        return { success: true, message: 'If the email is registered, a code will be sent shortly.' };
    }

    async resetPassword(dto: ResetPasswordDto) {
        const record = await this.prisma.emailVerification.findUnique({
            where: { email: dto.email }
        });

        if (!record || !record.verified) {
            throw new BadRequestException('Email not verified or session expired');
        }

        // Final code check for security
        const isValid = await bcrypt.compare(dto.code, record.otpHash);
        if (!isValid) {
            throw new BadRequestException('Invalid verification session');
        }

        // 3. Hash new password
        const passwordHash = await bcrypt.hash(dto.newPassword, 10);

        // 4. Update password
        await this.prisma.tenant.update({
            where: { email: dto.email },
            data: { passwordHash }
        });

        // 5. Cleanup
        await this.prisma.emailVerification.delete({
            where: { email: dto.email }
        });

        return { success: true, message: 'Password has been reset successfully' };
    }

    async changePassword(userId: string, oldPassword: string, newPassword: string) {
        const tenant = await this.prisma.tenant.findUnique({
            where: { id: userId },
        });

        if (!tenant) {
            throw new UnauthorizedException('User not found');
        }

        const isPasswordValid = await bcrypt.compare(oldPassword, tenant.passwordHash);
        if (!isPasswordValid) {
            throw new UnauthorizedException('Invalid old password');
        }

        const newPasswordHash = await bcrypt.hash(newPassword, 10);
        await this.prisma.tenant.update({
            where: { id: userId },
            data: { passwordHash: newPasswordHash },
        });

        return { message: 'Password changed successfully' };
    }

    async simulatePayment(userId: string, plan: 'STANDARD' | 'PREMIUM') {
        const now = new Date();
        const endDate = new Date();
        endDate.setDate(now.getDate() + 30);

        const updatedTenant = await this.prisma.tenant.update({
            where: { id: userId },
            data: {
                isSubscribed: true,
                subscriptionPlan: plan,
                subscriptionStartDate: now,
                subscriptionEndDate: endDate,
                subscriptionStatus: 'ACTIVE',
            },
        });

        return {
            id: updatedTenant.id,
            email: updatedTenant.email,
            name: updatedTenant.name,
            slug: updatedTenant.slug,
            role: updatedTenant.role,
            isSubscribed: updatedTenant.isSubscribed,
            subscriptionPlan: updatedTenant.subscriptionPlan,
            subscriptionStartDate: updatedTenant.subscriptionStartDate,
            subscriptionEndDate: updatedTenant.subscriptionEndDate,
            subscriptionStatus: updatedTenant.subscriptionStatus,
            createdAt: updatedTenant.createdAt,
        };
    }
}

