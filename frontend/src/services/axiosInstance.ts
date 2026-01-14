import axios from "axios";
import type{ AxiosError,InternalAxiosRequestConfig } from "axios";
import { showInfoToast } from "../utils/Toast";

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
        stop();
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
            if (isRefreshing) {
                return new Promise((resolve) => {
                    retryQueue.push(() => resolve(axiosInstance(originalRequest)));
                });
            }

            originalRequest._retry = true;
            isRefreshing = true;

            try {
                await axiosInstance.get("/auth/refresh");
                processQueue();
                return axiosInstance(originalRequest);
            } catch {
                showInfoToast("Session expired. Please login again.");
                localStorage.clear();
                window.location.href = "/login";
            } finally {
                isRefreshing = false;
            }
        }

        return Promise.reject(error);
    }
);

export default axiosInstance;
