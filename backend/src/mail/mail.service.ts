import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Resend } from 'resend';

@Injectable()
export class MailService {
    private resend: Resend | null;

    constructor(private configService: ConfigService) {
        const apiKey = this.configService.get('RESEND_API_KEY');
        if (!apiKey) {
            console.warn('⚠️ RESEND_API_KEY is missing. Emails will be logged to console instead.');
            this.resend = null;
        } else {
            this.resend = new Resend(apiKey);
        }
    }

    async sendVerificationEmail(email: string, code: string) {
        if (!this.resend) {
            console.log(`
            =========================================
            [MOCK EMAIL] TO: ${email}
            SUBJECT: Nightlink | Identity Verification
            CODE: ${code}
            =========================================
            `);
            return true;
        }
        try {
            await this.resend.emails.send({
                from: 'Nightlink <onboarding@resend.dev>', // Update with verified domain in production
                to: email,
                subject: 'Nightlink | Identity Verification',
                html: `
                    <div style="font-family: sans-serif; max-width: 500px; margin: auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
                        <h2 style="color: #333; text-align: center;">Verification Code</h2>
                        <p style="text-align: center; font-size: 16px; color: #666;">Use the tactical code below to authorize your account.</p>
                        <div style="background: #f4f4f4; padding: 20px; text-align: center; border-radius: 8px; margin: 20px 0;">
                            <span style="font-size: 32px; font-weight: bold; letter-spacing: 5px; color: #ff0080;">${code}</span>
                        </div>
                        <p style="font-size: 12px; color: #999; text-align: center;">This code will expire in 10 minutes.</p>
                        <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;" />
                        <p style="font-size: 10px; color: #aaa; text-align: center;">SECURED BY NIGHTLINK INDUSTRIAL ENCRYPTION © 2026</p>
                    </div>
                `,
            });
            console.log(`✅ Verification email sent to ${email}`);
            return true;
        } catch (error) {
            console.error('Resend delivery failed:', error);
            return false;
        }
    }

    async sendForgotPasswordEmail(email: string, code: string) {
        if (!this.resend) {
            console.log(`
            =========================================
            [MOCK PASSWORD RESET] TO: ${email}
            SUBJECT: Nightlink | Password Reset
            CODE: ${code}
            =========================================
            `);
            return true;
        }
        try {
            await this.resend.emails.send({
                from: 'Nightlink <onboarding@resend.dev>',
                to: email,
                subject: 'Nightlink | Reset Your Password',
                html: `
                    <div style="font-family: sans-serif; max-width: 500px; margin: auto; padding: 20px; border: 1px solid #eee; border-radius: 10px; background: #09090b; color: #fafafa;">
                        <h2 style="color: #D4AF37; text-align: center;">Password Reset Request</h2>
                        <p style="text-align: center; font-size: 16px; color: #a1a1aa;">Use the code below to reset your Nightlink account password.</p>
                        <div style="background: #18181b; padding: 20px; text-align: center; border-radius: 8px; margin: 20px 0; border: 1px solid #27272a;">
                            <span style="font-size: 32px; font-weight: bold; letter-spacing: 5px; color: #D4AF37;">${code}</span>
                        </div>
                        <p style="font-size: 12px; color: #71717a; text-align: center;">If you didn't request this, you can safely ignore this email. This code expires in 10 minutes.</p>
                        <hr style="border: none; border-top: 1px solid #27272a; margin: 20px 0;" />
                        <p style="font-size: 10px; color: #52525b; text-align: center;">SECURED BY NIGHTLINK © 2026</p>
                    </div>
                `,
            });
            console.log(`✅ Forgot password email sent to ${email}`);
            return true;
        } catch (error) {
            console.error('Resend delivery failed:', error);
            return false;
        }
    }
}
