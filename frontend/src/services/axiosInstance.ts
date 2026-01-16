import axios from "axios";
import type { AxiosError, InternalAxiosRequestConfig } from "axios";
import { showInfoToast } from "../utils/Toast";
import { API_ROUTES } from "./constantRoutes/routes";

const baseURL: string = import.meta.env.VITE_API_URL;

interface RetryAxiosRequestConfig extends InternalAxiosRequestConfig {
    _retry?: boolean;
}

const axiosInstance = axios.create({
    baseURL,
    withCredentials: true,
});

/* ---------- Loader ---------- */
let activeRequests = 0;

axiosInstance.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
        activeRequests++;
        return config;
    }
);

const stopLoader = (): void => {
    activeRequests--;
    if (activeRequests <= 0) {
        activeRequests = 0;
    }
};

/* ---------- Refresh Token ---------- */
let isRefreshing = false;
let retryQueue: Array<() => void> = [];

const processQueue = (): void => {
    retryQueue.forEach((cb) => cb());
    retryQueue = [];
};

/* ---------- Response ---------- */
axiosInstance.interceptors.response.use(
    (response) => {
        stopLoader();
        return response;
    },
    async (error: AxiosError) => {
        stopLoader();

        const originalRequest = error.config as RetryAxiosRequestConfig;

        if (error.response?.status === 401 && !originalRequest._retry) {
            // If it's the refresh call itself that failed, or we are already on login, don't retry
            if (originalRequest.url === API_ROUTES.auth.refresh || window.location.pathname === '/login') {
                return Promise.reject(error);
            }

            if (isRefreshing) {
                return new Promise((resolve) => {
                    retryQueue.push(() => resolve(axiosInstance(originalRequest)));
                });
            }

            originalRequest._retry = true;
            isRefreshing = true;

            try {
                await axiosInstance.get(API_ROUTES.auth.refresh);
                processQueue();
                return axiosInstance(originalRequest);
            } catch (refreshError) {
                retryQueue = [];
                // Only redirect if we are not already going there
                if (window.location.pathname !== '/login') {
                    showInfoToast("Session expired. Please login again.");
                    window.location.href = "/login";
                }
                return Promise.reject(refreshError);
            } finally {
                isRefreshing = false;
            }
        }

        return Promise.reject(error);
    }
);

export default axiosInstance;
