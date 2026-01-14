import { postRequest, getRequest } from "../api";
import { API_ROUTES } from "../constantRoutes/routes";
import type { ShortUrl } from "../../types/url";


export const urlApi = {
    create: (data: { originalUrl: string }) => postRequest(API_ROUTES.url.create, data),
    getMyUrls: () => getRequest<ShortUrl[]>(API_ROUTES.url.list),
};
