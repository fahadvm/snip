import { Controller, Post, Body, Res, Req, Get, UseGuards, Inject } from '@nestjs/common';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import type { Response, Request } from 'express';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import type { RequestWithUser } from '../../../common/interfaces/request-with-user.interface';
import { UserResponseDto } from './dto/user-response.dto';
import { VerifyOtpDto } from './dto/verify-otp.dto';
import type { IAuthService } from './interfaces/auth.service.interface';

@Controller('auth')
export class AuthController {
  constructor(
    @Inject('IAuthService')
    private readonly authService: IAuthService
  ) { }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  async getMe(@Req() req: RequestWithUser): Promise<{ ok: boolean, data: UserResponseDto }> {
    return { ok: true, data: await this.authService.findById(req.user.userId) };
  }

  private setCookies(res: Response, accessToken: string, refreshToken: string) {
    res.cookie('accessToken', accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 15 * 60 * 1000, // 15 mins
    });
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });
  }

  @Post('register')
  async register(@Body() registerDto: RegisterDto) {
    const result = await this.authService.register(registerDto);
    return { ok: true, ...result };
  }

  @Post('verify-otp')
  async verifyOtp(@Body() verifyOtpDto: VerifyOtpDto, @Res({ passthrough: true }) res: Response) {
    const data = await this.authService.verifySignup(verifyOtpDto);
    this.setCookies(res, data.access_token, data.refresh_token);
    return { ok: true, message: 'Account verified and created successfully', data: { user: data.user } };
  }

  @Post('resend-otp')
  async resendOtp(@Body('email') email: string) {
    const result = await this.authService.resendOtp(email);
    return { ok: true, ...result };
  }

  @Post('login')
  async login(@Body() loginDto: LoginDto, @Res({ passthrough: true }) res: Response) {
    const data = await this.authService.login(loginDto);
    this.setCookies(res, data.access_token, data.refresh_token);
    return { ok: true, message: 'Login successful', data: { user: data.user } };
  }

  @Get('refresh')
  async refresh(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
    const refreshToken = req.cookies['refreshToken'];
    if (!refreshToken) throw new Error('No refresh token');

    const data = await this.authService.refreshToken(refreshToken);
    this.setCookies(res, data.access_token, data.refresh_token);
    return { ok: true, message: 'Token refreshed' };
  }

  @Post('logout')
  logout(@Res({ passthrough: true }) res: Response) {
    res.clearCookie('accessToken');
    res.clearCookie('refreshToken');
    return this.authService.logout();
  }
}
