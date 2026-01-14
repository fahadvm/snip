import { postRequest } from "../api";
import { API_ROUTES } from "../constantRoutes/routes";
import type{ RegisterPayload, LoginPayload, AuthData  } from "../../types/auth";


export const authApi = {
  register: (data: RegisterPayload) => postRequest(API_ROUTES.auth.signup,data),
  login: (data: LoginPayload) =>postRequest<AuthData, LoginPayload>(API_ROUTES.auth.login,data),
  logout: () =>postRequest<null, Record<string, never>>(API_ROUTES.auth.logout,{}),
};
