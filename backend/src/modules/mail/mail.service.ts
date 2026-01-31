import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { IMailService } from './interfaces/mail.service.interface';
import { LoggerService } from '../../common/logger/logger.service';

@Injectable()
export class MailService implements IMailService {
    private transporter: nodemailer.Transporter;

    constructor(private readonly logger: LoggerService) {
        this.transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.GMAIL_USER,
                pass: process.env.GMAIL_PASS, 
            },
        });
    }

    async sendOtp(email: string, otp: string): Promise<void> {
        const mailOptions = {
            from: `"Snip Auth" <${process.env.GMAIL_USER}>`,
            to: email,
            subject: 'Verify Your Email - Snip',
            html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 10px;">
          <h2 style="color: #333; text-align: center;">Welcome to Snip!</h2>
          <p style="font-size: 16px; color: #555;">To complete your registration, please use the following OTP code:</p>
          <div style="background-color: #f4f4f4; padding: 15px; border-radius: 5px; text-align: center; margin: 20px 0;">
            <span style="font-size: 32px; font-weight: bold; letter-spacing: 5px; color: #000;">${otp}</span>
          </div>
          <p style="font-size: 14px; color: #888; text-align: center;">This code will expire in 10 minutes.</p>
          <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;" />
          <p style="font-size: 12px; color: #aaa; text-align: center;">If you didn't request this, please ignore this email.</p>
        </div>
      `,
        };

        try {
            await this.transporter.sendMail(mailOptions);
            this.logger.log(`OTP email sent to ${email}`, 'MailService');
        } catch (error) {
            this.logger.error(`Failed to send OTP email to ${email}`, error.stack, 'MailService');
            throw error;
        }
    }
}
