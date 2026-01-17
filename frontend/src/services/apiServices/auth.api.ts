import { postRequest, getRequest } from "../api";
import { API_ROUTES } from "../constantRoutes/routes";
import type { RegisterPayload, LoginPayload, AuthResponse, User } from "../../types/auth";

export const authApi = {
  register: (data: RegisterPayload) => postRequest<AuthResponse, RegisterPayload>(API_ROUTES.auth.signup, data),
  login: (data: LoginPayload) => postRequest<AuthResponse, LoginPayload>(API_ROUTES.auth.login, data),
  logout: () => postRequest<{ message: string }, {}>(API_ROUTES.auth.logout, {}),
  getMe: () => getRequest<User>(API_ROUTES.auth.me),
};
