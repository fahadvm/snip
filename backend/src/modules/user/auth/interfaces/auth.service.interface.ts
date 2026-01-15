import { User } from "src/schemas/user.schema";

export interface IAuthService {
  register(
    name: string,
    email: string,
    password: string,
  ): Promise<void>;

  login(
    email: string,
    password: string,
  ): Promise<User>;

  logout(): Promise<boolean>;

  sendOtp(email: string): Promise<void>;

  resendOtp(email: string): Promise<void>;
}
