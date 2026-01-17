import { UserResponseDto } from '../dto/user-response.dto';

export interface AuthTokens {
    access_token: string;
    refresh_token: string;
}

export interface AuthResponse extends AuthTokens {
    user: UserResponseDto;
}
