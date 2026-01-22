import { postRequest, getRequest, deleteRequest } from "../api";
import { API_ROUTES } from "../constantRoutes/routes";
import type { ShortUrl } from "../../types/url";

export const urlApi = {
    create: (data: { originalUrl: string; customCode?: string }) =>
        postRequest<ShortUrl, { originalUrl: string; customCode?: string }>(API_ROUTES.url.create, data),
    getMyUrls: (page: number = 1, limit: number = 10, search?: string) => {
        const params = new URLSearchParams({
            page: page.toString(),
            limit: limit.toString(),
        });
        if (search) params.append('search', search);

        return getRequest<ShortUrl[]>(`${API_ROUTES.url.list}?${params.toString()}`);
    },
    getDetails: (id: string) => getRequest<ShortUrl>(API_ROUTES.url.details(id)),
    update: (id: string, data: { originalUrl: string; customCode?: string }) =>
        postRequest<ShortUrl, { originalUrl: string; customCode?: string }>(`${API_ROUTES.url.update(id)}`, data),
    delete: (id: string) => deleteRequest<{ ok: boolean; message: string }>(API_ROUTES.url.delete(id)),
};
