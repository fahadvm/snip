export interface RegisterPayload {
  name: string;
  email: string;
  password: string;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface LoginResponse {
  user: {
    id: string;
    name: string;
    email: string;
    isVerified: boolean;
  };
  access_token: string;
}

export interface AuthData {
  accessToken: string;
}
