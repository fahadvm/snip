import { postRequest, getRequest } from "../api";
import { API_ROUTES } from "../constantRoutes/routes";
import type { RegisterPayload, LoginPayload, LoginResponse } from "../../types/auth";


export const authApi = {
  register: (data: RegisterPayload) => postRequest<LoginResponse, RegisterPayload>(API_ROUTES.auth.signup, data),
  login: (data: LoginPayload) => postRequest<LoginResponse, LoginPayload>(API_ROUTES.auth.login, data),
  logout: () => postRequest(API_ROUTES.auth.logout, {}),
  getMe: () => getRequest<any>(API_ROUTES.auth.me),
};
