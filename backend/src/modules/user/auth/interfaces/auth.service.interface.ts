import { RegisterDto } from '../dto/register.dto';
import { VerifyOtpDto } from '../dto/verify-otp.dto';
import { AuthResponse, AuthTokens } from './auth-response.interface';
import { LoginDto } from '../dto/login.dto';
import { UserResponseDto } from '../dto/user-response.dto';

export interface IAuthService {
  register(registerDto: RegisterDto): Promise<{ message: string }>;
  verifySignup(verifyOtpDto: VerifyOtpDto): Promise<AuthResponse>;
  resendOtp(email: string): Promise<{ message: string }>;
  login(loginDto: LoginDto): Promise<AuthResponse>;
  refreshToken(token: string): Promise<AuthTokens>;
  findById(id: string): Promise<UserResponseDto>;
  logout(): Promise<{ message: string }>;
}
