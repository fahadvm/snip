import { postRequest, getRequest } from "../api";
import { API_ROUTES } from "../constantRoutes/routes";

export const urlApi = {
    create: (data: { originalUrl: string }) => postRequest(API_ROUTES.url.create, data),
    getMyUrls: () => getRequest(API_ROUTES.url.list),
    getDetails: (id: string) => getRequest(API_ROUTES.url.details(id)),
};
