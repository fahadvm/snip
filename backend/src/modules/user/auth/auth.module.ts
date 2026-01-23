
import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UserRepository } from './auth.repository';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from 'src/schemas/user.schema';
import { Otp, OtpSchema } from 'src/schemas/otp.schema';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './strategies/jwt.strategy';
import { LoggerModule } from 'src/common/logger/logger.module';
import { OtpRepository } from './otp.repository';

@Module({
    imports: [
        MongooseModule.forFeature([
            { name: User.name, schema: UserSchema },
            { name: Otp.name, schema: OtpSchema }
        ]),
        PassportModule,
        JwtModule.register({
            secret: process.env.JWT_SECRET || 'supersecret',
            signOptions: { expiresIn: '1d' },
        }),
        LoggerModule,
    ],
    controllers: [AuthController],
    providers: [
        JwtStrategy,
        {
            provide: 'IAuthService',
            useClass: AuthService,
        },
        {
            provide: 'IUserRepository',
            useClass: UserRepository,
        },
        {
            provide: 'IOtpRepository',
            useClass: OtpRepository,
        }
    ],
    exports: ['IAuthService'],
})
export class AuthModule { }
