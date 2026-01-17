import { Injectable, UnauthorizedException, Inject } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import type { IUserRepository } from './interfaces/auth.repository.interface';
import { LoggerService } from '../../../common/logger/logger.service';
import { IAuthService } from './interfaces/auth.service.interface';
import { JwtService } from '@nestjs/jwt';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { UserMapper } from './mappers/user.mapper';
import { AuthResponse, AuthTokens } from './interfaces/auth-response.interface';
import { UserResponseDto } from './dto/user-response.dto';

@Injectable()
export class AuthService {
  constructor(
    @Inject('IUserRepository')
    private readonly repo: IUserRepository,
    private readonly logger: LoggerService,
    private readonly jwtService: JwtService,
  ) { }

  async register(registerDto: RegisterDto): Promise<AuthResponse> {
    const { name, email, password } = registerDto;
    // Check if user exists
    const existing = await this.repo.findByEmail(email);
    if (existing) {
      throw new UnauthorizedException('User already exists');
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await this.repo.create({ name, email, password: hashedPassword });

    this.logger.log('User registered', 'AuthService');

    const tokens = await this.generateTokens(user._id.toString(), user.email);
    return {
      user: UserMapper.toDto(user),
      ...tokens,
    };
  }

  async login(loginDto: LoginDto): Promise<AuthResponse> {
    const { email, password } = loginDto;
    const user = await this.repo.findByEmail(email);

    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    if (!(await bcrypt.compare(password, user.password))) {
      throw new UnauthorizedException('Invalid password');
    }

    if (!user.isVerified) {
      throw new UnauthorizedException('Account not verified');
    }

    this.logger.log('User logged in', 'AuthService');
    const tokens = await this.generateTokens(user._id.toString(), user.email);
    return {
      user: UserMapper.toDto(user),
      ...tokens,
    };
  }

  private async generateTokens(userId: string, email: string): Promise<AuthTokens> {
    const payload = { email, sub: userId };
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(payload, {
        expiresIn: '15m',
        secret: process.env.JWT_SECRET || 'supersecret',
      }),
      this.jwtService.signAsync(payload, {
        expiresIn: '7d',
        secret: process.env.REFRESH_TOKEN_SECRET || 'refresh_secret',
      }),
    ]);

    return {
      access_token: accessToken,
      refresh_token: refreshToken,
    };
  }

  async refreshToken(token: string): Promise<AuthTokens> {
    try {
      const payload = await this.jwtService.verifyAsync(token, {
        secret: process.env.REFRESH_TOKEN_SECRET || 'refresh_secret',
      });
      return this.generateTokens(payload.sub, payload.email);
    } catch {
      throw new UnauthorizedException('Invalid refresh token');
    }
  }

  async findById(id: string): Promise<UserResponseDto> {
    const user = await this.repo.findById(id);
    if (!user) throw new UnauthorizedException('User not found');
    return UserMapper.toDto(user);
  }

  async logout(): Promise<{ message: string }> {
    this.logger.log('User logged out', 'AuthService');
    return { message: 'Logged out successfully' };
  }
}
