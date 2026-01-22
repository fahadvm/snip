import { postRequest, getRequest } from "../api";
import { API_ROUTES } from "../constantRoutes/routes";
import type { ShortUrl } from "../../types/url";

export const urlApi = {
    create: (data: { originalUrl: string; customCode?: string }) =>
        postRequest<ShortUrl, { originalUrl: string; customCode?: string }>(API_ROUTES.url.create, data),
    getMyUrls: (search?: string) =>
        getRequest<ShortUrl[]>(`${API_ROUTES.url.list}${search ? `?search=${encodeURIComponent(search)}` : ''}`),
    getDetails: (id: string) => getRequest<ShortUrl>(API_ROUTES.url.details(id)),
};
